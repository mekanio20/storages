const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')
const { Sequelize } = require('../config/database')
const { fetchReviewService } = require('./product.service')
const { generateJwt } = require('../helpers/functions.service')

class SellerService {
    // POST
    async sellerRegisterService(body, filenames, userId) {
        try {
            const seller = await Models.Sellers.findAll({
                attributes: ['id'],
                where: {
                    name: body.name,
                    main_number: body.main_number
                }
            }).catch((err) => { console.log(err) })
            if (seller.length > 0) { return Response.Forbidden('Satyjy registrasiýa bolan!', []) }
            if (body.main_number === body.second_number) { return Response.BadRequest('Iki sany meňzeş nomer bolup bilmez!', []) }
            const user = await Models.Users.findOne({ where: { id: Number(userId) } })
                .catch((err) => { console.log(err) })
            user.isCustomer = false
            user.isSeller = true
            await user.save()
            const token = await generateJwt(user.id, 3)
            const _seller = await Models.Sellers.create({
                name: body.name,
                store_number: body.store_number,
                store_floor: body.store_floor,
                about: body.about,
                logo: filenames.logo[0].filename,
                bg_img: filenames?.bg_img[0].filename || 'bg.jpg',
                seller_type: body.seller_type,
                sell_type: body.sell_type,
                instagram: body.instagram,
                tiktok: body.tiktok,
                main_number: body.main_number,
                second_number: body.second_number,
                userId: Number(userId),
                categoryId: body.categoryId,
                subscriptionId: body.subscriptionId
            }).catch((err) => { console.log(err) })
            _seller.dataValues.token = token
            return Response.Created('Satyjy hasaba alyndy!', _seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async fetchSellerService(userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const profile = await Models.Sellers.findOne({
                where: { id: seller },
                attributes: { exclude: ['userId', 'categoryId', 'deletedAt', 'updatedAt'] }
            })
            if (!profile) { return Response.NotFound('Satyjy tapylmady!', {}) }
            return Response.Success('Üstünlikli!', profile)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allSellerService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'name'
            let order = q.order || 'asc'
            let search = []
            let whereState = {}
            let conditions = {}
            let _conditions = {
                isVerified: q.status || null,
                store_number: q.store_number || null,
                store_floor: q.store_floor || null,
                categoryId: q.categoryId || null
            }
            for (let i in _conditions) {
                if (_conditions[i] !== null) {
                    conditions[i] = _conditions[i]
                }
            }
            whereState = { [Op.and]: conditions }
            if (q.name) {
                search = [{ name: { [Op.iLike]: `%${q.name}%` } }]
                whereState = { [Op.and]: conditions, [Op.or]: search }
            }
            const seller = await Models.Sellers.findAndCountAll({
                where: whereState,
                attributes: ['id', 'name', 'store_number', 'store_floor', 'logo', 'seller_type', 'sell_type'],
                include: [
                    {
                        model: Models.Categories,
                        where: { isActive: true }, required: false,
                        attributes: ['id', 'tm_name', 'slug']
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            }).catch((err) => console.log(err))
            if (seller.count === 0) { return Response.NotFound('Satyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allBannersService(q) {
        try {
            const seller = await Models.Sellers.findOne({ where: { id: q.sellerId }, attributes: ['userId'] })
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            let whereState = {}
            whereState.userId = seller.userId
            if (q.type) whereState.type = q.type
            const banners = await Models.Banners.findAndCountAll({
                where: whereState,
                attributes: ['id', 'tm_img', 'ru_img', 'en_img', 'url', 'type', 'sort_order']
            }).catch((err) => console.log(err))
            if (banners.count === 0) { return Response.NotFound('Banner ýok!', []) }
            return Response.Success('Üstünlikli!', banners)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allOrdersService(q, userId) {
        try {
            // let page = q.page || 1
            // let limit = q.limit || 10
            // let offset = page * limit - limit
            // let sort = q.sort || 'id'
            // let order = q.order || 'desc'
            let whereState = {}
            if (q.status) whereState.status = q.status
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const orders = await Models.OrderItems.findAll({
                attributes: [['id', 'orderItemId'], 'quantity'],
                include: [
                    {
                        model: Models.Orders,
                        attributes: ['id', 'order_id', 'status', 'time'],
                        where: whereState,
                        include: {
                            model: Models.Customers,
                            attributes: ['id', 'fullname']
                        },
                    },
                    {
                        model: Models.Products,
                        where: { isActive: true, sellerId: seller },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'sale_price'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true }, required: false,
                                attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
                            },
                            {
                                model: Models.Offers,
                                where: { isActive: true }, required: false,
                                attributes: ['id', 'discount', 'currency']
                            }
                        ]
                    }
                ]
            }).catch((err) => console.log(err))
            if (orders.length === 0) { return Response.NotFound('Sargyt edilen haryt yok!', []) }
            return Response.Success('Üstünlikli!', orders)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async orderDetailService(id, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const order = await Models.Orders.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt', 'customerId', 'productId'] },
                include: [
                    {
                        model: Models.Products,
                        where: { isActive: true, sellerId: seller },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'sale_price'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true }, required: false,
                                attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
                            },
                            {
                                model: Models.Offers,
                                where: { isActive: true }, required: false,
                                attributes: ['id', 'discount']
                            }
                        ]
                    },
                    {
                        model: Models.Customers,
                        where: { id: Number(id) },
                        attributes: ['id', 'img', 'fullname']
                    }
                ]
            }).catch((err) => { console.log(err) })
            if (!order) { return Response.NotFound('Sargyt tapylmady!', []) }
            return Response.Success('Üstünlikli!', order)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async sellerFollowersService(id) {
        try {
            const followers = await Models.Followers.findAndCountAll({
                where: { sellerId: Number(id) },
                attributes: ['id'],
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'img', 'fullname'],
                    order: [['id', 'DESC']]
                },
                order: [['id', 'desc']]
            }).catch((err) => { console.log(err) })
            if (followers.count === 0) { return Response.NotFound('Yzarlaýan yok!', []) }
            return Response.Success('Yzarlaýanlar!', followers)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async topSellersSerive(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            const topProducts = await Models.OrderItems.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('productId')), 'salesCount']
                ],
                include: [
                    {
                        model: Models.Products,
                        attributes: ['id'],
                        include: [
                            {
                                model: Models.Sellers,
                                attributes: ['id', 'name', 'logo']
                            }
                        ]
                    }
                ],
                group: ['product.id', 'product.seller.id'],
                limit: Number(limit),
                offset: Number(offset)
            })
            const sellerSalesCounts = []
            topProducts.forEach((detail) => {
                const sellerId = detail.dataValues.product.seller.id
                const sellerName = detail.dataValues.product.seller.name
                const sellerImage = detail.dataValues.product.seller.logo
                const salesCount = Number(detail.dataValues.salesCount)
                const include = sellerSalesCounts.some(item => { return item.sellerId === sellerId })
                if (!include) {
                    sellerSalesCounts.push({
                        sellerId: sellerId,
                        sellerName: sellerName,
                        sellerImage: sellerImage,
                        salesCount: salesCount
                    })
                } else {
                    sellerSalesCounts[sellerSalesCounts.length - 1].salesCount += salesCount
                }
            })
            if (order === 'desc') sellerSalesCounts.sort((a, b) => b.salesCount - a.salesCount)
            else sellerSalesCounts.sort((a, b) => a.salesCount - b.salesCount)
            return Response.Success('Üstünlikli!', sellerSalesCounts)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async profileSellerService(id, userId) {
        try {
            let rating = 0
            const seller = await Models.Sellers.findOne({
                attributes: { exclude: ['seller_type', 'userId', 'categoryId', 'subscriptionId', 'createdAt', 'updatedAt', 'deletedAt'] },
                where: { id: Number(id) }
            }).catch((err) => { console.log(err) })
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            seller.dataValues.followers = await Models.Followers.count({ where: { sellerId: id } })
            seller.dataValues.products = await Models.Products.count({ where: { sellerId: id } })
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            seller.dataValues.isFollow = await Models.Followers.findOne({ where: { customerId: customer, sellerId: id } }) ? true : false
            const _seller = await Models.Products.findAll({ attributes: ['id'], where: { sellerId: id } })
            for (let i = 0; i < _seller.length; i++) {
                rating += await (await fetchReviewService(_seller[i].id)).detail.rating
            }
            seller.dataValues.rating = rating / _seller.length
            return Response.Success('Satyjy Maglumaty!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async sellerSubcategoriesService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            let start_price = Number(q.start_price) || 0
            let end_price = Number(q.end_price) || 100000
            let whereState = { isActive: true, sellerId: Number(q.sellerId) }
            whereState.sale_price = { [Op.between]: [start_price, end_price] }
            if (q.subcategoryId) whereState.subcategoryId = q.subcategoryId
            if (q.brandId) whereState.brandId = q.brandId
            if (q.gender) whereState.gender = q.gender
            const products = await Models.Products.findAndCountAll({
                where: whereState,
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'subcategoryId'],
                include: [
                    {
                        model: Models.Sellers,
                        attributes: [], required: true
                    },
                    {
                        model: Models.Brands,
                        attributes: ['id', 'name', 'img', 'slug'],
                        where: { isActive: true }, required: false
                    },
                    {
                        model: Models.Offers,
                        attributes: ['id', 'discount', 'currency'],
                        where: { isActive: true }, required: false
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            }).catch((err) => console.log(err))
            if (products.count === 0) { return Response.NotFound('Haryt ýok!', {}) }
            const result = { count: products.count, rows: [] }
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                })
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await fetchReviewService(item.id)
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating,
                })
            })).catch((err) => { console.log(err) })
            const subcategories = await Models.Subcategories.findAll({
                where: { isActive: true },
                attributes: { exclude: ['isActive', 'userId', 'categoryId', 'createdAt', 'updatedAt'] }
            }).catch((err) => console.log(err))
            const groupedProducts = subcategories.map(subcategory => ({
                ...subcategory.toJSON(),
                products: result.rows.filter(product => product.subcategoryId === subcategory.id)
            })).filter(group => group.products.length > 0)
            return Response.Success('Üstünlikli!', { count: result.count, rows: groupedProducts })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async sellerProductsService(q) {
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
                sellerId: q.sellerId || 0,
                subcategoryId: q.subcategoryId || 0,
                brandId: q.brandId || 0,
                gender: q.gender || ''
            }
            for (const key in query) { if (query[key]) { obj[key] = await query[key] } }
            obj.isActive = true
            if (q.isActive == 'all') { delete obj.isActive }
            obj.sale_price = { [Op.between]: [start_price, end_price] }
            const products = await Models.Products.findAndCountAll({
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive', 'slug', 'gender', 'quantity', 'sale_price'],
                where: { [Op.and]: obj },
                include: [
                    {
                        model: Models.Sellers,
                        attributes: []
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
                    },
                    {
                        model: Models.Offers,
                        attributes: ['id', 'discount', 'currency'],
                        where: { isActive: true }, required: false
                    }
                ],
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => { console.log(err) })
            const result = { count: 0, rows: [] }
            result.count = await products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                })
                const comment = await Models.Comments.count({ where: { productId: item.id } })
                const rating = await fetchReviewService(item.id)
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating,
                })
            })).catch((err) => { console.log(err) })
            if (order === 'desc') {
                if (sort === 'sale_price') result.rows.sort((a, b) => Number(b.sale_price) - Number(a.sale_price))
                else result.rows.sort((a, b) => Number(b.id) - Number(a.id))
            } else {
                if (sort === 'sale_price') result.rows.sort((a, b) => Number(a.sale_price) - Number(b.sale_price))
                else result.rows.sort((a, b) => Number(a.id) - Number(b.id))
            }
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async sellerStatisticService(userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            let year = new Date().getFullYear()
            let month = new Date().getMonth() - 1
            if (month === 0) {
                month = 12
                year -= 1
            }
            let oldMonth_ = new Date(`2024-02-01`)
            let _oldMonth = new Date(`2024-02-31`)
            const oldStatistic = await Models.OrderItems.findAndCountAll({
                attributes: ['quantity', 'createdAt'],
                where: {
                    createdAt: {
                        [Op.between]: [oldMonth_, _oldMonth]
                    }
                },
                include: {
                    model: Models.Products,
                    attributes: ['sale_price'],
                    where: { sellerId: seller }
                }
            }).catch((err) => { console.log(err) })
            if (oldStatistic.count === 0) {

            }
            console.log(JSON.stringify(oldStatistic, null, 2))
            let oldTotalMoney = 0
            oldStatistic.rows.forEach((item) => {
                oldTotalMoney += Number(item.quantity) * Number(item.product.sale_price)
            })
            const statistic = await Models.OrderItems.findAndCountAll({
                attributes: ['quantity'],
                where: { status: 'completed' },
                include: {
                    model: Models.Products,
                    attributes: ['sale_price'],
                    where: { sellerId: seller },
                }
            }).catch((err) => { console.log(err) })
            let totalMoney = 0
            statistic.rows.forEach((item) => {
                totalMoney += Number(item.quantity) * Number(item.product.sale_price)
            })
            let prosent = Number(totalMoney) - Number(oldTotalMoney)
            prosent = prosent / Number(oldTotalMoney)
            prosent = prosent * 100
            const _statistic = {
                oldTotalMoney: oldTotalMoney,
                totalMoney: totalMoney,
                prosent: prosent.toFixed(1),
                orders: statistic.count
            }
            return Response.Success('Üstünlikli!', _statistic)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async sellerVideosService(query) {
        try {
            let page = query.page || 1
            let limit = query.limit || 10
            let offset = page * limit - limit
            const videos = await Models.Videos.findAndCountAll({
                attributes: ['id', 'thumbnail'],
                where: {
                    sellerId: Number(query.sellerId),
                    isActive: true
                },
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => { console.log(err) })
            if (videos.count === 0) { return Response.NotFound('Video yok!', []) }
            return Response.Success('Üstünlikli!', videos)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // PUT
    async updateSellerProfileService(body, userId, files) {
        try {
            let newObj = {}
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            for (const key in body) { if (body[key]) { newObj[key] = body[key] } }
            if (files?.logo) { newObj.logo = files.logo[0].filename }
            if (files?.bg_img) { newObj.bg_img = files.bg_img[0].filename }
            await Models.Sellers.update(newObj, { where: { id: seller } })
                .catch((err) => { console.log(err) })
            return Response.Success('Satyjy maglumaty täzelendi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async updateOrderStatusService(body, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const order = await Models.Orders.findOne({
                attributes: ['id', 'status'],
                where: { id: body.orderId },
                include: {
                    model: Models.OrderItems,
                    required: true,
                    attributes: ['id', 'quantity'],
                    include: {
                        model: Models.Products,
                        required: true,
                        attributes: ['sellerId'],
                        where: { sellerId: seller, isActive: true }
                    }
                }
            }).catch((err) => console.log(err))
            if (!order) { return Response.Forbidden('Rugsat edilmedi!', {}) }
            order.status = body.status
            await order.save()
            return Response.Success('Sargydyň ýagdaýy täzelendi!', { id: order.id, status: order.status })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // DELETE
    async deleteSellerService(userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            await Models.Sellers.destroy({ where: { id: seller } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Satyjy maglumaty pozuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new SellerService()