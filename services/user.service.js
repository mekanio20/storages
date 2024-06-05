const Verification = require('../helpers/verification.service')
const Functions = require('../helpers/functions.service')
const Response = require('../helpers/response.service')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const Axios = require('axios')
const bcrypt = require('bcrypt')
const redis = require('../ioredis')
const Models = require('../config/models')
const { Op } = require('sequelize')

class UserService {
    // POST
    async userLoginService(phone, password) {
        try {
            let user = await Verification.isExists(phone)
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const hash = await bcrypt.compare(password, user.password)
            if (!hash) { return Response.Forbidden('Telefon nomeri ya-da parol nädogry!', []) }
            user.isActive = true
            await user.save()
            const token = await Functions.generateJwt(user.dataValues.id, user.dataValues.groupId)
            return Response.Success('Ulanyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async userVerificationService(code, userDto) {
        try {
            const systemcode = await redis.get(userDto.user.phone)
            if (String(code) !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            const user = await Models.Users.findOne({ where: { id: userDto.user.id } })
            if (!user) { return Response.Unauthorized('Ulanyjy tapylmady!', []) }
            const token = await Functions.generateJwt(user.id, user.groupId)
            return Response.Success('Ulanyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async forgotPasswordService(phone, orgPass, verifPass) {
        try {
            let user = await Verification.isExists(phone)
            if (!user) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            if (orgPass !== verifPass) { return Response.BadRequest('Nädogry parol!', []) }
            user.dataValues.orgPass = orgPass
            const response = await this.sendOtpService(user)
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async resetSubscriptionService(code, userDto) {
        try {
            console.log('USER DTO --->', userDto)
            const systemcode = await redis.get(userDto.user.phone)
            if (String(code) !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            const sellerId = await Verification.isSeller(userDto.user.id)
            if (!sellerId) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            await Models.Sellers.update({ isVerified: false }, { where: { id: sellerId } })
                .catch((err) => { console.log(err) })
            let token = await Functions.generateJwt(userDto.user.id, userDto.user.groupId)
            return Response.Success('Satyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async addBasketService(body, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const product = await Models.Products.findOne({ where: { id: body.productId, isActive: true } })
            if (!product) { return Response.BadRequest('Haryt tapylmady!', []) }
            const [basket, created] = await Models.Baskets.findOrCreate({
                where: {
                    productId: body.productId,
                    customerId: customer
                },
                defaults: {
                    quantity: body.quantity,
                    productId: body.productId,
                    customerId: customer
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async addMessageService(body, userId, file) {
        try {
            const customerId = await Verification.isCustomer(userId) || await Verification.isCustomer(body.userId)
            const sellerId = await Verification.isSeller(body.userId) || await Verification.isSeller(userId)
            if (isNaN(customerId) || isNaN(sellerId)) { return customerId }
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            }).catch((err) => { console.log(err) })
            if (!chat) { return Response.Forbidden('Rugsat edilmedi!', []) }
            const messages = await Models.Messages.findAll({
                attributes: ['id', 'content', 'attachment', 'sender', 'accepted', 'createdAt'],
                where: {
                    isActive: true,
                    chatId: id
                },
                order: [['id', 'asc']]
            }).catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', messages)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async sendOtpService(user) {
        try {
            console.log('Send Otp Service --> ', JSON.stringify(user.phone, 2, null))
            const bodyParameters = { phone: user.phone }
            const { data } = await Axios.post('http://localhost:3001/otp', bodyParameters)
            const random = data.pass
            const token = jwt.sign({ user }, process.env.PRIVATE_KEY, { expiresIn: '5m' })
            await redis.set(user.phone, random)
            await redis.expire(user.phone, 300)
            return Response.Success('Tassyklama kody ugradyldy!', { token, random })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async userLogoutService(userDto) {
        try {
            await Models.Users.update({ isActive: false },
                { where: { id: userDto.id, groupId: userDto.group } })
                .catch((err) => { console.log(err) })
            console.log(userDto.id)
            await Models.Customers.destroy({ where: { userId: userDto.id } })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

}

module.exports = new UserService()