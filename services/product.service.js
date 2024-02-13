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
            const slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _product = await Models.Products.findOne({
                where: {
                    [Op.or]: [
                        { slug: slug },
                        { barcode: body.barcode },
                        { stock_code: body.stock_code }
                    ]
                }
            }).catch((err) => { console.log(err) })
            if (_product) { return Response.Forbidden('Maglumat eýýäm döredilen!', []) }
            const subscription = await Models.Sellers.findOne({
                attributes: ['subscriptionId'],
                where: {
                    id: sellerId
                }
            }).catch((err) => { console.log(err) })
            console.log('SUBSCTIPTIONS --> ', JSON.stringify(subscription, 2, null))
            const limits = await Models.Subscriptions.findOne({
                attributes: ['p_limit', 'p_img_limit'],
                where: {
                    id: subscription.subscriptionId
                }
            }).catch((err) => { console.log(err) })
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
                subcategoryId: body.subcategoryId,
                brandId: body.brandId,
                sellerId: sellerId
            }).catch((err) => { console.log(err) })
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

    async addProductReviewService(body, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const order = await Models.Orders.findOne({
                attributes: ['id'],
                where: {
                    customerId: customerId,
                    productId: body.productId,
                    status: 'completed'
                }
            })
            if (!order) { return Response.Forbidden('Harydy sargyt etmediňiz!', []) }
            const [review, created] = await Models.ProductReviews.findOrCreate({
                where: {
                    productId: body.productId,
                    customerId: customerId
                },
                defaults: {
                    star: body.star,
                    productId: body.productId,
                    customerId: customerId
                }
            })
            if (created == false) {
                review.star = body.star
                await review.save()
            }
            return Response.Created('Maglumat döredildi!', review)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addCouponService(body, img, userId) {
        try {
            const sellerId = await Verification.isSeller(userId)
            if (!sellerId) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            const limit = await Models.Sellers.findOne({
                attributes: [],
                where: { id: sellerId },
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
                sellerId: sellerId
            }).catch((err) => { console.log(err) })
            return Response.Created('Kupon döredildi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addOfferService(body) {
        try {
            const [offer, created] = await Models.Offers.findOrCreate({
                where: { productId: body.productId },
                defaults: {
                    currency: body.currency,
                    discount: body.discount,
                    productId: body.productId
                }
            })
            if (created === false) { return Response.BadRequest('Arzanladyş goýulan!', []) }
            return Response.Success('Arzanladyş goşuldy!', offer)
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
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive', 'slug', 'gender', 'quantity', 'sale_price'],
                where: { [Op.or]: search },
                include: [
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'name']
                    },
                    {
                        model: Models.Offers,
                        attributes: ['id', 'discount', 'currency', 'isActive'],
                        where: { isActive: true }, required: false
                    }
                ],
                limit: Number(limit),
                offset: Number(offset)
            })
            const result = { count: 0, rows: [] }
            result.count = products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.id } })
                const comment = await allCommentService({ productId: item.id })
                const rating = await this.fetchReviewService(item.id)
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count
                })
            }))
            if (order === 'asc') {
                console.log('asc --> ', sort);
                if (sort === 'discount') { result.rows.sort((a, b) => Number(b.offers.sort) - Number(a.offers.sort)) }
                else { result.rows.sort((a, b) => Number(b.sort) - Number(a.sort)) }
            }
            else if (order === 'desc') {
                console.log('desc --> ', sort);
                if (sort === 'discount') { result.rows.sort((a, b) => Number(a.offers.sort) - Number(b.offers.sort)) }
                else { result.rows.sort((a, b) => Number(b.sort) - Number(a.sort)) }
            }
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async topSellingService(q) {
        try {
            let result = []
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            const selling_products = await Models.Orders.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalSelling']
                ],
                include: [
                    {
                        model: Models.Products,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'isActive', 'quantity', 'sale_price'],
                        include: [
                            {
                                model: Models.Subcategories,
                                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                                where: { isActive: true }
                            },
                            {
                                model: Models.Brands,
                                attributes: ['id', 'name', 'img', 'slug'],
                                where: { isActive: true }
                            },
                            {
                                model: Models.Sellers,
                                attributes: ['id', 'name']
                            }
                        ],
                    }
                ],
                group: [
                    'product.id', 'product.subcategory.id',
                    'product.brand.id', 'product.seller.id'
                ],
                limit: Number(limit),
                offset: Number(offset)
            })
            await Promise.all(selling_products.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.product.id } })
                const rating = await this.fetchReviewService(item.product.id)
                const comment = await allCommentService({ productId: item.product.id })
                result.push({
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count,
                })
            }))
            if (order === 'desc') result.sort((a, b) => Number(b.totalSelling) - Number(a.totalSelling))
            else result.sort((a, b) => Number(a.totalSelling) - Number(b.totalSelling))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async topLikedService(q) {
        try {
            let result = []
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            const top_liked = await Models.Likes.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('productId')), 'totalLiked']
                ],
                include: [
                    {
                        model: Models.Products,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'quantity', 'org_price', 'sale_price'],
                        include: [
                            {
                                model: Models.Subcategories,
                                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                                where: { isActive: true }
                            },
                            {
                                model: Models.Brands,
                                attributes: ['id', 'name', 'img', 'slug'],
                                where: { isActive: true }
                            },
                            {
                                model: Models.Sellers,
                                attributes: ['id', 'name']
                            }
                        ],
                    }
                ],
                group: [
                    'product.id', 'product.subcategory.id',
                    'product.brand.id', 'product.seller.id'
                ],
                limit: Number(limit),
                offset: Number(offset)
            })
            await Promise.all(top_liked.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.product.id } })
                const rating = await this.fetchReviewService(item.product.id)
                const comment = await allCommentService({ productId: item.product.id })
                result.push({
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count,
                })
            }))
            if (order === 'desc') result.sort((a, b) => Number(b.totalLiked) - Number(a.totalLiked))
            else result.sort((a, b) => Number(a.totalLiked) - Number(b.totalLiked))
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

    async allCategoryService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let _whereState = { isActive: true }
            if (q.status === 'all') { _whereState = {} }
            const categories = await Models.Categories.findAndCountAll({
                where: _whereState,
                attributes: { exclude: ['createdAt', 'updatedAt', 'userId'] },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (categories.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', categories)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allSubcategoryService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let _whereState = { isActive: true }
            if (q.status === 'all') { _whereState = {} }
            const subcategories = await Models.Subcategories.findAndCountAll({
                where: _whereState,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId', 'categoryId'] },
                include: {
                    model: Models.Categories,
                    attributes: ['id', 'tm_name']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (subcategories.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', subcategories)
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

    async allFeatureService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const features = await Models.Features.findAll({
                where: { isActive: true },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (features.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', features)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allBrandsService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let _whereState = { isActive: true }
            if (q.status === 'all') { _whereState = {} }
            const brands = await Models.Brands.findAndCountAll({
                where: _whereState,
                attributes: { exclude: ['userId'] },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (brands.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', brands)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async productLikesService(id) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const likes = await Models.Likes.findAndCountAll({
                where: { productId: id },
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'fullname', 'img']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (likes.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', likes)
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