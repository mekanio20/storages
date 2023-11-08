const Response = require('../services/response.service')
const Models = require('../config/models')
const { Sequelize } = require('../config/database')

class ProductService {
    
    async isExists(Model, slug) {
        try {
            return Model.findAll({ where: { slug: slug } })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async isSeller(userId) {
        try {
            const seller = await Models.Sellers.findOne({
                attributes: ['id'],
                where: {
                    userId: userId
                }
            })
            return seller.id
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // POST
    async addProductService(body, filenames, userId) {
        try {
            const sellerId = await this.isSeller(userId)
            if (!sellerId) { return Response.NotFound('Satyjy tapylmady!', []) }
            let slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _product = await this.isExists(Models.Products, slug)
            if (_product.length > 0) { return Response.Forbidden('Maglumat eyyam döredilen!', []) }
            const subscription = await Models.Sellers.findOne({
                attributes: ['subscriptionId'],
                where: { 
                    id: sellerId
                }
            })
            console.log('SUBSCTIPTIONS --> ', JSON.stringify(subscription, 2, null))
            const limits = await Models.Subscriptions.findOne({
                attributes: ['p_limit', 'p_img_limit'],
                where: {
                    id: subscription.subscriptionId
                }
            })
            console.log('LIMITS --> ', JSON.stringify(limits, 2, null))
            await Models.Products.findAll({
                attributes: ['slug'],
                where: { sellerId: sellerId },
                include: { model: Models.ProductImages },
                order: [['id', 'ASC']]
            }).then((res) => { 
                const product_count = res.length
                const image_count = res.reduce((count, product) => count + product.product_images.length, 0)
                console.log('PRODUCT COUNT: ', product_count)
                console.log('IMAGE COUNT: ', image_count)
                if (product_count >= limits.p_limit || image_count >= limits.p_img_limit) {
                    return Response.Forbidden('Limidiniz doldy!', [])
                }
            }).catch((err) => { console.log(err) })
            console.log('LOADING...')
            const product = await Models.Products.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                tm_desc: body.tm_desc,
                ru_desc: body.ru_desc || null,
                en_desc: body.en_desc || null,
                slug: slug,
                barcode: body.barcode,
                stock_code: body.stock_code,
                quantity: body.quantity,
                org_price: body.org_price,
                sale_price: body.sale_price,
                gender: body.gender,
                subscriptionId: body.subscriptionId,
                brandId: body.brandId,
                sellerId: sellerId
            })
            if (filenames.img) {
                filenames.img.forEach(async (item, index) => {
                    await Models.ProductImages.create({
                        img: item.filename,
                        order: index + 1,
                        productId: product.id
                    })
                    .then(() => { console.log(true) })
                    .catch((err) => { console.log(err) })
                })
            }
            return Response.Created('Haryt goýuldy!', product)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addProductFeatureService(body) {
        try {
            await Models.ProductFeatures.bulkCreate(body.product_features)
                .then(() => { return Response.Created('Haryt ayratynlyklary goshuldy!', []) })
                .catch((err) => { console.log(err) })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addProductReviewService(body) {
        try {
            const order = await Models.Orders.findOne({
                attributes: ['id'],
                where: {
                    customerId: body.customerId,
                    productId: body.productId,
                    status: 'completed'
                }
            })
            if (!order) { return Response.Forbidden('Harydy sargyt etmediniz!', []) }
            // Eger on yyldyz goyan bolsa update etmeli...
            const review = await Models.ProductReviews.create({
                star: body.star,
                productId: body.productId,
                customerId: body.customerId
            })
            return Response.Created('Maglumat ugradyldy!', review)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async allProductService(q) {
        try {
            let obj = {}
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let query = {
                subcategoryId: q.subcategoryId || '',
                brandId: q.brandId || '',
                sellerId: q.sellerId || '',
                gender: q.gender || ''
            }
            console.log(query)
            for (const key in query) {
                if (query[key].length > 0) {
                    obj[key] = query[key]
                }
            }
            console.log('OBJ --> ', JSON.stringify(obj, 2, null))
            const products = await Models.Products.findAll({
                where: obj,
                offset: Number(offset),
                limit: Number(limit)
            })
            return Response.Success('Üstünlikli!', products)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchProductService(slug) {
        try {
            const product = await Models.Products.findOne({
                where: {
                    slug: slug,
                    isActive: true
                },
                attributes: { exclude: ['slug', 'createdAt', 'updatedAt'] },
                include: [
                    {
                        model: Models.ProductImages,
                        attributes: ['id', 'img', 'order']
                    },
                    {
                        model: Models.ProductFeatures,
                        where: { isActive: true },
                        include: {
                            model: Models.FeatureDescriptions,
                            where: { isActive: true },
                            attributes: ['id', 'desc'],
                            include: {
                                model: Models.Features,
                                where: { isActive: true }
                            }
                        }
                    }
                ]
            })
            return Response.Success('Üstünlikli!', product)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchReviewService(id) {
        try {
            let sum1 = 0
            let sum2 = 0
            const reviews = await Models.ProductReviews.findAll({
                where: { productId: id },
                attributes: [
                    'star',
                    [Sequelize.fn('COUNT', Sequelize.col('customerId')), 'total_customers']
                ],
                group: ['star'],
                order: [['star', 'DESC']]
            })
            reviews.forEach((item) => {
                sum1 += Number(item.dataValues.total_customers)
                sum2 += Number(item.dataValues.star) * Number(item.dataValues.total_customers)
            })
            const sum = sum2 / sum1
            const obj = { reviews: reviews, rating: sum }
            return Response.Success('Üstünlikli!', obj)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new ProductService()