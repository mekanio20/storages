const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')
const { Sequelize } = require('../config/database')
const { allCommentService } = require('./comment.service')

class ProductService {

    // POST
    async addProductService(body, filenames, userId) {
        try {
            const sellerId = await Verification.isSeller(userId)
            if (!sellerId) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            let slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _product = await Verification.isFound(Models.Products, slug)
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

    async addCouponService(body, img, userId) {
        try {
            const sellerId = await Verification.isSeller(userId)
            if (!sellerId) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            const limit = await Models.Subscriptions.findOne({
                attributes: ['voucher_limit'],
                where: { sellerId: sellerId }
            })
            const coupon_count = await Models.Coupons.count({ where: { sellerId: sellerId } })
            if (limit.voucher_limit <= coupon_count) {
                return Response.Forbidden('Limidiniz doldy!', [])
            }
            await Models.Coupons.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                tm_desc: body.tm_desc,
                ru_desc: body.ru_desc || null,
                en_desc: body.en_desc || null,
                img: img[0].filename,
                conditions: body.conditions,
                min_amount: body.min_amount,
                limit: body.limit,
                star_date: body.star_date,
                end_date: body.end_date,
                isPublic: body.isPublic,
                sellerId: sellerId
            }).catch((err) => { console.log(err) })
            return Response.Created('Kupon doredildi!', [])
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
            let start_price = Number(q.start_price) || 0
            let end_price = Number(q.end_price) || 100000
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            let rating = q.rating || ''
            let search = []
            if (q.name) {
                // await Models.Searches.create({ input: q.name, userId: 1 })
                //     .then(() => { console.log('search created...') })
                //     .catch((err) => { console.log(err) })
                search = [
                    { tm_name: { [Op.iLike]: `%${q.name}%` } },
                    { ru_name: { [Op.iLike]: `%${q.name}%` } },
                    { en_name: { [Op.iLike]: `%${q.name}%` } },
                    { tm_desc: { [Op.iLike]: `%${q.name}%` } },
                    { ru_desc: { [Op.iLike]: `%${q.name}%` } },
                    { en_desc: { [Op.iLike]: `%${q.name}%` } }
                ]
            }
            let query = {
                gender: q.gender || '',
                subcategoryId: q.subcategoryId || 0,
                sellerId: q.sellerId || 0,
                brandId: q.brandId || 0
            }
            for (const key in query) {
                if (query[key]) {
                    obj[key] = query[key]
                }
            }
            obj.isActive = true
            if (q.isActive == 'all') { delete obj.isActive }
            obj.sale_price = { [Op.between]: [start_price, end_price] }
            search.push(obj)
            const products = await Models.Products.findAndCountAll({
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive', 'slug', 'gender', 'quantity', 'org_price', 'sale_price'],
                where: { [Op.or]: search },
                include: [
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true }, required: false,
                        include: {
                            model: Models.Categories,
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                            where: { isActive: true }, require: false
                        }
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'name']
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            })
            const result = { count: 0, rows: [] }
            result.count = products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
                const comment = await allCommentService({ productId: item.id })
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count,
                })
            })).catch((err) => { console.log(err) })
            if (rating === 'asc') { result.rows.sort((a, b) => b.rating - a.rating) }
            else if (rating === 'desc') { result.rows.sort((a, b) => a.rating - b.rating) }
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchProductService(slug) {
        try {
            const product = await Models.Products.findOne({
                where: { slug: slug, isActive: true },
                include: [
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true }, required: false,
                        include: {
                            model: Models.Categories,
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                            where: { isActive: true }, required: false,
                        }
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false,
                    },
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'name', 'logo', 'isVerified']
                    }
                ],
                attributes: { exclude: ['slug', 'subcategoryId', 'brandId', 'sellerId', 'createdAt', 'updatedAt'] }
            })
            const images = await Models.ProductImages.findAndCountAll({ where: { productId: product.id } })
            const rating = await this.fetchReviewService(product.id)
            const comment = await allCommentService({ productId: product.id })
            const response = {
                ...product.dataValues,
                images: images,
                rating: rating.detail.rating,
                reviews: comment.detail
            }
            return Response.Success('Üstünlikli!', response)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchReviewService(id) {
        try {
            let sum1 = 0
            let sum2 = 0
            const reviews = await Models.ProductReviews.findAll({
                where: { productId: id, isActive: true },
                attributes: [
                    'star',
                    [Sequelize.fn('COUNT', Sequelize.col('customerId')), 'total_customers']
                ],
                group: ['star'],
                order: [['star', 'DESC']]
            })
            if (reviews.length === 0) {
                return Response.Success('Üstünlikli!', { reviews: [], rating: 0 })
            }
            reviews.forEach((item) => {
                sum1 += Number(item.dataValues.total_customers)
                sum2 += Number(item.dataValues.star) * Number(item.dataValues.total_customers)
            })
            const sum = sum2 / sum1
            return Response.Success('Üstünlikli!', { reviews: reviews, rating: sum })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteProductService(id, user) {
        try {
            if (user.group == 1) {
                await Models.Products.destroy({ where: { id: Number(id) } })
                    .then(() => { console.log(true) })
                return Response.Success('Üstünlikli!', [])
            }
            const sellerId = await Verification.isSeller(user.id)
            if (!sellerId) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            const product = await Models.Products.findOne({ where: { sellerId: Number(sellerId) } })
            if (!product) { return Response.Forbidden('Rugsat edilmedi!', []) }
            await Models.Products.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new ProductService()