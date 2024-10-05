const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const moment = require('moment')
const moment_timezone = require('moment-timezone');
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
            whereState.type = 'profile'
            const banners = await Models.Banners.findAndCountAll({
                where: whereState,
                attributes: { exclude: ['userId'] }
            }).catch((err) => console.log(err))
            if (banners.count === 0) { return Response.NotFound('Banner ýok!', []) }
            return Response.Success('Üstünlikli!', banners)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allOrdersService(q, userId) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            let whereState = {}
            if (q.status) whereState.status = q.status
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const orders = await Models.Orders.findAll({
                attributes: ['id'],
                where: whereState,
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]],
                raw: true
            }).catch((err) => console.log(err))
            const orderIds = orders.map(order => order.id)
            const detailedOrders = await Models.Orders.findAll({
                attributes: ['id', 'order_id', 'status', 'time'],
                where: { id: orderIds },
                include: [
                    {
                        model: Models.OrderItems,
                        attributes: ['id', 'quantity'],
                        required: true,
                        include: {
                            model: Models.Products,
                            where: { isActive: true, sellerId: seller },
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                            include: [
                                {
                                    model: Models.ProductImages,
                                    where: { isActive: true }, required: false,
                                    attributes: ['id', 'img'],
                                }
                            ]
                        }
                    },
                    {
                        model: Models.Customers,
                        attributes: ['id', 'fullname'],
                        required: true
                    }
                ],
                order: [[sort, order]]
            }).catch((err) => console.log(err))
            if (detailedOrders.length === 0) { return Response.NotFound('Sargyt edilen haryt yok!', []) }
            for (const item of detailedOrders) {
                for (const order of item.order_items) {
                    const _features = await Models.ProductFeatures.findAll({
                        where: { productId: order.product.id, isActive: true },
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
                    order.dataValues.product.dataValues.feature = features
                }
            }
            return Response.Success('Üstünlikli!', detailedOrders)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async orderDetailService(id, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            const detailedOrders = await Models.Orders.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt', 'customerId', 'productId'] },
                where: { id: Number(id) },
                include: [
                    {
                        model: Models.OrderItems,
                        attributes: ['id', 'quantity'],
                        required: true,
                        include: {
                            model: Models.Products,
                            where: { isActive: true, sellerId: seller },
                            attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                            include: [
                                {
                                    model: Models.ProductImages,
                                    where: { isActive: true }, required: false,
                                    attributes: ['id', 'img'],
                                }
                            ]
                        }
                    },
                    {
                        model: Models.Customers,
                        attributes: ['id', 'img', 'fullname']
                    }
                ],
            }).catch((err) => { console.log(err) })
            if (!detailedOrders) { return Response.NotFound('Sargyt tapylmady!', []) }
            for (const order of detailedOrders.order_items) {
                const _features = await Models.ProductFeatures.findAll({
                    where: { productId: order.product.id, isActive: true },
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
                order.dataValues.product.dataValues.feature = features
            }
            return Response.Success('Üstünlikli!', detailedOrders)
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
                    attributes: ['id', 'img', 'fullname']
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
            let whereState = {}
            if (q.subcategoryId) whereState.subcategoryId = q.subcategoryId
            const topProducts = await Models.OrderItems.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('productId')), 'salesCount']
                ],
                include: [
                    {
                        model: Models.Products,
                        where: whereState,
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
                offset: Number(offset),
                order: [['salesCount', order]]
            }).catch((err) => console.log(err))
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
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price', 'subcategoryId'],
                include: [
                    {
                        model: Models.Sellers,
                        attributes: [], required: true
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
            }).catch((err) => console.log(err))
            if (products.count === 0) { return Response.NotFound('Haryt ýok!', {}) }
            const result = { count: products.count, rows: [] }
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({
                    where: { productId: item.id, isActive: true },
                    attributes: ['id', 'img']
                }).catch((err) => console.log(err))
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
            obj.final_price = { [Op.between]: [start_price, end_price] }
            const products = await Models.Products.findAndCountAll({
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
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
                const rating = await fetchReviewService(item.id)
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    comment: comment,
                    rating: rating.detail.rating,
                })
            })).catch((err) => { console.log(err) })
            if (order === 'desc') {
                if (sort === 'final_price') result.rows.sort((a, b) => Number(b.final_price) - Number(a.final_price))
                else result.rows.sort((a, b) => Number(b.id) - Number(a.id))
            } else {
                if (sort === 'final_price') result.rows.sort((a, b) => Number(a.final_price) - Number(b.final_price))
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
            if (isNaN(seller)) return seller
    
            // Fetch statistics for the seller
            const { count: orders, rows } = await Models.OrderItems.findAndCountAll({
                attributes: ['quantity', 'total_price'],
                include: [
                    { model: Models.Orders, attributes: ['status'], where: { status: 'completed' }, required: true },
                    { model: Models.Products, attributes: ['sellerId'], where: { sellerId: seller }, required: true }
                ]
            })
    
            // Calculate total money
            const totalMoney = rows.reduce((sum, item) => sum + (item.quantity * item.total_price), 0)
    
            // Calculate profit difference
            const { c_profit, l_profit, differencePercentage } = await this.calculateProfitDifference(seller)
    
            // Compile statistics
            const _statistic = {
                totalMoney,
                orders,
                currentMonthProfit: c_profit,
                lastMonthProfit: l_profit,
                differencePercentage
            }
    
            return Response.Success('Üstünlikli!', _statistic)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, detail: error.stack };
        }
    }

    async calculateProfitDifference(seller) {
        try {
            const currentMonthStart = moment().startOf('month').toDate()
            const previousMonthStart = moment().subtract(1, 'month').startOf('month').toDate()
            const previousMonthEnd = moment().startOf('month').toDate()

            // Helper function to fetch profit
            const fetchProfit = async (start, end) => {
                const results = await Models.OrderItems.findAll({
                    where: { createdAt: { [Op.between]: [start, end] } },
                    attributes: ['total_price'],
                    include: [
                        { model: Models.Orders, where: { status: 'completed' }, required: true },
                        { model: Models.Products, where: { sellerId: seller }, required: true }
                    ]
                })
                return results.reduce((total, item) => total + item.total_price, 0)
            }
    
            // Calculate last and current month profits
            const l_profit = await fetchProfit(previousMonthStart, previousMonthEnd)
            const c_profit = await fetchProfit(currentMonthStart, new Date())
    
            // Calculate profit difference percentage
            const differencePercentage = l_profit ? ((c_profit - l_profit) / l_profit) * 100 : null
    
            return { c_profit, l_profit, differencePercentage }

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, detail: error.stack };
        }
    }
    
    async sellerRevenuesService(userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) return seller
    
            // Get current month details
            const currentMonthStart = moment().startOf('month').toDate()
            const currentMonthEnd = moment().endOf('month').toDate()
            const currentMonth = moment().tz('Asia/Ashgabat').add(1, 'months').format('MMM')

            // Fetch order items related to seller with completed orders
            const filteredOrderItems = await Models.OrderItems.findAll({
                include: [
                    { model: Models.Orders, attributes: ['status'], where: { status: 'completed' }, required: true },
                    { model: Models.Products, attributes: ['sellerId', 'org_price'], where: { sellerId: seller }, required: true }
                ],
                raw: true
            })
    
            const orderIds = filteredOrderItems.map(item => item.orderId)
            const productIds = filteredOrderItems.map(item => item.productId)
    
            // Function to fetch total sales and profit for a given date range
            const getSalesData = async (startDate, endDate) => {
                return Models.OrderItems.findAll({
                    where: {
                        orderId: { [Op.in]: orderIds },
                        productId: { [Op.in]: productIds },
                        createdAt: { [Op.between]: [startDate, endDate] }
                    },
                    attributes: [
                        [Sequelize.literal('SUM(total_price)'), 'totalSales']
                    ],
                    raw: true
                })
            }
    
            // Fetch current month sales
            const currentMonthSales = await getSalesData(currentMonthStart, currentMonthEnd)
    
            // Prepare last five months' data
            const lastFiveMonths = Array.from({ length: 5 }, (_, i) => ({
                monthStart: moment().subtract(i, 'months').startOf('month').toDate(),
                monthEnd: moment().subtract(i, 'months').endOf('month').toDate(),
                monthName: moment().subtract(i, 'months').format('MMM')
            }))
    
            // Fetch last five months sales data
            const salesData = await Models.OrderItems.findAll({
                where: {
                    orderId: { [Op.in]: orderIds },
                    productId: { [Op.in]: productIds },
                    createdAt: { [Op.between]: [lastFiveMonths[4].monthStart, lastFiveMonths[0].monthEnd] }
                },
                attributes: [
                    [Sequelize.fn('date_trunc', 'month', Sequelize.col('createdAt')), 'month'],
                    [Sequelize.fn('SUM', Sequelize.literal('total_price')), 'totalSales']
                ],
                group: ['month'],
                raw: true
            })
    
            // Format sales for the last five months
            const formattedSales = lastFiveMonths.map(month => {
                const found = salesData.find(sale => moment(sale.month).format('MMM') === month.monthName)
                return {
                    month: month.monthName,
                    totalSales: found?.totalSales || "0"
                }
            })
    
            // Fetch profit for each month (using product price and quantity)
            const profitData = await Models.OrderItems.findAll({
                include: { model: Models.Products, attributes: ['org_price'] },
                where: {
                    orderId: { [Op.in]: orderIds },
                    productId: { [Op.in]: productIds },
                    createdAt: { [Op.between]: [lastFiveMonths[4].monthStart, lastFiveMonths[0].monthEnd] }
                },
                attributes: ['quantity', 'createdAt'],
                raw: true
            })
    
            const profitWithTotal = profitData.map(item => ({
                month: item.createdAt,
                totalSales: (item['product.org_price'] * item.quantity).toString()
            }))
    
            // Format profit data
            const formattedProfits = lastFiveMonths.map(month => {
                const found = profitWithTotal.find(sale => moment(sale.month).format('MMM') === month.monthName)
                return {
                    month: month.monthName,
                    totalSales: found?.totalSales || "0"
                }
            })
    
            // Fetch current month profit
            const currentMonthProfit = await Models.OrderItems.findAll({
                where: {
                    orderId: { [Op.in]: orderIds },
                    productId: { [Op.in]: productIds },
                    createdAt: { [Op.between]: [currentMonthStart, currentMonthEnd] }
                },
                include: { model: Models.Products, attributes: ['org_price'] },
                attributes: ['quantity'],
                raw: true
            })
    
            const currentProfitTotal = currentMonthProfit.reduce((total, item) =>
                total + (item['product.org_price'] * item.quantity), 0)
    
            // Add current month data to the start of the lists
            formattedSales.unshift({ month: currentMonth, totalSales: currentMonthSales[0]?.totalSales || "0" })
            formattedProfits.unshift({ month: currentMonth, totalSales: currentProfitTotal.toString() })
    
            // Final result
            const result = {
                sales: formattedSales,
                profits: formattedProfits
            }
    
            return Response.Success('Üstünlikli!', result)

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, detail: error.stack }
        }
    }
    
    async sellerVideosService(query) {
        try {
            let page = query.page || 1
            let limit = query.limit || 10
            let offset = page * limit - limit
            const videos = await Models.Videos.findAndCountAll({
                attributes: ['id', 'video', 'thumbnail', 'desc'],
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
                attributes: ['id', 'status', 'createdAt'],
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
            const now = new Date()
            const timeDiff = now - order.createdAt
            const diffInMinutes = Math.floor(timeDiff / 1000 / 60)
            if (diffInMinutes < 2) {
                return Response.Forbidden('2 minutdan soňra täzeden synanyşyň!', {})
            }
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