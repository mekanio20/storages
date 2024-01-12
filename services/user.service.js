const Verification = require('../helpers/verification.service')
const Functions = require('../helpers/functions.service')
const Response = require('../helpers/response.service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const Axios = require('axios')
const redis = require('../ioredis')
const Models = require('../config/models')
const { Op } = require('sequelize')
const { Sequelize } = require('../config/database')
const { fetchReviewService } = require('./product.service')
const { allCommentService } = require('./comment.service')

class UserService {

    async userLoginService(phone, password) {
        try {
            let user = await Verification.isExists(phone)
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const hash = await bcrypt.compare(password, user.password)
            if (!hash) { return Response.Forbidden('Telefon nomeri ya-da parol nädogry!', []) }
            const token = await Functions.generateJwt(user.id, user.groupId)
            let response = await Response.Success('Üstünlikli!', user)
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async forgotPasswordService(phone, orgPass, verifPass) {
        try {
            let user = await Verification.isExists(phone)
            if (orgPass !== verifPass) { return Response.BadRequest('Nädogry parol!', []) }
            if (!user) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            user.orgPass = orgPass
            const response = await this.sendOtpService(user)
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userRegisterService(body, ip, device) {
        try {
            const user = await Verification.isExists(body.phone)
            if (user) { return Response.BadRequest('Ulanyjy eýýäm hasaba alynan!', []) }
            const hash = await bcrypt.hash(body.password, 5)
            const groupId = await Models.Groups.findOne({ where: { name: 'USERS' }, attributes: ['id'] })
            if (!groupId) { return Response.NotFound('Beyle grupba yok!', []) }
            let _user = {
                phone: body.phone,
                password: hash,
                ip: ip,
                device: device,
                uuid: uuid.v4(),
                groupId: groupId.id
            }
            const response = await this.sendOtpService(_user)
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async checkControlService(code, user) {
        try {
            const systemcode = await redis.get(user.phone)
            const exist = await Verification.isExists(user.phone)
            if (exist) { return Response.BadRequest('Ulanyjy eýýäm hasaba alynan!', []) }
            if (code !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            let _user = await Models.Users.create(user)
            let token = await Functions.generateJwt(_user.id, _user.groupId)
            return Response.Created('Ulanyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async resetPasswordService(code, user) {
        try {
            const systemcode = await redis.get(user.data.phone)
            let exist = await Verification.isExists(user.data.phone)
            if (exist.length == 0) { return Response.BadRequest('Ulanyjy hasaba alynmady!', []) }
            if (code !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            let hash = await bcrypt.hash(user.data.orgPass, 5)
            await Models.Users.update({ password: hash }, { where: { id: user.data.id } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            let token = await Functions.generateJwt(user.data.id, user.data.groupId)
            return Response.Created('Ulanyjy paroly tazelendi!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async customerRegisterService(body) {
        try {
            const { fullname, gender, email, userId } = body
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
                    userId: userId
                }
            })
            if (created == false) { return Response.Forbidden('Müşteri hasaba alnan!', []) }
            await Models.Users.update({ isCustomer: true, isSeller: false, isStaff: false }, { where: { id: userId } })
            return Response.Created('Müşteri hasaba alyndy!', customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addContactService(body) {
        try {
            let day = new Date()
            day.setHours(day.getHours() - 24)
            const count = await Models.Contacts.count({
                where: {
                    phone: body.phone,
                    createdAt: {
                        [Op.gte]: day
                    }
                }
            })
            if (count >= 5) { return Response.Forbidden('Limidiňiz doldy!', []) }
            const contact = await Models.Contacts.create({
                phone: body.phone,
                email: body.email,
                fullname: body.fullname,
                message: body.message
            })
            return Response.Created('Maglumat ugradyldy!', contact)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addLikeService(body) {
        try {
            const likes = await Models.Likes.create({ customerId: body.customerId, productId: body.productId })
            return Response.Created('Like goyuldy!', likes)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addOrderService(body, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            let order_id = ''
            let today = new Date()
            const numbers = '0123456789'
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
            today = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear()
            for (let i = 0; i < 4; i++) {
                order_id += characters.charAt(Math.floor(Math.random() * characters.length))
            }
            for (let i = 0; i < 4; i++) {
                order_id += numbers.charAt(Math.floor(Math.random() * numbers.length))
            }
            const order = await Models.Orders.create({
                fullname: body.fullname,
                phone: body.phone,
                address: body.address,
                order_id: order_id,
                status: 'ondelivery',
                payment: body.payment,
                amount: body.amount,
                time: today,
                note: body.note,
                customerId: customerId,
                productId: body.productId
            }).catch((err) => { console.log(err) })
            return Response.Created('Hasaba alyndy!', order)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBasketService(body) {
        try {
            const basket = await Models.Baskets.create({
                quantity: body.quantity,
                productId: body.productId,
                customerId: body.customerId
            })
            return Response.Created('Harydynyz sebede goshuldy!', basket)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFollowerService(sellerId, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const follower = await Models.Followers.create({ sellerId: sellerId, customerId: customerId })
            return Response.Created('Follow doredildi!', follower)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addMessageService(body, userId, file) {
        try {
            const customerId = await Verification.isCustomer(userId) || await Verification.isCustomer(body.userId)
            const sellerId = await Verification.isSeller(body.userId) || await Verification.isSeller(userId)
            if (!customerId || !sellerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const [chat, created] = await Models.Chats.findOrCreate({
                where: {
                    customerId: customerId,
                    sellerId: sellerId
                },
                defaults: {
                    customerId: customerId,
                    sellerId: sellerId
                }
            })
            await Models.Messages.create({
                content: body.content,
                attachment: file,
                time: new Date(),
                chatId: chat.id,
                userId: Number(userId) // Iberen...
            }).then(() => { console.log(true) })
                .catch((err) => { console.log('ERROR ----> ', err) })
            return Response.Created('Message ugradyldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async allMessagesService(id, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            const sellerId = await Verification.isSeller(userId)
            const chat = await Models.Chats.findOne({
                attributes: ['id', 'sellerId', 'customerId'],
                where: {
                    id: id,
                    isActive: true,
                    [Op.or]: [
                        { customerId: customerId },
                        { sellerId: sellerId }
                    ]
                }
            })
            console.log('CHAT ===>', JSON.stringify(chat, 2, null))
            if (!chat) { return Response.Forbidden('Rugsat edilmedi!', []) }
            const messages = await Models.Messages.findAll({
                attributes: ['id', 'content', 'time', 'attachment', 'userId'],
                where: {
                    [Op.and]: [
                        { isActive: true },
                        { chatId: id }
                    ]
                },
                order: [['id', 'DESC']]
            })
            return Response.Success('Üstünlikli!', messages)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userProfileService(id) {
        try {
            const user = await Models.Users.findOne({
                where: { id: id },
                attributes: ['id', 'phone'],
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'fullname', 'email']
                }
            })
            if (!user) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', user)
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
            const selling_products = await Models.Orders.findAll({
                attributes: [
                    [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalSelling'] 
                ],
                include: [
                    {
                        model: Models.Products,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'quantity', 'org_price', 'sale_price'],
                        include: [
                            {
                                model: Models.Subcategories,
                                attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                                where: { isActive: true },
                                include: {
                                    model: Models.Categories,
                                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                                    where: { isActive: true }
                                }
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
                    'product.subcategory.category.id', 
                    'product.brand.id', 'product.seller.id'
                ],
                limit: Number(limit),
                offset: Number(offset)
            })
            await Promise.all(selling_products.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.product.id }})
                const rating = await fetchReviewService(item.product.id)
                const comment = await allCommentService({ productId: item.product.id })
                result.push({ 
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count,
                })
            }))
            result.sort((a, b) => Number(b.totalSelling) - Number(a.totalSelling))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async topLikedSerive(q) {
        try {
            let result = []
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
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
                                where: { isActive: true },
                                include: {
                                    model: Models.Categories,
                                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug'],
                                    where: { isActive: true }
                                }
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
                    'product.subcategory.category.id', 
                    'product.brand.id', 'product.seller.id'
                ],
                limit: Number(limit),
                offset: Number(offset)
            })
            await Promise.all(top_liked.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.product.id }})
                const rating = await fetchReviewService(item.product.id)
                const comment = await allCommentService({ productId: item.product.id })
                result.push({ 
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count,
                })
            }))
            result.sort((a, b) => Number(b.totalLiked) - Number(a.totalLiked))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allOfferListService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const offers = await Models.Offers.findAll({
                attributes: ['id', 'promocode', 'discount'],
                include: {
                    model: Models.Products,
                    attributes: { exclude: ['updatedAt', 'isActive'] }
                },
                order: [['discount', 'asc']],
                limit: Number(limit),
                offset: Number(offset)
            })
            return Response.Success('Üstünlikli!', offers)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sendOtpService(user) {
        try {
            console.log('Send Otp Service --> ', JSON.stringify(user.phone, 2, null))
            const bodyParameters = { phone: user.phone }
            const { data } = await Axios.post('http://localhost:3000/otp', bodyParameters)
            const random = data.pass
            const token = jwt.sign({ user }, process.env.PRIVATE_KEY, { expiresIn: '5m' })
            await redis.set(user.phone, random)
            await redis.expire(user.phone, 300)
            return Response.Success('Tassyklama kody ugradyldy!', { token })
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

    async allSubcategoryListService(q) {
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

    async allBrandListService(q) {
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

    async allUsersService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let _whereState = { isActive: true }
            if (q.status === 'all') { _whereState = {} }
            const users = await Models.Users.findAndCountAll({
                where: _whereState,
                attributes: { exclude: ['password', 'uuid', 'groupId', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: {
                    model: Models.Groups,
                    attributes: ['id', 'name']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (users.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', users)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allFeatureListService() {
        try {
            const features = await Models.Features.findAll({
                where: { isActive: true },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']]
            })
            if (features.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', features)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchLikesService(productId) {
        try {
            const likes = await Models.Likes.findAll({
                where: { productId: productId },
                include: {
                    model: Models.Customers,
                    attributes: ['fullname', 'img']
                },
                order: [['id', 'DESC']]
            })
            if (likes.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', likes)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async favoriteProductsService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let customerId = await Verification.isCustomer(q.user)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const products = await Models.Likes.findAndCountAll({
                attributes: ['id', 'customerId'],
                where: { customerId: customerId },
                include: {
                    model: Models.Products,
                    where: { isActive: true },
                    attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'slug', 'org_price', 'sale_price']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (products.count === 0) { return Response.NotFound('Halanyan haryt yok!', []) }
            const result = { count: 0, rows: [] }
            result.count = products.count
            await Promise.all(products.rows.map(async (item) => {
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.product.id }})
                const rating = await fetchReviewService(item.product.id)
                const comment = await allCommentService({ productId: item.product.id })
                result.rows.push({
                    ...item.dataValues,
                    images: images,
                    rating: rating.detail.rating,
                    comment: comment.detail.count
                })
            }))
            return Response.Success('Halayan harytlarymm...', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchOneBasketService(id) {
        try {
            const customerId = await Verification.isCustomer(id)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const basket = await Models.Baskets.findOne({
                where: {
                    isActive: true,
                    customerId: Number(id)
                },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Models.Products,
                    where: { isActive: true },
                    attributes: [
                        'id', 'tm_name', 'ru_name', 'en_name',
                        'tm_desc', 'ru_desc', 'en_desc',
                        'quantity', 'sale_price'
                    ],
                    include: {
                        model: Models.ProductImages,
                        where: { isActive: true },
                        attributes: ['id', 'img', 'order']
                    }
                }
            })
            if (!basket) { return Response.NotFound('Haryt yok!', []) }
            return Response.Success('Sebedim', basket)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchFollowedService(id) {
        try {
            const customerId = await Verification.isCustomer(id)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const followed = await Models.Followers.findAndCountAll({
                where: { customerId: customerId },
                attributes: ['id'],
                include: {
                    model: Models.Sellers,
                    attributes: ['id', 'name', 'logo']
                },
                order: [['id', 'desc']]
            })
            if (followed.count === 0) { return Response.NotFound('Yzarlanyan satyjy yok!', []) }
            return Response.Success('Yzarlanyanlar', followed)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // PUT
    async updateOrderService(id, userId) {
        try {
            
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteLikeService(userId, productId) {
        try {
            await Models.Likes.destroy({ where: { userId: userId, productId: productId } })
                .then(() => { return Response.Success('Like pozuldy!', []) })
                .catch((err) => { console.log(err) })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new UserService()