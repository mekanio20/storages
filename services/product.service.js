const Response = require('../services/response.service')
const { Products, Sellers, Subscriptions, ProductImages, ProductFeatures, Orders, ProductReviews } = require('../config/models')

class ProductService {
    // POST
    async addProductService(body, filenames) {
        try {
            let slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _product = await this.isExists(Products, slug)
            if (_product.length > 0) { return Response.Forbidden('Maglumat döredilen!', []) }
            const subscription = await Sellers.findOne({
                attributes: ['subscriptionId'],
                where: { 
                    id: body.sellerId
                }
            })
            console.log('SUBSCTIPTIONS', subscription);
            const limits = await Subscriptions.findOne({
                attributes: ['p_limit', 'p_img_limit'],
                where: {
                    id: subscription.subscriptionId
                }
            })
            console.log('LIMITS', limits);
            await Products.findAll({
                attributes: ['slug'],
                where: { sellerId: body.sellerId },
                include: { model: ProductImages },
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
            const product = await Products.create({
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
                sellerId: body.sellerId
            })
            if (filenames.img) {
                filenames.img.forEach(async (item, index) => {
                    await ProductImages.create({
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
            await ProductFeatures.bulkCreate(body.product_features)
                .then(() => { return Response.Created('Haryt ayratynlyklary goshuldy!', []) })
                .catch((err) => { console.log(err) })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addProductReviewService(body) {
        try {
            const order = await Orders.findOne({
                attributes: ['id'],
                where: {
                    customerId: body.customerId,
                    productId: body.productId,
                    status: 'completed'
                }
            })
            if (!order) { return Response.Forbidden('Harydy sargyt etmediniz!', []) }
            const review = await ProductReviews.create({
                star: body.star,
                productId: body.productId,
                customerId: body.customerId
            })
            return Response.Created('Maglumat ugradyldy!', review)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new ProductService()