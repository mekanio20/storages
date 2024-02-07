const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Sequelize } = require('../config/database')
const { fetchReviewService } = require('./product.service')

class SellerService {
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
            if (body.main_number === body.second_number) { return Response.BadRequest('Iki sany menzesh nomer bolup bilmez!', []) }
            const _seller = await Models.Sellers.create({
                name: body.name,
                store_number: body.store_number,
                store_floor: body.store_floor,
                about: body.about,
                logo: filenames.logo[0].filename,
                bg_img: filenames.bg_img[0].filename || 'bg.jpg',
                seller_type: body.seller_type,
                sell_type: body.sell_type,
                instagram: body.instagram,
                tiktok: body.tiktok,
                main_number: body.main_number,
                second_number: body.second_number,
                userId: Number(userId),
                categoryId: body.categoryId,
                subscriptionId: body.subscriptionId
            })
            return Response.Created('Satyjy hasaba alyndy!', _seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addOfferService(body) {
        try {
            const offer = await Models.Offers.create({
                currency: body.currency,
                discount: body.discount,
                productId: body.productId
            })
            return Response.Success('Arzanladysh goshuldy!', offer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async fetchOneSellerService(id) {
        try {
            const seller = await Models.Sellers.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Models.Users,
                    where: {
                        id: id,
                        isSeller: true
                    }
                }
            })
            console.log(JSON.stringify(seller, null, 2))
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            if (seller.isVerified === false) { return Response.Unauthorized('Satyjy tassyklanmady!', []) }
            return Response.Success('Üstünlikli!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async profileSellerService(id, userId) {
        try {
            let rating = 0
            const seller = await Models.Sellers.findOne({
                attributes: { exclude: ['seller_type', 'userId', 'categoryId', 'subscriptionId', 'createdAt', 'updatedAt', 'deletedAt'] },
                where: { id: id }
            })
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            seller.dataValues.followers = await Models.Followers.count({ where: { sellerId: id } })
            seller.dataValues.products = await Models.Products.count({ where: { sellerId: id } })
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            seller.dataValues.follower = await Models.Followers.findOne({ where: { customerId: customerId, sellerId: id } }) ? true : false
            const _seller = await Models.Products.findAll({ attributes: ['id'], where: { sellerId: id } })
            for (let i = 0; i < _seller.length; i++) {
                rating += await (await fetchReviewService(_seller[i].id)).detail.rating
            }
            seller.dataValues.rating = rating / _seller.length
            return Response.Success('Satyjy Maglumaty!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allSellerService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'name'
            let order = q.order || 'asc'
            let conditions = {}
            let _conditions = {
                isVerified: q.isVerified || null,
                store_number: q.store_number || null,
                store_floor: q.store_floor || null,
                categoryId: q.categoryId || null
            }
            for (let i in _conditions) {
                if (_conditions[i] !== null) {
                    conditions[i] = _conditions[i]
                }
            }
            const seller = await Models.Sellers.findAndCountAll({
                where: conditions,
                attributes: { exclude: ['userId', 'categoryId', 'subscriptionId'] },
                include: [
                    {
                        model: Models.Categories,
                        where: { isActive: true }, required: false,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug']
                    },
                    {
                        model: Models.Subscriptions,
                        where: { isActive: true },
                        attributes: ['name']
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            })
            if (seller.count === 0) { return Response.NotFound('Satyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allOrdersService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let status = q.status || 'ondelivery'
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            const orders = await Models.Orders.findAndCountAll({
                attributes: ['id', 'customerId', 'order_id', 'status', 'time'],
                where: { status: status },
                include: [
                    {
                        model: Models.Products,
                        where: { isActive: true },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'sale_price'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true }, required: false,
                                attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
                            },
                            {
                                model: Models.Sellers,
                                where: { userId: q.id },
                                attributes: [],
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
                        attributes: ['fullname']
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            })
            if (orders.count === 0) { return Response.NotFound('Sargyt edilen haryt yok!', []) }
            return Response.Success('Üstünlikli!', orders)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async orderDetailService(id, userId) {
        try {
            const order = await Models.Orders.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt', 'customerId', 'productId'] },
                where: { id: id },
                include: [
                    {
                        model: Models.Products,
                        where: { isActive: true },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'sale_price'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true }, required: false,
                                attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
                            },
                            {
                                model: Models.Sellers,
                                where: { userId: userId },
                                attributes: [],
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
                        attributes: ['fullname']
                    }
                ]
            })
            if (!order) { return Response.NotFound('Sargyt tapylmady!', []) }
            return Response.Success('Üstünlikli!', order)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sellerFollowersService(id) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const followers = await Models.Followers.findAndCountAll({
                where: { sellerId: Number(id) },
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'img', 'fullnamme'],
                    order: [['id', 'DESC']]
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'desc']]
            })
            if (followers.count === 0) { return Response.NotFound('Yzarlaýan yok!', []) }
            return Response.Success('Yzarlaýanlar!', followers)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async topSellersSerive(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const topProducts = await Models.Orders.findAll({
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
                order: [[Sequelize.fn('COUNT', Sequelize.col('productId')), 'DESC']],
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
            sellerSalesCounts.sort((a, b) => b.salesCount - a.salesCount)
            return Response.Success('Üstünlikli!', sellerSalesCounts)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // PUT
    async updateSellerProfileService(body, userId) {
        try {
            let newObj = {}
            const sellerId = await Verification.isSeller(userId)
            if (!sellerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            for (const key in body) { if (body[key]) { newObj[key] = body[key] } }
            await Models.Sellers.update(newObj, { where: { id: Number(body.id) } })
                .catch((err) => { console.log(err) })
            return Response.Success('Satyjy maglumaty täzelendi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteProductService(productId, userId) {
        try {
            const sellerId = await Models.Sellers.findOne({
                attributes: ['id'],
                where: { userId: userId },
                include: {
                    model: Models.Users,
                    attributes: ['isSeller'],
                    where: {
                        id: userId,
                        isSeller: true
                    }
                }
            })
            console.log(JSON.stringify(sellerId, null, 2))
            if (!sellerId) { return Response.NotFound('Haryt tapylmady!', []) }

            await Models.Products.destroy({ where: { sellerId: sellerId.id, id: productId } })
            return Response.Success('Haryt pozuldy!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteSellerService(sellerId, userId) {
        try {
            const seller = await Models.Sellers.findOne({ attributes: ['id'], where: { userId: userId } })
            console.log(JSON.stringify(seller, null, 2))
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }

            await Models.Sellers.destroy({ where: { id: sellerId } })
            return Response.Success('Satyjy pozuldy!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new SellerService()