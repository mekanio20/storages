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
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async userRegisterService(body, ip, device) {
        try {
            if (await Verification.isExists(body.phone)) {
                return Response.BadRequest('Ulanyjy eýýäm hasaba alynan!', [])
            }
    
            const hash = await bcrypt.hash(body.password, 5)
            const groupId = (await Models.Groups.findOne({ where: { name: 'USERS' }, attributes: ['id'] })).id
            const newUser = {
                phone: body.phone,
                password: hash,
                ip,
                device,
                uuid: uuid.v4(),
                groupId
            }
    
            return await this.sendOtpService(newUser)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] };
        }
    }    

    async checkControlService(code, userDto) {
        try {
            const systemCode = await redis.get(userDto.user.phone)
            if (String(code) !== systemCode) return Response.BadRequest('Tassyklama kody nädogry', [])
    
            const newUser = await Models.Users.create(userDto.user)
            const token = await Functions.generateJwt(newUser.id, newUser.groupId)
    
            return Response.Created('Ulanyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async forgotPasswordService(phone, orgPass, verifPass) {
        try {
            const user = await Verification.isExists(phone)
            if (!user) return Response.NotFound('Ulanyjy tapylmady!', [])
            if (orgPass !== verifPass) return Response.BadRequest('Nädogry parol!', [])
    
            user.dataValues.orgPass = orgPass
            return await this.sendOtpService(user)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async resetPasswordService(code, userDto) {
        try {
            const systemCode = await redis.get(userDto.user.phone)
            if (String(code) !== systemCode) return Response.BadRequest('Tassyklama kody nädogry', [])
    
            const hash = await bcrypt.hash(userDto.user.orgPass, 5)
            await Models.Users.update({ password: hash, isActive: true }, { where: { id: userDto.user.id } })
    
            const token = await Functions.generateJwt(userDto.user.id, userDto.user.groupId)
            return Response.Created('Ulanyjy paroly tazelendi!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async resetSubscriptionService(code, userDto) {
        try {
            const systemCode = await redis.get(userDto.user.phone)
            if (String(code) !== systemCode) return Response.BadRequest('Tassyklama kody nädogry', [])
    
            const sellerId = await Verification.isSeller(userDto.user.id)
            if (!sellerId) return Response.Unauthorized('Satyjy tapylmady!', [])
    
            await Models.Sellers.update({ isVerified: false }, { where: { id: sellerId } })
    
            const token = await Functions.generateJwt(userDto.user.id, userDto.user.groupId)
            return Response.Success('Satyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async addBasketService(body, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) return customer
    
            const product = await Models.Products.findOne({ where: { id: body.productId, isActive: true } })
            if (!product) return Response.BadRequest('Haryt tapylmady!', [])
            if (body.quantity > product.quantity) return Response.BadRequest('Haryt sany az mukdarda!', [])
    
            const [basket, created] = await Models.Baskets.findOrCreate({
                where: { productId: body.productId, customerId: customer, isActive: true },
                defaults: { quantity: body.quantity, productId: body.productId, customerId: customer }
            })
            if (!created) { await basket.update({ quantity: Number(body.quantity) + Number(basket.quantity) }) }

            const quantity = await Models.Baskets.count({ where: { customerId: customer, isActive: true } })
            return Response.Created('Harydyňyz sebede goşuldy!', { quantity })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async addOrderService(body, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) return customer
    
            const basket = await Models.Baskets.findAll({
                where: { customerId: customer, isActive: true },
                include: { model: Models.Products, attributes: ['final_price'] }
            })
            if (basket.length === 0) return Response.BadRequest('Haryt tapylmady!', [])
    
            const today = new Date()
            const orderId = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}${[...Array(4)].map(() => (Math.random() * 36).toString(36)[0]).join('')}${[...Array(4)].map(() => Math.floor(Math.random() * 10)).join('')}`
    
            const order = await Models.Orders.create({
                ...body,
                customerId: customer,
                order_id: orderId,
                status: 'pending',
                time: `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()} ${today.getHours()}:${today.getMinutes()}`
            })
            if (!order) return Response.BadRequest('Ýalňyşlyk ýüze çykdy!', [])
    
            await Promise.all(basket.map(async (item) => {
                const totalPrice = item.quantity * item.product.final_price
                await Models.OrderItems.create({
                    orderId: order.id,
                    quantity: item.quantity,
                    total_price: totalPrice,
                    productId: item.productId
                })
                await item.update({ isActive: false })
            }))
    
            return Response.Success('Sargydyňyz kabul edildi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async addMessageService(body, userId, file) {
        try {
            const customerId = await Verification.isCustomer(userId) || await Verification.isCustomer(body.userId)
            const sellerId = await Verification.isSeller(body.userId) || await Verification.isSeller(userId)
            if (isNaN(customerId) || isNaN(sellerId)) return customerId
    
            const [chat] = await Models.Chats.findOrCreate({
                where: { customerId, sellerId },
                defaults: { customerId, sellerId }
            })
    
            const message = await Models.Messages.create({
                content: body.content,
                attachment: file,
                time: new Date(),
                chatId: chat.id,
                sender: userId,
                accepted: body.userId
            })
    
            return Response.Created('Message ugradyldy!', message)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
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
                    id,
                    isActive: true,
                    [Op.or]: [{ customerId }, { sellerId }]
                }
            })
            if (!chat) return Response.Forbidden('Rugsat edilmedi!', [])
    
            const messages = await Models.Messages.findAll({
                attributes: ['id', 'content', 'attachment', 'sender', 'accepted', 'createdAt'],
                where: { isActive: true, chatId: id },
                order: [['id', 'asc']]
            })
    
            return Response.Success('Üstünlikli!', messages)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async sendOtpService(user) {
        try {
            console.log('Send Otp Service --> ', JSON.stringify(user.phone, 2, null))

            const { data } = await Axios.post('http://localhost:3001/otp', { phone: user.phone })
            const token = jwt.sign({ user }, process.env.PRIVATE_KEY, { expiresIn: '5m' })

            await redis.set(user.phone, data.pass)
            await redis.expire(user.phone, 300)

            return Response.Success('Tassyklama kody ugradyldy!', { token, random: data.pass })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }

    async allUsersService(q) {
        try {
            const { page = 1, limit = 10, status = true } = q
            const where = { ...(status !== 'all' && { isActive: status }) }
    
            const users = await Models.Users.findAndCountAll({
                where,
                attributes: { exclude: ['password', 'uuid', 'groupId', 'createdAt', 'updatedAt', 'deletedAt'] },
                include: { model: Models.Groups, attributes: ['id', 'name'] },
                limit,
                offset: (page - 1) * limit,
                order: [['id', 'DESC']]
            })
    
            return users.count 
                ? Response.Success('Üstünlikli!', users) 
                : Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    

    async userLogoutService(userDto) {
        try {
            await Models.Users.update({ isActive: false },
                { where: { id: userDto.id, groupId: userDto.group } })
                .then(() => console.log(true))

            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new UserService()