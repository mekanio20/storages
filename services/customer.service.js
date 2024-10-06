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
            const { fullname, gender } = body
            const [customer, created] = await Models.Customers.findOrCreate({
                where: {
                    [Op.or]: {
                        userId
                    }
                },
                defaults: {
                    fullname,
                    gender,
                    img: img?.filename || null,
                    userId
                }
            })
            if (created == false) { return Response.Forbidden('Müşteri hasaba alnan!', []) }

            await Models.Users.update({ isCustomer: true, isSeller: false, isStaff: false }, { where: { id: userId } })

            return Response.Created('Müşteri hasaba alyndy!', customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    // GET
    async allCustomerService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'id',
                order = 'desc'
            } = q
    
            const customers = await Models.Customers.findAndCountAll({
                attributes: { exclude: ['userId'] },
                limit,
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })
    
            return customers.count
                ? Response.Success('Üstünlikli!', customers)
                : Response.NotFound('Ulanyjy tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] };
        }
    }    

    async customerFavoriteService(userId, q) {
        try {
            const { page = 1, limit = 10 } = q
    
            const customerId = await Verification.isCustomer(userId)
            if (isNaN(customerId)) return customerId
    
            const products = await Models.Likes.findAndCountAll({
                attributes: ['id'],
                where: { customerId },
                include: {
                    model: Models.Products,
                    where: { isActive: true },
                    attributes: [
                        'id', 'tm_name', 'ru_name', 'en_name', 'slug', 
                        'gender', 'quantity', 'sale_price', 'dis_price', 
                        'dis_type', 'final_price'
                    ],
                },
                limit,
                offset: (page - 1) * limit
            })
            if (products.count === 0) { return Response.NotFound('Halanýan haryt ýok!', []) }
    
            const result = {
                count: products.count,
                rows: await Promise.all(products.rows.map(async (item) => {
                    const images = await Models.ProductImages.findAndCountAll({ 
                        attributes: ['id', 'img'], 
                        where: { productId: item.product.id } 
                    })
                    const rating = await fetchReviewService(item.product.id)
                    const comment = await allCommentService({ productId: item.product.id })
    
                    return {
                        ...item.dataValues,
                        images,
                        rating: rating.detail.rating,
                        comment: comment.detail.count
                    }
                }))
            }
    
            return Response.Success('Halaýan harytlarym', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async customerBasketService(userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (isNaN(customerId)) return customerId
    
            const baskets = await Models.Baskets.findAll({
                where: { isActive: true, customerId },
                attributes: ['id', 'quantity'],
                include: {
                    model: Models.Products,
                    where: { isActive: true },
                    attributes: [
                        'id', 'tm_name', 'ru_name', 'en_name', 'slug', 
                        'gender', 'quantity', 'sale_price', 
                        'dis_price', 'dis_type', 'final_price', 'sellerId'
                    ],
                    include: [
                        {
                            model: Models.Sellers,
                            attributes: ['logo', 'name']
                        },
                        {
                            model: Models.ProductImages,
                            where: { isActive: true },
                            attributes: ['id', 'img'],
                            required: false
                        }
                    ]
                },
                order: [['id', 'desc']]
            })
            if (baskets.length === 0) { return Response.NotFound('Haryt ýok!', []) }
    
            await Promise.all(baskets.map(async (item) => {
                const features = await Models.ProductFeatures.findAll({
                    where: { productId: item.product.id, isActive: true },
                    include: {
                        model: Models.FeatureDescriptions,
                        attributes: ['id', 'desc'],
                        include: {
                            model: Models.Features,
                            attributes: ['id', 'name']
                        }
                    }
                })
    
                item.product.dataValues.features = features.map(feature => ({
                    id: feature.feature_description.id,
                    name: feature.feature_description.feature.name,
                    desc: feature.feature_description.desc
                }))
    
                if (item.quantity > item.product.quantity) {
                    item.quantity = item.product.quantity
                    await item.save()
                }
            }))
    
            return Response.Success('Sebedim', baskets)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async customerFollowedService(userId, q) {
        try {
            const { page = 1, limit = 10 } = q

            const customerId = await Verification.isCustomer(userId)
            if (isNaN(customerId)) return customerId
    
            const followed = await Models.Followers.findAndCountAll({
                where: { customerId },
                attributes: ['id'],
                include: {
                    model: Models.Sellers,
                    attributes: ['id', 'name', 'logo']
                },
                limit,
                offset: (page - 1) * limit,
                order: [['id', 'desc']]
            })
    
            return followed.count
                ? Response.Success('Yzarlanýanlar', followed)
                : Response.NotFound('Yzarlanýan satyjy ýok!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async customerOrdersService(userId, q) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (isNaN(customerId)) return customerId
    
            const whereState = { customerId, ...(q.status && { status: q.status }) }
    
            const orders = await Models.Orders.findAll({
                attributes: { exclude: ['customerId', 'createdAt', 'updatedAt'] },
                where: whereState,
                include: {
                    model: Models.OrderItems,
                    required: true,
                    attributes: ['id', 'quantity'],
                    include: {
                        model: Models.Products,
                        required: true,
                        where: { isActive: true },
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'gender', 'quantity', 'sale_price', 'dis_price', 'dis_type', 'final_price'],
                        include: [
                            {
                                model: Models.ProductImages,
                                where: { isActive: true },
                                required: false,
                                attributes: ['id', 'img'],
                            },
                            {
                                model: Models.Sellers,
                                attributes: ['id', 'logo', 'name'],
                            }
                        ]
                    }
                }
            })
            if (orders.length === 0) return Response.NotFound('Sargyt ýok!', [])
    
            await Promise.all(orders.map(async (order) => {
                await Promise.all(order.order_items.map(async (orderItem) => {
                    const features = await Models.ProductFeatures.findAll({
                        where: { productId: orderItem.product.id, isActive: true },
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
                    orderItem.dataValues.product.dataValues.feature = features.map(item => ({
                        id: item.feature_description.id,
                        name: item.feature_description.feature.name,
                        desc: item.feature_description.desc
                    }))
                }))
            }))
    
            return Response.Success('Üstünlikli!', orders)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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

            return user
                ? Response.Success('Üstünlikli!', user)
                : Response.Unauthorized('Ulanyjy tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // PUT
    async customerEditProfileService(userId, body, img) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (isNaN(customerId)) return customerId
    
            const updates = { ...body, ...(img?.filename && { img: img.filename }) }
            const updatedUser = await Models.Customers.update(updates, { where: { id: customerId } })
    
            return updatedUser[0]
                ? Response.Success('Üstünlikli!', [])
                : Response.Unauthorized('Ulanyjy tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] };
        }
    }
    
    async customerEditBasketService(userId, body) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }

            const user = await Models.Baskets.update({ quantity: body.quantity }, { where: { id: body.id, customerId: customer } })

            return user[0]
                ? Response.Success('Üstünlikli!', [])
                : Response.Unauthorized('Ulanyjy tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // DELETE
    async customerDeleteBasketService(userId, id) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }

            const user = await Models.Baskets.destroy({ where: { id, customerId: customer } })

            return user
                ? Response.Success('Üstünlikli!', [])
                : Response.Unauthorized('Ulanyjy tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    async customerDeleteFollowService(userId, id) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }

            const user = await Models.Followers.destroy({ where: { sellerId: id, customerId: customer } })

            return user
                ? Response.Success('Üstünlikli!', [])
                : Response.Unauthorized('Satyjy tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    async customerDeleteLikeService(userId, id) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            
            const user = await Models.Likes.destroy({ where: { productId: id, customerId: customer } })

            return user
                ? Response.Success('Üstünlikli!', [])
                : Response.Unauthorized('Ulanyjy tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new CustomerService()