const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')
const moment = require('moment')
const moment_timezone = require('moment-timezone');
const { fetchReviewService } = require('./product.service')
const { generateJwt } = require('../helpers/functions.service')
const { Sequelize } = require('../config/database')

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
            })
            
            if (seller.length > 0) { return Response.Forbidden('Satyjy registrasiýa bolan!', []) }
            if (body.main_number === body.second_number) { return Response.BadRequest('Iki sany meňzeş nomer bolup bilmez!', []) }
            
            const user = await Models.Users.findOne({ where: { id: Number(userId) } })
            user.isCustomer = false
            user.isSeller = true
            await user.save()

            const token = await generateJwt(user.id, 3)
            const newSeller = await Models.Sellers.create({
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
                subscriptionId: body.subscriptionId,
            })
            newSeller.dataValues.token = token

            return Response.Created('Satyjy hasaba alyndy!', newSeller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, msg_key: error.name, detail: [] }
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
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async allSellerService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'name',
                order = 'asc',
                name,
                status,
                store_number,
                store_floor,
                categoryId
            } = q

            const whereState = {
                [Op.and]: [
                    ...(status ? [{ isVerified: status }] : []),
                    ...(store_number ? [{ store_number }] : []),
                    ...(store_floor ? [{ store_floor }] : []),
                    ...(categoryId ? [{ categoryId }] : []),
                    ...(name ? [{ name: { [Op.iLike]: `%${name}%` } }] : [])
                ]
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
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })
            if (seller.count === 0) { return Response.NotFound('Satyjy tapylmady!', []) }

            return Response.Success('Üstünlikli!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async allBannersService(q) {
        try {
            const seller = await Models.Sellers.findOne({ where: { id: q.sellerId }, attributes: ['userId'] })
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }

            const whereState = { userId: seller.userId, type: 'profile' }
            const banners = await Models.Banners.findAndCountAll({
                where: whereState,
                attributes: { exclude: ['userId'] }
            })
            if (banners.count === 0) { return Response.NotFound('Banner ýok!', []) }

            return Response.Success('Üstünlikli!', banners)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async allOrdersService(q, userId) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'id',
                order = 'desc',
                status
            } = q
    
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) return seller
    
            const whereState = status ? { status } : {}
            const orders = await Models.Orders.findAll({
                attributes: ['id'],
                where: whereState,
                limit: Number(limit),
                offset: (page - 1) * limit,
                order: [[sort, order]],
                raw: true
            })
    
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
                                    where: { isActive: true },
                                    required: false,
                                    attributes: ['id', 'img']
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
            })
            if (detailedOrders.length === 0) return Response.NotFound('Sargyt edilen haryt yok!', [])
    
            await Promise.all(detailedOrders.map(async item => {
                await Promise.all(item.order_items.map(async order => {
                    const features = await Models.ProductFeatures.findAll({
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
                    })
                    order.dataValues.product.dataValues.feature = features.map(item => ({
                        id: item.feature_description.id,
                        name: item.feature_description.feature.name,
                        desc: item.feature_description.desc
                    }))
                }))
            }))
    
            return Response.Success('Üstünlikli!', detailedOrders)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async orderDetailService(id, userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) return seller
    
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
                                    where: { isActive: true },
                                    required: false,
                                    attributes: ['id', 'img'],
                                }
                            ]
                        }
                    },
                    {
                        model: Models.Customers,
                        attributes: ['id', 'img', 'fullname']
                    }
                ]
            })
            if (!detailedOrders) return Response.NotFound('Sargyt tapylmady!', [])
    
            await Promise.all(detailedOrders.order_items.map(async order => {
                const features = await Models.ProductFeatures.findAll({
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
                })
                order.dataValues.product.dataValues.feature = features.map(item => ({
                    id: item.feature_description.id,
                    name: item.feature_description.feature.name,
                    desc: item.feature_description.desc
                }))
            }))
    
            return Response.Success('Üstünlikli!', detailedOrders)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    
    async sellerFollowersService(id) {
        try {
            const { count, rows: followers } = await Models.Followers.findAndCountAll({
                where: { sellerId: Number(id) },
                attributes: ['id'],
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'img', 'fullname']
                },
                order: [['id', 'desc']]
            })
            if (count === 0) { return Response.NotFound('Yzarlaýan yok!', {}) }
            return Response.Success('Yzarlaýanlar!', { count, followers })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] };
        }
    }    

    async topSellersService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                order = 'desc',
                subcategoryId
            } = q
    
            const whereState = subcategoryId ? { subcategoryId } : {}
    
            const topProducts = await Models.OrderItems.findAll({
                attributes: [[Sequelize.fn('COUNT', Sequelize.col('productId')), 'salesCount']],
                include: {
                    model: Models.Products,
                    where: whereState,
                    attributes: ['id'],
                    include: {
                        model: Models.Sellers,
                        attributes: ['id', 'name', 'logo']
                    }
                },
                group: ['product.id', 'product.seller.id'],
                limit: Number(limit),
                offset: (page - 1) * limit,
                order: [['salesCount', order]]
            })
    
            const sellerSalesCounts = topProducts.reduce((acc, detail) => {
                const { id: sellerId, name: sellerName, logo: sellerImage } = detail.product.seller
                const salesCount = Number(detail.dataValues.salesCount)
                
                const existingSeller = acc.find(seller => seller.sellerId === sellerId)
                if (existingSeller) { existingSeller.salesCount += salesCount }
                else { acc.push({ sellerId, sellerName, sellerImage, salesCount }) }
    
                return acc
            }, [])
    
            const sortedSellers = sellerSalesCounts.sort((a, b) => 
                order === 'desc' ? b.salesCount - a.salesCount : a.salesCount - b.salesCount)
    
            return Response.Success('Üstünlikli!', sortedSellers)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async profileSellerService(id, userId) {
        try {
            const seller = await Models.Sellers.findOne({
                attributes: { exclude: ['seller_type', 'userId', 'categoryId', 'subscriptionId', 'createdAt', 'updatedAt', 'deletedAt'] },
                where: { id: Number(id) }
            })
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            seller.dataValues.followers = await Models.Followers.count({ where: { sellerId: id } })
            seller.dataValues.products = await Models.Products.count({ where: { sellerId: id } })

            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            seller.dataValues.isFollow = await Models.Followers.findOne({ where: { customerId: customer, sellerId: id } }) ? true : false
            
            const sellerProducts = await Models.Products.findAll({ attributes: ['id'], where: { sellerId: id } })
            const ratings = await Promise.all(sellerProducts.map(product => fetchReviewService(product.id)))
            seller.dataValues.rating = ratings.reduce((sum, rating) => sum + rating.detail.rating, 0) / (ratings.length || 1)

            return Response.Success('Satyjy Maglumaty!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async sellerSubcategoriesService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                start_price = 0,
                end_price = 100000,
                sort = 'id',
                order = 'desc',
                sellerId = 0,
                subcategoryId = 0,
                brandId = 0,
                gender = ''
            } = q
    
            const whereState = {
                isActive: true,
                sellerId: Number(sellerId),
                sale_price: { [Op.between]: [Number(start_price), Number(end_price)] },
                ...(subcategoryId && { subcategoryId }),
                ...(brandId && { brandId }),
                ...(gender && { gender })
            }
    
            const { count, rows: products } = await Models.Products.findAndCountAll({
                where: whereState,
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price', 'subcategoryId'],
                include: [
                    { model: Models.Sellers, attributes: [], required: true },
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

            if (count === 0) return Response.NotFound('Haryt ýok!', {})
    
            const rows = await Promise.all(products.map(async item => {
                const [images, commentCount, rating] = await Promise.all([
                    Models.ProductImages.findAndCountAll({
                        where: { productId: item.id, isActive: true },
                        attributes: ['id', 'img']
                    }),
                    Models.Comments.count({ where: { productId: item.id } }),
                    fetchReviewService(item.id)
                ])
    
                return {
                    ...item.dataValues,
                    images,
                    comment: commentCount,
                    rating: rating.detail.rating
                }
            }))
    
            const subcategories = await Models.Subcategories.findAll({
                where: { isActive: true },
                attributes: { exclude: ['isActive', 'userId', 'categoryId', 'createdAt', 'updatedAt'] }
            })
    
            const groupedProducts = subcategories.map(subcategory => ({
                ...subcategory.toJSON(),
                products: rows.filter(product => product.subcategoryId === subcategory.id)
            })).filter(group => group.products.length > 0)
    
            return Response.Success('Üstünlikli!', { count, rows: groupedProducts })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }  

    async sellerProductsService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                start_price = 0,
                end_price = 100000,
                sort = 'id',
                order = 'desc',
                sellerId = 0,
                subcategoryId = 0,
                brandId = 0,
                gender = '',
                isActive = true
            } = q
    
            const query = {
                sellerId,
                final_price: { [Op.between]: [Number(start_price), Number(end_price)] },
                ...(isActive !== 'all' && { isActive }),
                ...(subcategoryId && { subcategoryId }),
                ...(brandId && { brandId }),
                ...(gender && { gender })
            }

            const { count, rows: products } = await Models.Products.findAndCountAll({
                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                where: { [Op.and]: query },
                include: [
                    { model: Models.Sellers, attributes: [] },
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
    
            const rows = await Promise.all(products.map(async item => {
                const [images, commentCount, rating] = await Promise.all([
                    Models.ProductImages.findAndCountAll({
                        where: { productId: item.id, isActive: true },
                        attributes: ['id', 'img']
                    }),
                    Models.Comments.count({ where: { productId: item.id } }),
                    fetchReviewService(item.id)
                ])
    
                return {
                    ...item.dataValues,
                    images,
                    comment: commentCount,
                    rating: rating.detail.rating
                }
            }))
    
            const sortedRows = rows.sort((a, b) => {
                return order === 'desc' 
                    ? Number(b[sort]) - Number(a[sort])
                    : Number(a[sort]) - Number(b[sort])
            })
    
            return Response.Success('Üstünlikli!', { count, rows: sortedRows })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async sellerStatisticService(userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) return seller
    
            // Fetch statistics for the seller
            const { count: orders, rows } = await Models.OrderItems.findAndCountAll({
                attributes: ['total_price'],
                include: [
                    { model: Models.Orders, attributes: ['status'], where: { status: 'completed' }, required: true },
                    { model: Models.Products, attributes: ['sellerId'], where: { sellerId: seller }, required: true }
                ]
            })
    
            // Calculate total money
            const totalMoney = rows.reduce((sum, item) => sum + item.total_price, 0)
    
            // Calculate profit difference
            const { c_profit, l_profit, differencePercentage } = await this.calculateProfitDifference(seller)
    
            // Compile statistics
            const statistic = {
                totalMoney,
                orders,
                currentMonthProfit: c_profit,
                lastMonthProfit: l_profit,
                differencePercentage
            }
    
            return Response.Success('Üstünlikli!', statistic)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, detail: error.stack }
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
            const differencePercentage = l_profit ? ((c_profit - l_profit) / l_profit) * 100 : 0
    
            return { c_profit, l_profit, differencePercentage }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, detail: error.stack }
        }
    }
    
    async sellerRevenuesService(userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) return seller
    
            // Get current month details
            const currentMonthStart = moment().startOf('month').toDate()
            const currentMonthEnd = moment().endOf('month').toDate()
            const currentMonth = moment_timezone().tz('Asia/Ashgabat').add(1, 'months').format('MMM')

            // Fetch order items related to seller with completed orders
            const filteredOrderItems = await Models.OrderItems.findAll({
                attributes: ['id'],
                include: [
                    { model: Models.Orders, attributes: ['status'], where: { status: 'completed' }, required: true },
                    { model: Models.Products, attributes: ['sellerId', 'org_price'], where: { sellerId: seller }, required: true }
                ],
                raw: true
            })
            const orderItemsIds = filteredOrderItems.map(item => item.id)
    
            // Function to fetch total sales and profit for a given date range
            const getSalesData = async (startDate, endDate) => {
                return Models.OrderItems.findAll({
                    where: {
                        id: { [Op.in]: orderItemsIds },
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
                    id: { [Op.in]: orderItemsIds },
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
                    totalSales: Number(found?.totalSales) || 0
                }
            })
    
            // Fetch profit for each month (using product price and quantity)
            const profitData = await Models.OrderItems.findAll({
                include: { model: Models.Products, attributes: ['org_price'] },
                where: {
                    id: { [Op.in]: orderItemsIds },
                    createdAt: { [Op.between]: [lastFiveMonths[4].monthStart, lastFiveMonths[0].monthEnd] }
                },
                attributes: ['quantity', 'createdAt'],
                raw: true
            })
    
            const profitWithTotal = profitData.map(item => ({
                month: item.createdAt,
                totalSales: (item['product.org_price'] * item.quantity)
            }))
    
            // Format profit data
            const formattedProfits = lastFiveMonths.map(month => {
                const found = profitWithTotal.find(sale => moment(sale.month).format('MMM') === month.monthName)
                return {
                    month: month.monthName,
                    totalSales: found?.totalSales || 0
                }
            })
    
            // Fetch current month profit
            const currentMonthProfit = await Models.OrderItems.findAll({
                where: {
                    id: { [Op.in]: orderItemsIds },
                    createdAt: { [Op.between]: [currentMonthStart, currentMonthEnd] }
                },
                include: { model: Models.Products, attributes: ['org_price'] },
                attributes: ['quantity'],
                raw: true
            })
    
            const currentProfitTotal = currentMonthProfit.reduce((total, item) =>
                total + (item['product.org_price'] * item.quantity), 0)
    
            // Add current month data to the start of the lists
            formattedSales.unshift({ month: currentMonth, totalSales: currentMonthSales[0]?.totalSales || 0 })
            formattedProfits.unshift({ month: currentMonth, totalSales: currentProfitTotal })
    
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
    
    async sellerVideosService(q) {
        try {
            const { page = 1, limit = 10, sellerId } = q

            const videos = await Models.Videos.findAndCountAll({
                attributes: ['id', 'video', 'thumbnail', 'desc'],
                where: {
                    sellerId: Number(sellerId),
                    isActive: true
                },
                limit: Number(limit),
                offset: (page - 1) * limit
            })
            if (videos.count === 0) { return Response.NotFound('Video yok!', []) }

            return Response.Success('Üstünlikli!', videos)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    // PUT
    async updateSellerProfileService(body, userId, files) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }
            
            let newObj = {}
            for (const key in body) { if (body[key]) { newObj[key] = body[key] } }

            if (files?.logo) { newObj.logo = files.logo[0].filename }
            if (files?.bg_img) { newObj.bg_img = files.bg_img[0].filename }

            await Models.Sellers.update(newObj, { where: { id: seller } })

            return Response.Success('Satyjy maglumaty täzelendi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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
            })
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
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    // DELETE
    async deleteSellerService(userId) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { return seller }

            await Models.Sellers.destroy({ where: { id: seller } })
                .then(() => { console.log(true) })

            return Response.Success('Satyjy maglumaty pozuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new SellerService()