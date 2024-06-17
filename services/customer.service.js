const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')
const { fetchReviewService } = require('../services/product.service')
const { allCommentService } = require('../services/comment.service')

class CustomerService {
    // POST
    async customerRegisterService(body, userId, img) {
        try {
            const { fullname, gender, email } = body
            const [customer, created] = await Models.Customers.findOrCreate({
                where: {
                    [Op.or]: {
                        email: email,
                        userId: userId
                    }
                },
                defaults: {
                    fullname: fullname,
                    gender: gender,
                    email: email,
                    img: img?.filename || null,
                    userId: userId
                }
            }).catch(((err) => { console.log(err) }))
            if (created == false) { return Response.Forbidden('Müşteri hasaba alnan!', []) }
            await Models.Users.update({ isCustomer: true, isSeller: false, isStaff: false }, { where: { id: userId } })
            return Response.Created('Müşteri hasaba alyndy!', customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // GET
    async allCustomerService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            const customers = await Models.Customers.findAndCountAll({
                attributes: { exclude: ['userId'] },
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            })
            if (customers.count == 0) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', customers)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async customerFavoriteService(userId, q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const products = await Models.Likes.findAndCountAll({
                attributes: ['id'],
                where: { customerId: customer },
                include: {
                    model: Models.Products,
                    where: { isActive: true },
                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'sale_price']
                },
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => { console.log(err) })
            if (products.count === 0) { return Response.NotFound('Halanýan haryt ýok!', []) }
            const result = { count: 0, rows: [] }
            result.count = products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.product.id } })
                const rating = await fetchReviewService(item.product.id)
                const comment = await allCommentService({ productId: item.product.id })
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count
                })
            })).catch((err) => { console.log(err) })
            return Response.Success('Halaýan harytlarym', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async customerBasketService(userId, q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const basket = await Models.Baskets.findAndCountAll({
                where: {
                    isActive: true,
                    customerId: customer
                },
                attributes: { exclude: ['customerId', 'productId', 'createdAt', 'updatedAt'] },
                include: [
                    {
                        model: Models.Products,
                        where: { isActive: true },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'sale_price', 'sellerId'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true }, required: false,
                                attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
                            },
                            {
                                model: Models.Sellers,
                                attributes: ['id', 'logo', 'name'],
                            },
                            {
                                model: Models.Offers,
                                where: { isActive: true }, required: false,
                                attributes: ['id', 'discount']
                            }
                        ]
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'desc']]
            }).catch((err) => { console.log(err) })
            if (basket.count === 0) { return Response.NotFound('Haryt ýok!', []) }
            return Response.Success('Sebedim', basket)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async customerFollowedService(id, q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const followed = await Models.Followers.findAndCountAll({
                where: { customerId: customer },
                attributes: ['id'],
                include: {
                    model: Models.Sellers,
                    attributes: ['id', 'name', 'logo']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'desc']]
            })
            if (followed.count === 0) { return Response.NotFound('Yzarlanýan satyjy ýok!', []) }
            return Response.Success('Yzarlanýanlar', followed)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async customerOrdersService(id, q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const orders = await Models.Orders.findAndCountAll({
                attributes: ['id', 'order_id', 'status', 'time'],
                where: { customerId: customer },
                include: [
                    {
                        model: Models.Products,
                        where: { isActive: true },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'sale_price', 'sellerId'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true }, required: false,
                                attributes: { exclude: ['isActive', 'createdAt', 'updatedAt'] },
                            },
                            {
                                model: Models.Sellers,
                                attributes: ['id', 'logo', 'name'],
                            },
                            {
                                model: Models.Offers,
                                where: { isActive: true }, required: false,
                                attributes: ['id', 'discount']
                            }
                        ]
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'desc']]
            }).catch((err) => { console.log(err) })
            if (orders.count === 0) { return Response.NotFound('Sargyt ýok!', []) }
            return Response.Success('Üstünlikli!', orders)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async customerProfileService(userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const user = await Models.Users.findOne({
                where: { id: userId },
                attributes: ['id', 'phone'],
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'img', 'fullname', 'email']
                }
            })
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', user)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
    // PUT
    async customerEditProfileService(userId, body, img) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const obj = {}
            for (const item in body) { if (item) { obj[item] = body[item] } }
            if (img?.filename) obj.img = img.filename
            const user = await Models.Customers.update(obj, { where: { id: customer } })
                .catch((err) => console.log(err))
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new CustomerService()