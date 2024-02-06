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
const { fetchReviewService } = require('./product.service')
const { allCommentService } = require('./comment.service')

class UserService {

    async userLoginService(phone, password) {
        try {
            let user = await Verification.isExists(phone)
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const hash = await bcrypt.compare(password, user.password)
            if (!hash) { return Response.Forbidden('Telefon nomeri ya-da parol nädogry!', []) }
            user.isActive = true
            await user.save()
            const token = await Functions.generateJwt(user.id, user.groupId)
            let response = await Response.Success('Üstünlikli!', user)
            response.token = token
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

    async checkControlService(code, userDto) {
        try {
            const systemcode = await redis.get(userDto.user.phone)
            if (String(code) !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            let _user = await Models.Users.create(userDto.user)
            let token = await Functions.generateJwt(_user.id, _user.groupId)
            return Response.Created('Ulanyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async forgotPasswordService(phone, orgPass, verifPass) {
        try {
            let user = await Verification.isExists(phone)
            if (!user) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            if (orgPass !== verifPass) { return Response.BadRequest('Nädogry parol!', []) }
            user.dataValues.orgPass = orgPass
            console.log('FORGOT --> ', JSON.stringify(user, 2, null));
            const response = await this.sendOtpService(user)
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async resetPasswordService(code, userDto) {
        try {
            const systemcode = await redis.get(userDto.user.phone)
            if (String(code) !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            let hash = await bcrypt.hash(userDto.user.orgPass, 5)
            await Models.Users.update({ password: hash, isActive: true }, { where: { id: userDto.user.id } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            let token = await Functions.generateJwt(userDto.user.id, userDto.user.groupId)
            return Response.Created('Ulanyjy paroly tazelendi!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addLikeService(body, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const [like, created] = await Models.Likes.findOrCreate({
                where: {
                    customerId: customerId,
                    productId: body.productId
                },
                defaults: {
                    customerId: customerId,
                    productId: body.productId
                }
            }).catch(((err) => { console.log(err) }))
            if (created == false) { return Response.Forbidden('Like goýulan!', []) }
            return Response.Created('Like goyuldy!', like)
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

    async addBasketService(body, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const product = await Models.Products.findOne({ where: { id: body.productId, isActive: true } })
            if (!product) { return Response.BadRequest('Haryt tapylmady!', []) }
            const [basket, created] = await Models.Baskets.findOrCreate({
                where: {
                    productId: body.productId,
                    customerId: customerId
                },
                defaults: {
                    quantity: body.quantity,
                    productId: body.productId,
                    customerId: customerId
                }
            }).catch(((err) => { console.log(err) }))
            if (created == false) {
                const quantity = Number(body.quantity) + Number(basket.quantity)
                await Models.Baskets.update({ quantity: quantity },
                    { where: { customerId: basket.customerId, productId: basket.productId } })
                    .catch((err) => { console.log(err) })
            }
            return Response.Created('Harydyňyz sebede goşuldy!', basket)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFollowerService(sellerId, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const seller = await Models.Sellers.findOne({ where: { id: sellerId } })
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            const [follow, created] = await Models.Followers.findOrCreate({
                where: {
                    sellerId: seller.id,
                    customerId: customerId
                },
                defaults: {
                    sellerId: seller.id,
                    customerId: customerId
                }
            }).catch(((err) => { console.log(err) }))
            if (created == false) { return Response.Forbidden('Öň hem yzarlanýar!', []) }
            return Response.Created('Satyjy yzarlanýar!', follow)
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
            const message = await Models.Messages.create({
                content: body.content,
                attachment: file,
                time: new Date(),
                chatId: chat.id,
                sender: Number(userId), // Ugradan...
                accepted: Number(body.userId) // Kabul eden...
            }).catch((err) => { console.log(err) })
            return Response.Created('Message ugradyldy!', message)
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
                const images = await Models.ProductImages.findAndCountAll({ where: { productId: item.product.id } })
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

    async userLogoutService(userDto) {
        try {
            await Models.Users.update({ isActive: false },
                { where: { id: userDto.id, groupId: userDto.group } })
                .catch((err) => { console.log(err) })
            console.log(userDto.id);
            await Models.Customers.destroy({ where: { userId: userDto.id } })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
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