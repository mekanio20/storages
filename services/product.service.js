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

            const existingProduct = await Models.Products.findOne({
                where: {
                    [Op.or]: [
                        { barcode: body.barcode },
                        { stock_code: body.stock_code }
                    ]
                }
            })
            if (existingProduct) { return Response.Forbidden('Maglumat eýýäm döredilen!', []) }

            const subscription = await Models.Sellers.findOne({
                attributes: ['subscriptionId'],
                where: { id: seller }
            })
            console.log('SUBSCTIPTIONS --> ', JSON.stringify(subscription, null, 2))

            const limits = await Models.Subscriptions.findOne({
                attributes: ['p_limit', 'p_img_limit'],
                where: { id: subscription.subscriptionId }
            })
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

            const slug = await Functions.generateSlug(body.tm_name)
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
            })

            if (body?.features) {
                for (let item of body.features) {
                    await Models.ProductFeatures.create({
                        productId: product.id,
                        featureDescriptionId: item
                    }).then(() => { console.log(true) })
                }
            }
            if (filenames.img) {
                filenames.img.forEach(async (item, index) => {
                    await Models.ProductImages.create({
                        img: item.filename,
                        productId: product.id
                    }).then(() => { console.log(true) })
                })
            }

            return Response.Created('Haryt goýuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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
            })

            const limits = await Models.Subscriptions.findOne({
                attributes: ['p_img_limit'],
                where: { id: subscription.subscriptionId }
            })

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
            })

            if (filenames.img) {
                filenames.img.forEach(async (item) => {
                    await Models.ProductImages.create({
                        img: item.filename,
                        productId: product.id
                    }).then(() => { console.log(true) })
                })
            }

            return Response.Created('Surat goýuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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
            })
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
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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
            })

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
            })

            return Response.Created('Kupon döredildi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    // PUT
    async updateProductService(userId, body) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            
            const product = await Models.Products.findOne({ where: { id: body.productId, sellerId: seller }, attributes: ['id'] })
            if (!product) { return Response.Forbidden('Bu haryt size degişli däl!', []) }
            
            const obj = {}
            for (const item in body) { if (item && item !== 'productId') { obj[item] = body[item] } }

            let final_price = Number(body.sale_price)
            if (Number(body.dis_price) > 0) {
                if (body?.dis_type === 'goterim') {
                    let discount_amount = (Number(body.sale_price) * Number(body.dis_price)) / 100
                    final_price = Number(body.sale_price) - Number(discount_amount)
                } else {
                    final_price -= Number(body.dis_price)
                }
            }
            obj.final_price = Number(final_price)

            await Models.Products.update(obj, { where: { id: product.id } })

            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    // GET
    async allProductService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                start_price = 0,
                end_price = 100000,
                sort = 'id',
                order = 'desc',
                gender = '',
                subcategoryId,
                brandId,
                isActive = true
            } = q
                
            const subquery = await Models.Products.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('model_code')), 'model_code'],
                    [Sequelize.fn('MIN', Sequelize.col('id')), 'id']
                ],
                group: ['model_code'],
                raw: true
            })
    
            const filters = {
                final_price: { [Op.between]: [Number(start_price), Number(end_price)] },
                ...(subcategoryId && { subcategoryId }),
                ...(isActive !== 'all' && { isActive }),
                ...(brandId && { brandId }),
                ...(gender && { gender }),
                [Op.or]: [
                    { id: { [Op.in]: subquery.map(item => item.id) } },
                    { model_code: { [Op.notIn]: subquery.map(item => item.model_code) } }
                ]
            }
    
            const products = await Models.Products.findAndCountAll({
                attributes: [
                    'id', 'tm_name', 'ru_name', 'en_name', 'slug',
                    'gender', 'quantity', 'sale_price', 'dis_price', 
                    'dis_type', 'final_price', 'isActive'
                ],
                where: filters,
                include: [
                    { model: Models.Sellers, attributes: ['id', 'logo', 'name'] },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true },
                        required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true },
                        required: false
                    }
                ],
                limit: Number(limit),
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })
    
            const result = {
                count: products.count,
                rows: await Promise.all(products.rows.map(async item => {
                    const images = await Models.ProductImages.findAndCountAll({
                        where: { productId: item.id, isActive: true },
                        attributes: ['id', 'img']
                    })
                    const commentCount = await Models.Comments.count({ where: { productId: item.id } })
                    const rating = await this.fetchReviewService(item.id)
                    
                    return {
                        ...item.dataValues,
                        images,
                        comment: commentCount,
                        rating: rating.detail.rating
                    }
                }))
            }
    
            result.rows.sort((a, b) => {
                const comparison = sort === 'final_price' 
                    ? Number(a.final_price) - Number(b.final_price) 
                    : Number(a.id) - Number(b.id)
                return order === 'desc' ? -comparison : comparison
            })
    
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async allCouponsService() {
        try {
            const data = await Models.Coupons.findAll({
                include: {
                    model: Models.CouponItem
                }
            })
            return Response.Success('Üstünlikli!', data)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }        }
    }

    async searchProductService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                name,
                sellerId
            } = q
    
            const whereConditions = {
                isActive: true,
                ...(sellerId && { sellerId }),
                ...(name && {
                    [Op.or]: [
                        { tm_name: { [Op.iLike]: `%${name}%` } },
                        { ru_name: { [Op.iLike]: `%${name}%` } },
                        { en_name: { [Op.iLike]: `%${name}%` } }
                    ]
                })
            }
    
            const products = await Models.Products.findAndCountAll({
                attributes: [
                    'id', 'tm_name', 'ru_name', 'en_name', 'slug', 
                    'gender', 'quantity', 'sale_price', 'dis_price', 
                    'dis_type', 'final_price'
                ],
                where: whereConditions,
                include: [
                    { model: Models.Sellers, attributes: ['id', 'logo', 'name'] },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true },
                        required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true },
                        required: false
                    }
                ],
                limit: Number(limit),
                offset: (page - 1) * limit
            })
    
            const result = {
                count: products.count,
                rows: await Promise.all(products.rows.map(async item => {
                    const images = await Models.ProductImages.findAndCountAll({
                        where: { productId: item.id, isActive: true },
                        attributes: ['id', 'img']
                    })
                    const commentCount = await Models.Comments.count({ where: { productId: item.id } })
                    const rating = await this.fetchReviewService(item.id)
    
                    return {
                        ...item.dataValues,
                        images,
                        comment: commentCount,
                        rating: rating.detail.rating
                    }
                }))
            }
    
            return Response.Success('Gözleg netijesi', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async offerProductService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'id',
                order = 'asc',
                dis_type,
                sellerId
            } = q

            const subquery = await Models.Products.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('model_code')), 'model_code'],
                    [Sequelize.fn('MIN', Sequelize.col('id')), 'id']
                ],
                group: ['model_code'],
                raw: true
            })
    
            const whereState = {
                isActive: true,
                ...(sellerId && { sellerId }),
                ...(dis_type && { dis_type }),
                [Op.or]: [
                    { id: { [Op.in]: subquery.map(item => item.id) } },
                    { model_code: { [Op.notIn]: subquery.map(item => item.model_code) } }
                ]
            }
            
            const products = await Models.Products.findAndCountAll({
                attributes: [
                    'id', 'tm_name', 'ru_name', 'en_name', 'slug', 
                    'gender', 'quantity', 'sale_price', 'dis_price', 
                    'dis_type', 'final_price'
                ],
                where: whereState,
                include: [
                    { model: Models.Sellers, attributes: ['id', 'logo', 'name'] },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true },
                        required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true },
                        required: false
                    }
                ],
                limit: Number(limit),
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })
    
            const result = {
                count: products.count,
                rows: await Promise.all(products.rows.map(async item => {
                    const images = await Models.ProductImages.findAndCountAll({
                        where: { productId: item.id, isActive: true },
                        attributes: ['id', 'img']
                    })
    
                    const commentCount = await Models.Comments.count({ where: { productId: item.id } })
                    const rating = await this.fetchReviewService(item.id)
    
                    return {
                        ...item.dataValues,
                        images,
                        comment: commentCount,
                        rating: rating.detail.rating
                    }
                }))
            }
    
            result.rows.sort((a, b) => order === 'desc' 
                ? Number(b.dis_price) - Number(a.dis_price) 
                : Number(a.dis_price) - Number(b.dis_price)
            )
    
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async topSellingService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                order = 'desc',
                sellerId
            } = q

            const sellingProducts = await Models.OrderItems.findAll({
                attributes: [
                    'productId',
                    [Sequelize.fn('COUNT', Sequelize.col('quantity')), 'totalSelling']
                ],
                group: ['productId'],
                limit: Number(limit),
                offset: (page - 1) * limit
            })
    
            const productPromises = sellingProducts.map(async item => {
                const product = await Models.Products.findOne({
                    where: { id: item.productId, ...(sellerId && { sellerId }), isActive: true },
                    attributes: [
                        'id', 'tm_name', 'ru_name', 'en_name', 'slug',
                        'gender', 'quantity', 'sale_price', 'dis_price',
                        'dis_type', 'final_price'
                    ],
                    include: [
                        {
                            model: Models.Sellers,
                            attributes: ['id', 'logo', 'name']
                        },
                        {
                            model: Models.Subcategories,
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                            where: { isActive: true },
                            required: false
                        },
                        {
                            model: Models.Brands,
                            attributes: ['id', 'name', 'img', 'slug'],
                            where: { isActive: true },
                            required: false
                        }
                    ]
                })
                if (product) {
                    product.dataValues.totalSelling = Number(item.dataValues.totalSelling)
                    return product
                }
                return null
            })
    
            const products = await Promise.all(productPromises)
            const filteredProducts = products.filter(item => item !== null)
    
            const result = await Promise.all(filteredProducts.map(async item => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                })
    
                const commentCount = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
    
                return {
                    ...item.dataValues,
                    images,
                    comment: commentCount,
                    rating: rating.detail.rating
                }
            }))
    
            result.sort((a, b) => order === 'desc'
                ? Number(b.totalSelling) - Number(a.totalSelling)
                : Number(a.totalSelling) - Number(b.totalSelling)
            )
    
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async topLikedService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                order = 'desc'
            } = q
    
            const topLiked = await Models.Likes.findAll({
                attributes: [
                    'productId',
                    [Sequelize.fn('COUNT', Sequelize.col('productId')), 'totalLiked']
                ],
                group: ['productId'],
                limit: Number(limit),
                offset: (page - 1) * limit
            })
    
            const productPromises = topLiked.map(async item => {
                const product = await Models.Products.findOne({
                    where: { id: item.productId, isActive: true },
                    attributes: [
                        'id', 'tm_name', 'ru_name', 'en_name', 'slug',
                        'gender', 'quantity', 'sale_price', 'dis_price',
                        'dis_type', 'final_price'
                    ],
                    include: [
                        {
                            model: Models.Sellers,
                            attributes: ['id', 'logo', 'name']
                        },
                        {
                            model: Models.Subcategories,
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                            where: { isActive: true },
                            required: false
                        },
                        {
                            model: Models.Brands,
                            attributes: ['id', 'name', 'img', 'slug'],
                            where: { isActive: true },
                            required: false
                        }
                    ]
                })
                if (product) {
                    product.dataValues.totalLiked = Number(item.dataValues.totalLiked)
                    return product
                }
                return null
            })
    
            const products = await Promise.all(productPromises)
            const filteredProducts = products.filter(item => item !== null)
    
            const result = await Promise.all(filteredProducts.map(async item => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                })
    
                const commentCount = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
    
                return {
                    ...item.dataValues,
                    images,
                    comment: commentCount,
                    rating: rating.detail.rating
                }
            }))
    
            result.sort((a, b) => order === 'desc'
                ? Number(b.totalLiked) - Number(a.totalLiked)
                : Number(a.totalLiked) - Number(b.totalLiked)
            )
    
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async topRatedService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                order = 'desc'
            } = q
    
            const products = await Models.Products.findAll({
                where: { isActive: true },
                attributes: [
                    'id', 'tm_name', 'ru_name', 'en_name', 'slug',
                    'gender', 'quantity', 'sale_price', 'dis_price',
                    'dis_type', 'final_price'
                ],
                include: [
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'logo', 'name']
                    },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                        where: { isActive: true },
                        required: false
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true },
                        required: false
                    }
                ],
                limit: Number(limit),
                offset: (page - 1) * limit
            })
    
            const result = await Promise.all(products.map(async item => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                })
    
                const commentCount = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await this.fetchReviewService(item.id)
    
                return {
                    ...item.dataValues,
                    images,
                    comment: commentCount,
                    rating: rating.detail.rating
                }
            }))
    
            result.sort((a, b) => order === 'desc'
                ? Number(b.rating) - Number(a.rating)
                : Number(a.rating) - Number(b.rating)
            )
    
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async fetchProductService(id) {
        try {
            const product = await Models.Products.findOne({
                where: { id, isActive: true },
                attributes: ['model_code']
            })
    
            const products = await Models.Products.findAll({
                where: { model_code: product.model_code, isActive: true },
                attributes: { exclude: ['couponId', 'createdAt', 'updatedAt', 'isActive', 'brandId', 'sellerId'] },
                include: [
                    {
                        model: Models.Sellers,
                        attributes: ['id', 'name', 'logo', 'isVerified']
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img'],
                        where: { isActive: true },
                        required: false,
                    },
                ]
            })

            const result = await Promise.all(products.map(async (item) => {
                const [images, rating, comment, features] = await Promise.all([
                    Models.ProductImages.findAndCountAll({
                        where: { productId: item.id, isActive: true },
                        attributes: ['id', 'img']
                    }),
                    this.fetchReviewService(item.id),
                    allCommentService({ productId: item.id }),
                    Models.ProductFeatures.findAll({
                        where: { productId: item.id, isActive: true },
                        include: {
                            model: Models.FeatureDescriptions,
                            attributes: ['id', 'desc'],
                            include: {
                                model: Models.Features,
                                attributes: ['id', 'name']
                            }
                        }
                    })
                ])

                const featuresMapped = features.map(feature => ({
                    id: feature.feature_description.id,
                    name: feature.feature_description.feature.name,
                    desc: feature.feature_description.desc
                }))
            
                return {
                    ...item.dataValues,
                    images,
                    comment: comment.detail,
                    rating: rating.detail.rating,
                    features: featuresMapped
                }
            }))            
    
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async allSubcategoryService(q) {
        try {
            const { page = 1, limit = 10, status = true } = q
            const whereState = { ...(status !== 'all' && { isActive }) }
    
            const subcategories = await Models.Categories.findAndCountAll({
                where: whereState,
                attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt', 'userId'] },
                include: {
                    model: Models.Subcategories,
                    required: true,
                    attributes: ['id', 'slug', 'tm_name', 'ru_name', 'en_name', 'logo']
                },
                limit: Number(limit),
                offset: (page - 1) * limit,
                order: [['id', 'DESC']]
            })

            return subcategories.count
                ? Response.Success('Üstünlikli!', subcategories)
                : Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async allSubcategoryFeaturesService(id) {
        try {
            const featureIds = await Models.SubcategoryFeatures.findAll({
                attributes: ['featureId'],
                where: { subcategoryId: id }
            })
            if (featureIds.length === 0) { return Response.NotFound('Maglumat tapylmady!', []) }

            const result = await Promise.all(featureIds.map(async ({ featureId }) => {
                const feature = await Models.Features.findOne({
                    where: { isActive: true, id: featureId },
                    attributes: ['name'],
                    include: {
                        model: Models.FeatureDescriptions,
                        where: { isActive: true },
                        attributes: ['id', 'desc']
                    }
                })
                return feature
            }))
    
            return Response.Success('Üstünlikli!', result.filter(Boolean))
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async fetchReviewService(id) {
        try {
            const reviews = await Models.ProductReviews.findAll({
                where: { productId: id, isActive: true },
                attributes: [
                    'star',
                    [Sequelize.fn('COUNT', Sequelize.col('customerId')), 'total_customers']
                ],
                group: ['star'],
                order: [['star', 'DESC']]
            })
            if (reviews.length === 0) { return Response.Success('Üstünlikli!', { reviews: [], rating: 0 }) }
    
            const { total_customers: totalCustomers, starWeightedSum } = reviews.reduce(
                (acc, { dataValues: { star, total_customers } }) => {
                    acc.total_customers += Number(total_customers)
                    acc.starWeightedSum += Number(star) * Number(total_customers)
                    return acc
                },
                { total_customers: 0, starWeightedSum: 0 }
            )
    
            const rating = totalCustomers ? starWeightedSum / totalCustomers : 0
    
            return Response.Success('Üstünlikli!', { reviews, rating })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async productLikesService(q) {
        try {
            const { page = 1, limit = 10, id } = q
    
            const likes = await Models.Likes.findAndCountAll({
                attributes: ['id'],
                where: { productId: id },
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'fullname', 'img']
                },
                limit: Number(limit),
                offset:(page - 1) * limit,
                order: [['id', 'DESC']]
            })
            
            return likes.count
                ? Response.Success('Üstünlikli!', likes)
                : Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] };
        }
    }
    
    // DELETE
    async deleteProductImageService(id, user) {
        try {
            const productImage = await Models.ProductImages.findOne({ where: { id },  attributes: ['id', 'productId'] })
            if (!productImage) { return Response.NotFound('Product image not found!', []) }
    
            if ([1, 2].includes(user.group)) {
                await Models.ProductImages.destroy({ where: { id } })
                return Response.Success('Üstünlikli!', [])
            }
    
            const sellerId = await Verification.isSeller(user.id)
            if (isNaN(sellerId)) { return sellerId }
    
            const product = await Models.Products.findOne({ where: { id: productImage.productId, sellerId: Number(sellerId) } })
            if (!product) { return Response.Forbidden('Rugsat edilmedi!', []) }
    
            await Models.ProductImages.destroy({ where: { id: Number(productImage.id) } })

            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async deleteProductService(id, user) {
        try {
            if (user.group === 1) {
                await Models.Products.destroy({ where: { id } })
                return Response.Success('Üstünlikli!', [])
            }
    
            const sellerId = await Verification.isSeller(user.id)
            if (isNaN(sellerId)) { return sellerId }
    
            const product = await Models.Products.findOne({ where: { id, sellerId: Number(sellerId) } })
            if (!product) { return Response.Forbidden('Rugsat edilmedi!', []) }
    
            await Models.Products.destroy({ where: { id } })

            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new ProductService()