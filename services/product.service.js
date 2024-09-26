const Verification = require('../helpers/verification.service')
const Functions = require('../helpers/functions.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')
const { Sequelize } = require('../config/database')
const { allCommentService } = require('./comment.service')

class ProductService {
    // POST
    async addProductService(body, filenames, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const slug = await Functions.generateSlug(body.tm_name)
            const _product = await Models.Products.findOne({
                where: {
                    [Op.or]: [
                        { barcode: body.barcode },
                        { stock_code: body.stock_code }
                    ]
                }
            }).catch((err) => { console.log(err) })
            if (_product) { return Response.Forbidden('Maglumat eýýäm döredilen!', []) }
            const subscription = await Models.Sellers.findOne({
                attributes: ['subscriptionId'],
                where: { id: seller }
            }).catch((err) => { console.log(err) })
            console.log('SUBSCTIPTIONS --> ', JSON.stringify(subscription, null, 2))
            const limits = await Models.Subscriptions.findOne({
                attributes: ['p_limit', 'p_img_limit'],
                where: { id: subscription.subscriptionId }
            }).catch((err) => { console.log(err) })
            console.log('LIMITS --> ', JSON.stringify(limits, null, 2))
            await Models.Products.findAll({
                attributes: ['slug'],
                where: { sellerId: seller },
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
            let final_price = body.sale_price
            if (body.dis_price > 0) {
                if (body?.dis_type === 'goterim') {
                    let discount_amount = (body.sale_price * body.dis_price) / 100
                    final_price = body.sale_price - discount_amount
                } else {
                    final_price -= body.dis_price
                }
            }
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
                dis_price: body.dis_price,
                final_price: final_price,
                dis_type: body.dis_type || 'manat',
                model_code: body.model_code || Date.now(),
                gender: body.gender,
                subcategoryId: body.subcategoryId,
                brandId: body.brandId,
                sellerId: seller
            }).catch((err) => { console.log(err) })
            if (body?.features) {
                for (let item of body.features) {
                    await Models.ProductFeatures.create({
                        productId: product.id,
                        featureDescriptionId: item
                    }).then(() => { console.log(true) })
                    .catch((err) => { console.log(err) })
                }
            }
            if (filenames.img) {
                filenames.img.forEach(async (item, index) => {
                    await Models.ProductImages.create({
                        img: item.filename,
                        productId: product.id
                    }).then(() => { console.log(true) })
                    .catch((err) => { console.log(err) })
                })
            }
            return Response.Created('Haryt goýuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async addProductImageService(body, filenames, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const product = await Models.Products.findOne({ where: { id: body.id, sellerId: seller }, attributes: ['id'] })
            if (!product) { return Response.Forbidden('Rugsat edilmedi!', []) }
            const subscription = await Models.Sellers.findOne({
                attributes: ['subscriptionId'],
                where: { id: seller }
            }).catch((err) => { console.log(err) })

            const limits = await Models.Subscriptions.findOne({
                attributes: ['p_img_limit'],
                where: { id: subscription.subscriptionId }
            }).catch((err) => { console.log(err) })

            await Models.Products.findAll({
                attributes: ['slug'],
                where: { sellerId: seller },
                include: { model: Models.ProductImages },
                order: [['id', 'ASC']]
            }).then((res) => {
                const image_count = res.reduce((count, product) => count + product.product_images.length, 0)
                console.log('IMAGE COUNT: ', image_count)
                if (image_count >= limits.p_img_limit) {
                    return Response.Forbidden('Limidiniz doldy!', [])
                }
            }).catch((err) => { console.log(err) })

            if (filenames.img) {
                filenames.img.forEach(async (item) => {
                    await Models.ProductImages.create({
                        img: item.filename,
                        productId: product.id
                    }).then(() => { console.log(true) })
                    .catch((err) => { console.log(err) })
                })
            }
            return Response.Created('Surat goýuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async addProductReviewService(body, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const order = await Models.OrderItems.findOne({
                where: { productId: body.productId },
                include: {
                    model: Models.Orders,
                    required: true,
                    where: {
                        customerId: customer,
                        status: 'completed'
                    }
                }
            }).catch((err) => console.log(err))
            if (!order) { return Response.Forbidden('Harydy sargyt etmediňiz!', {}) }
            const [review, created] = await Models.ProductReviews.findOrCreate({
                where: {
                    productId: body.productId,
                    customerId: customer
                },
                defaults: {
                    star: body.star,
                    productId: body.productId,
                    customerId: customer
                }
            })
            if (created == false) {
                review.star = body.star
                await review.save()
            }
            return Response.Created('Maglumat döredildi!', review)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async addCouponService(body, img, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const limit = await Models.Sellers.findOne({
                attributes: [],
                where: { id: seller },
                include: {
                    model: Models.Subscriptions,
                    attributes: ['voucher_limit']
                }
            }).catch((err) => { console.log(err) })
            const coupon_count = await Models.Coupons.count({ where: { userId: userId } })
            if (limit.subscription.voucher_limit <= coupon_count) {
                return Response.Forbidden('Limidiňiz doldy!', [])
            }
            await Models.Coupons.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                tm_desc: body.tm_desc,
                ru_desc: body.ru_desc || null,
                en_desc: body.en_desc || null,
                img: img.filename,
                conditions: body.conditions,
                min_amount: body.min_amount || null,
                limit: body.limit,
                start_date: body.start_date,
                end_date: body.end_date,
                isPublic: body.isPublic,
                sellerId: seller
            }).catch((err) => { console.log(err) })
            return Response.Created('Kupon döredildi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // PUT
    async updateProductService(userId, body) {
        try {
            const obj = {}
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const isProduct = await Models.Products.findOne({ where: { id: body.productId, sellerId: seller }, attributes: ['id'] })
            if (!isProduct) { return Response.Forbidden('Bu haryt size degişli däl!', []) }
            let final_price = body.sale_price
            if (body.dis_price > 0) {
                if (body?.dis_type === 'goterim') {
                    let discount_amount = (body.sale_price * body.dis_price) / 100
                    final_price = body.sale_price - discount_amount
                } else {
                    final_price -= body.dis_price
                }
            }
            for (const item in body) { if (item && item !== 'productId') { obj[item] = body[item] } }
            obj.final_price = final_price
            await Models.Products.update(obj, { where: { id: isProduct.id } })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            let query = {
                gender: q.gender || '',
                subcategoryId: q.subcategoryId || 0,
                brandId: q.brandId || 0
            }
            for (const key in query) { if (query[key]) { obj[key] = await query[key] } }
            obj.isActive = true
            if (q.isActive == 'all') { delete obj.isActive }
            obj.final_price = { [Op.between]: [start_price, end_price] }

            const subquery = await Models.Products.findAll({
                attributes: [
                  [Sequelize.fn('DISTINCT', Sequelize.col('model_code')), 'model_code'],
                  [Sequelize.fn('MIN', Sequelize.col('id')), 'id']
                ],
                group: ['model_code'],
                raw: true
            }).catch((err) => console.log(err))
            const subqueryIds = (subquery).map(item => item.id)

            const products = await Models.Products.findAndCountAll({
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                where: {
                    [Op.and]: obj,
                    [Op.or]: [
                        { id: { [Op.in]: subqueryIds } },
                        { model_code: { [Op.notIn]: subquery.map(item => item.model_code) } }
                    ]
                },
                include: [
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'logo', 'name']
                    },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            }).catch((err) => { console.log(err) })
            const result = { count: 0, rows: [] }
            result.count = await products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                }).catch((err) => console.log(err))
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating
                })
            }))
            if (order === 'desc') {
                if (sort === 'final_price') { result.rows.sort((a, b) => Number(b.final_price) - Number(a.final_price)) }
                else { result.rows.sort((a, b) => Number(b.id) - Number(a.id)) }
            } else {
                if (sort === 'final_price') { result.rows.sort((a, b) => Number(a.final_price) - Number(b.final_price)) }
                else { result.rows.sort((a, b) => Number(a.id) - Number(b.id)) }
            }
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async searchProductService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let whereState = { isActive: true }
            let search = []
            if (q.name) {
                search = [
                    { tm_name: { [Op.iLike]: `%${q.name}%` } },
                    { ru_name: { [Op.iLike]: `%${q.name}%` } },
                    { en_name: { [Op.iLike]: `%${q.name}%` } },
                    { tm_desc: { [Op.iLike]: `%${q.name}%` } },
                    { ru_desc: { [Op.iLike]: `%${q.name}%` } },
                    { en_desc: { [Op.iLike]: `%${q.name}%` } }
                ]
            }
            if (q.sellerId) whereState.sellerId = q.sellerId

            const subquery = await Models.Products.findAll({
                attributes: [
                  [Sequelize.fn('DISTINCT', Sequelize.col('model_code')), 'model_code'],
                  [Sequelize.fn('MIN', Sequelize.col('id')), 'id']
                ],
                group: ['model_code'],
                raw: true
            }).catch((err) => console.log(err))
            const subqueryIds = (subquery).map(item => item.id)

            const products = await Models.Products.findAndCountAll({
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                where: {
                    [Op.or]: search,
                    [Op.and]: whereState,
                    [Op.or]: [
                        { id: { [Op.in]: subqueryIds } },
                        { model_code: { [Op.notIn]: subquery.map(item => item.model_code) } }
                    ]
                },
                include: [
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'logo', 'name']
                    },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false
                    }
                ],
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => console.log(err))
            const result = { count: 0, rows: [] }
            result.count = products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                })
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating,
                })
            })).catch((err) => { console.log(err) })
            return Response.Success('Gözleg netijesi', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async offerProductService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'asc'
            let whereState = { isActive: true }
            if (q.dis_type) whereState.dis_type = q.dis_type
            if (q.sellerId) whereState.sellerId = q.sellerId

            const subquery = await Models.Products.findAll({
                attributes: [
                  [Sequelize.fn('DISTINCT', Sequelize.col('model_code')), 'model_code'],
                  [Sequelize.fn('MIN', Sequelize.col('id')), 'id']
                ],
                group: ['model_code'],
                raw: true
            }).catch((err) => console.log(err))
            const subqueryIds = (subquery).map(item => item.id)

            const products = await Models.Products.findAndCountAll({
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                where: {
                    [Op.and]: whereState,
                    [Op.or]: [
                        { id: { [Op.in]: subqueryIds } },
                        { model_code: { [Op.notIn]: subquery.map(item => item.model_code) } }
                    ]
                },
                include: [
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'logo', 'name']
                    },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            }).catch((err) => { console.log(err) })
            const result = { count: 0, rows: [] }
            result.count = await products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                }).catch((err) => { console.log(err) })
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating
                })
            })).catch((err) => { console.log(err) })
            if (order === 'desc') result.rows.sort((a, b) => Number(b.dis_price) - Number(a.dis_price))
            else result.rows.sort((a, b) => Number(a.dis_price) - Number(b.dis_price))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async topSellingService(q) {
        try {
            let result = []
            let products = []
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            const selling_products = await Models.OrderItems.findAll({
                attributes: [
                    'productId',
                    [Sequelize.fn('COUNT', Sequelize.col('quantity')), 'totalSelling']
                ],
                group: ['productId'],
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => console.log(err))
            for (let item of selling_products) {
                let product = await Models.Products.findOne({
                    where: { id: item.productId, isActive: true },
                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                    include: [
                        {
                            model: Models.Sellers,
                            attributes: ['id', 'logo', 'name']
                        },
                        {
                            model: Models.Subcategories,
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                            where: { isActive: true }, required: false
                        },
                        {
                            model: Models.Brands,
                            attributes: ['id', 'name', 'img', 'slug'],
                            where: { isActive: true }, required: false
                        }
                    ]
                }).catch((err) => console.log(err))
                product.dataValues.totalSelling = Number(item.dataValues.totalSelling)
                products.push(product)
            }
            await Promise.all(products.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                })
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
                result.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating
                })
            })).catch((err) => console.log(err))
            if (order === 'desc') result.sort((a, b) => Number(b.totalSelling) - Number(a.totalSelling))
            else result.sort((a, b) => Number(a.totalSelling) - Number(b.totalSelling))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async topLikedService(q) {
        try {
            let result = []
            let products = []
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            const top_liked = await Models.Likes.findAll({
                attributes: [
                    'productId',
                    [Sequelize.fn('COUNT', Sequelize.col('productId')), 'totalLiked']
                ],
                group: ['productId'],
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => console.log(err))
            for (let item of top_liked) {
                let product = await Models.Products.findOne({
                    where: { id: item.productId, isActive: true },
                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                    include: [
                        {
                            model: Models.Sellers,
                            attributes: ['id', 'logo', 'name']
                        },
                        {
                            model: Models.Subcategories,
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                            where: { isActive: true }, required: false
                        },
                        {
                            model: Models.Brands,
                            attributes: ['id', 'name', 'img', 'slug'],
                            where: { isActive: true }, required: false
                        }
                    ]
                }).catch((err) => console.log(err))
                product.dataValues.totalLiked = Number(item.dataValues.totalLiked)
                products.push(product)
            }
            await Promise.all(products.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                }).catch((err) => console.log(err))
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
                result.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating
                })
            })).catch((err) => console.log(err))
            if (order === 'desc') result.sort((a, b) => Number(b.totalLiked) - Number(a.totalLiked))
            else result.sort((a, b) => Number(a.totalLiked) - Number(b.totalLiked))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async topRatedService(q) {
        try {
            let result = []
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            let products = await Models.Products.findAll({
                where: { isActive: true },
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                include: [
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'logo', 'name']
                    },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false
                    }
                ],
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => console.log(err))
            await Promise.all(products.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                }).catch((err) => console.log(err))
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
                result.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating
                })
            })).catch((err) => console.log(err))
            if (order === 'desc') result.sort((a, b) => Number(b.rating) - Number(a.rating))
            else result.sort((a, b) => Number(a.rating) - Number(b.rating))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async fetchProductService(id) {
        try {
            let result = []
            const product = await Models.Products.findOne({ where: { id: id, isActive: true }, attributes: ['model_code'] })
            const products = await Models.Products.findAll({
                where: { model_code: product.model_code, isActive: true },
                attributes: { exclude: ['couponId', 'createdAt', 'updatedAt', 'isActive', 'org_price', 'stock_code', 'brandId', 'sellerId'] },
                include: [
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'name', 'logo', 'isVerified']
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img'],
                        where: { isActive: true }, required: false,
                    },
                ]
            }).catch((err) => console.log(err))
            await Promise.all(products.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                }).catch((err) => console.log(err))
                const rating = await this.fetchReviewService(item.id)
                const comment = await allCommentService({ productId: item.id })
                const _features = await Models.ProductFeatures.findAll({
                    where: { productId: item.id, isActive: true },
                    attributes: [],
                    include: {
                        model: Models.FeatureDescriptions,
                        attributes: ['id', 'desc'],
                        include: {
                            model: Models.Features,
                            attributes: ['id', 'name']
                        }
                    }
                }).catch((err) => console.log(err))
                const features = await _features.map(item => ({
                    id: item.feature_description.id,
                    name: item.feature_description.feature.name,
                    desc: item.feature_description.desc
                }))

                result.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment.detail,
                    rating: rating.detail.rating,
                    features: features
                })
            })).catch((err) => console.log(err))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allSubcategoryService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let whereState = { isActive: true }
            if (q.status === 'all') { whereState = {} }
            const subcategories = await Models.Categories.findAndCountAll({
                where: whereState,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId'] },
                include: {
                    model: Models.Subcategories,
                    required: true,
                    attributes: ['id', 'slug', 'tm_name', 'ru_name', 'en_name', 'logo']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (subcategories.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', subcategories)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allSubcategoryFeaturesService(q) {
        try {
            const featureIds = await Models.SubcategoryFeatures.findAll({
                attributes: ['featureId'],
                where: { subcategoryId: q.id }
            }).catch((err) => console.log(err))
            if (featureIds.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            let result = []
            for (const item of featureIds) {
                const feature = await Models.Features.findAll({
                    where: { isActive: true, id: item.featureId },
                    attributes: ['name'],
                    include: {
                        model: Models.FeatureDescriptions,
                        where: { isActive: true },
                        attributes: ['id', 'desc']
                    }
                })
                result.push(...feature)
            }
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async productLikesService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const likes = await Models.Likes.findAndCountAll({
                attributes: ['id'],
                where: { productId: q.id },
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'fullname', 'img']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            }).catch((err) => console.log(err))
            if (likes.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', likes)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // DELETE
    async deleteProductImageService(id, user) {
        try {
            const product_image = await Models.ProductImages.findOne({ where: { id: Number(id) }, attributes: ['id', 'productId']})
            if (user.group == 1 || user.group == 2) {
                await Models.ProductImages.destroy({ where: { id: Number(id) } })
                    .then(() => { console.log(true) })
                return Response.Success('Üstünlikli!', [])
            }
            const seller = await Verification.isSeller(user.id)
            if (isNaN(seller)) { return seller }
            const product = await Models.Products.findOne({ where: { id: product_image.productId, sellerId: Number(seller) } })
            if (!product) { return Response.Forbidden('Rugsat edilmedi!', []) }
            await Models.ProductImages.destroy({ where: { id: Number(product_image.id) } })
                .then(() => { console.log(true) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async deleteProductService(id, user) {
        try {
            if (user.group == 1) {
                await Models.Products.destroy({ where: { id: Number(id) } })
                    .then(() => { console.log(true) })
                return Response.Success('Üstünlikli!', [])
            }
            const seller = await Verification.isSeller(user.id)
            if (isNaN(seller)) { return seller }
            const product = await Models.Products.findOne({ where: { id: id, sellerId: Number(seller) } })
            if (!product) { return Response.Forbidden('Rugsat edilmedi!', []) }
            await Models.Products.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new ProductService()