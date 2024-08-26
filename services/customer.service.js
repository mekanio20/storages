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
            }).catch((err) => console.log(err))
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
                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                },
                limit: Number(limit),
                offset: Number(offset)
            }).catch((err) => { console.log(err) })
            if (products.count === 0) { return Response.NotFound('Halanýan haryt ýok!', []) }
            const result = { count: 0, rows: [] }
            result.count = products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ attributes: ['id', 'img'], where: { productId: item.product.id } })
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

    async customerBasketService(userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const basket = await Models.Baskets.findAll({
                where: { isActive: true, customerId: customer },
                attributes: ['id', 'quantity'],
                include: {
                    model: Models.Products,
                    where: { isActive: true },
                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price', 'sellerId'],
                    include: [
                        {
                            model: Models.Sellers,
                            attributes: ['logo', 'name'],
                        },
                        {
                            model: Models.ProductImages,
                            where: { isActive: true }, required: false,
                            attributes: ['id', 'img'],
                        },
                    ]
                },
                order: [['id', 'desc']]
            }).catch((err) => { console.log(err) })
            if (basket.length === 0) { return Response.NotFound('Haryt ýok!', []) }
            for (const item of basket) {
                const _features = await Models.ProductFeatures.findAll({
                    where: { productId: item.product.id, isActive: true },
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
                item.product.dataValues.features = features
                const productQuantity = item.product.quantity
                if (item.quantity > productQuantity) {
                    item.quantity = productQuantity
                    await item.save()
                }
            }
            return Response.Success('Sebedim', basket)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async customerFollowedService(userId, q) {
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

    async customerOrdersService(userId, q) {
        try {
            let whereState = {}
            if (q.status) whereState.status = q.status
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            whereState.customerId = customer
            const orders = await Models.Orders.findAll({
                attributes: { exclude: ['customerId', 'createdAt', 'updatedAt']},
                where: whereState,
                include: {
                    model: Models.OrderItems, required: true,
                    attributes: ['id', 'quantity'],
                    include: {
                        model: Models.Products,
                        require: true,
                        where: { isActive: true },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true }, required: false,
                                attributes: ['id', 'img'],
                            },
                            {
                                model: Models.Sellers,
                                attributes: ['id', 'logo', 'name'],
                            }
                        ]
                    }
                }
            }).catch((err) => { console.log(err) })
            if (orders.length === 0) { return Response.NotFound('Sargyt ýok!', []) }
            for (const item of orders) {
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
    async customerEditBasketService(userId, body) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const user = await Models.Baskets.update({ quantity: body.quantity }, { where: { id: body.id, customerId: customer } })
                .catch((err) => console.log(err))
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
    async customerEditOrderService(userId, body) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const order = await Models.Orders.findOne({ where: { id: body.id, customerId: customer } })
            if (!order) { return Response.Unauthorized('Sargyt tapylmady!', []) }
            if (order.status !== "pending") { return Response.BadRequest('Sargydy goýbolsun edip bolmaýar!', []) }
            order.status ='cancelled'
            await order.save()
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
    // DELETE
    async customerDeleteBasketService(userId, id) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const user = await Models.Baskets.destroy({ where: { id: id, customerId: customer } })
                .catch((err) => console.log(err))
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
    async customerDeleteFollowService(userId, id) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const user = await Models.Followers.destroy({ where: { sellerId: id, customerId: customer } })
                .catch((err) => console.log(err))
            if (!user) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
    async customerDeleteLikeService(userId, id) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const user = await Models.Likes.destroy({ where: { productId: id, customerId: customer } })
                .catch((err) => console.log(err))
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new CustomerService()