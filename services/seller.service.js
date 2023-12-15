const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Sequelize } = require('../config/database')

class SellerService {
    async sellerRegisterService(body, filenames) {
        try {
            const seller = await Models.Sellers.findAll({ attributes: ['id'], where: { name: body.name } })
            if (seller.length > 0) { return Response.Forbidden('Satyjy registrasiýa bolan!', []) }
            if (body.main_number === body.second_number) { return Response.BadRequest('Iki sany menzesh nomer bolup bilmez!', []) }
            console.log(body);
            const _seller = await Models.Sellers.create({
                name: body.name,
                store_number: body.store_number,
                store_floor: body.store_floor,
                about: body.about,
                logo: filenames.logo[0].filename,
                bg_img: filenames.bg_img[0].filename || 'bg.jpg',
                color: body.color,
                seller_type: body.seller_type,
                sell_type: body.sell_type,
                instagram: body.instagram,
                tiktok: body.tiktok,
                main_number: body.main_number,
                second_number: body.second_number,
                userId: body.userId,
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
                promocode: body.promocode || null,
                discount: body.discount,
                productId: body.productId
            })
            return Response.Success('Arzanladysh goshuldy!', offer)
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
                where: { sellerId: body.sellerId }
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
                amount: body.amount,
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

    async allSellerService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'name'
            let order = q.order || 'asc'
            let conditions = {}
            let _conditions = {
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
                attributes: ['id', 'name', 'logo', 'store_number', 'store_floor'],
                include: {
                    model: Models.Categories,
                    where: { isActive: true },
                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            })
            if (seller.length === 0) { return Response.NotFound('Satyjy tapylmady!', []) }
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
            let status = q.status || 'inprocess'
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
            if (orders.length === 0) { return Response.NotFound('Sargyt edilen haryt yok!', []) }
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

    async fetchFollowersService(id) {
        try {
            const followers = await Models.Followers.findAll({
                where: { sellerId: Number(id) },
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'fullnamme'],
                    order: [['id', 'DESC']]
                }
            })
            if (followers.length == 0) { return Response.NotFound('Follower yok!', []) }
            return Response.Success('Follwerler!', followers)
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
    async updateSellerProfileService(body) {
        try {
            let newObj = {}
            for (const key in body) {
                if (body[key].length > 0) {
                    newObj[key] = body[key]
                }
            }
            await Models.Sellers.update({ newObj }, { where: { id: body.id } })
                .then(() => { return Response.Success('Satyjy maglumatlary täzelendi!', []) })
                .catch((err) => {
                    console.log(err)
                    return Response.BadRequest('Yalnyshlyk yuze cykdy!', [])
                })
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

            await Models.ProductImages.destroy({ where: { productId: productId } })
            await Models.ProductReviews.destroy({ where: { productId: productId } })
            await Models.ProductReviewImages.destroy({ where: { productId: productId } })
            await Models.ProductFeatures.destroy({ where: { productId: productId } })
            await Models.Offers.destroy({ where: { productId: productId } })
            await Models.Baskets.destroy({ where: { productId: productId } })
            await Models.Comments.destroy({ where: { productId: productId } })
            await Models.Likes.destroy({ where: { productId: productId } })
            await Models.Orders.destroy({ where: { productId: productId } })
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

            await Models.Users.destroy({ where: { id: userId } })
            await Models.Brands.destroy({ where: { userId: userId } })
            await Models.Notifications.destroy({ where: { userId: userId } })
            await Models.Banners.destroy({ where: { userId: userId } })
            await Models.Chats.destroy({ where: { sellerId: sellerId } })
            await Models.Products.destroy({ where: { sellerId: sellerId } })
            await Models.Coupons.destroy({ where: { sellerId: sellerId } })
            await Models.Sellers.destroy({ where: { id: sellerId } })
            return Response.Success('Satyjy pozuldy!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new SellerService()