const Response = require('../services/response.service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const Axios = require('axios')
const redis = require('../ioredis')
const { Op } = require('sequelize')
const Models = require('../config/models')
const { Sequelize } = require('../config/database')

const generateJwt = (id, group) => {
    console.log('id: ', id, 'groupId: ', group);
    return jwt.sign({ id, group }, process.env.PRIVATE_KEY, { expiresIn: '30d' })
}
const fackeToken = (data) => {
    console.log('facke token data: ', JSON.stringify(data, 2, null))
    return jwt.sign({ data }, process.env.PRIVATE_KEY, { expiresIn: '5m' })
}

class UserService {

    async isSeller(userId) {
        try {
            const seller = await Models.Sellers.findOne({
                attributes: ['id'],
                where: {
                    userId: Number(userId)
                }
            })
            return seller ? seller.id : null
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async isCustomer(userId) {
        try {
            const customer = await Models.Customers.findOne({
                attributes: ['id'],
                where: {
                    userId: Number(userId)
                }
            })
            return customer ? customer.id : null
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async isExists(phone) {
        try {
            return Models.Users.findAll({
                where: {
                    [Op.or]: {
                        phone: phone
                    }
                },
                attributes: ['id', 'password', 'phone', 'groupId']
            })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async getGroupId(group) {
        try {
            let group_id = await Models.Groups.findOne({ where: { name: group }, attributes: ['id'] })
            if (!group_id) { group_id = await Models.Groups.create({ name: group }) }
            group_id = JSON.stringify(group_id)
            group_id = Number(JSON.parse(group_id).id)
            return group_id
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userLoginService(phone, password) {
        try {
            let user = await this.isExists(phone)
            if (user.length === 0) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            const hash = await bcrypt.compare(password, user[0].password)
            if (!hash) { return Response.Forbidden('Telefon nomeri ya-da parol nädogry!', []) }
            const token = generateJwt(user[0].id, user[0].groupId)
            let response = await Response.Success('Üstünlikli!', user[0])
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async forgotPasswordService(phone, orgPass, verifPass) {
        try {
            let user = await this.isExists(phone)
            if (orgPass !== verifPass) { return Response.BadRequest('Nädogry parol!', []) }
            if (user.length === 0) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            user[0].dataValues.orgPass = orgPass
            const response = await this.sendOtpService(user[0])
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userRegisterService(body, ip, device) {
        try {
            const user = await this.isExists(body.phone)
            if (user.length > 0) { return Response.BadRequest('Ulanyjy eýýäm hasaba alynan!', []) }
            const hash = await bcrypt.hash(body.password, 5)
            const groupId = await this.getGroupId('USERS')
            let _user = {
                phone: body.phone,
                password: hash,
                ip: ip,
                device: device,
                uuid: uuid.v4(),
                groupId: groupId
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
            const exist = await this.isExists(user.phone)
            if (exist.length > 0) { return Response.BadRequest('Ulanyjy eýýäm hasaba alynan!', []) }
            if (code !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            let _user = await Models.Users.create(user)
            let token = generateJwt(_user.id, _user.groupId)
            return Response.Created('Ulanyjy hasaba alyndy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async resetPasswordService(code, user) {
        try {
            const systemcode = await redis.get(user.data.phone)
            let exist = await this.isExists(user.data.phone)
            if (exist.length == 0) { return Response.BadRequest('Ulanyjy hasaba alynmady!', []) }
            if (code !== systemcode) { return Response.BadRequest('Tassyklama kody nädogry', []) }
            let hash = await bcrypt.hash(user.data.orgPass, 5)
            await Models.Users.update({ password: hash }, { where: { id: user.data.id } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            let token = generateJwt(user.data.id, user.data.groupId)
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

    async addOrderService(body) {
        try {
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
                status: 'inprocess',
                payment: body.payment,
                amount: body.amount,
                time: today,
                note: body.note,
                customerId: body.customerId,
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

    async addFollowerService(body) {
        try {
            const follower = await Models.Followers.create({ sellerId: body.sellerId, customerId: body.customerId })
            return Response.Created('Follow doredildi!', follower)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addAddressService(body, userId) {
        try {
            const customerId = await this.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Mushderi tapylmady!', []) }
            await Models.Addresses.update({ isDefault: false }, { where: { customerId: customerId } })
                .then(() => { console.log('Default false...') })
                .catch((err) => { console.log(err) })
            const address = Models.Addresses.create({ address: body.address, isDefault: true, customerId: customerId })
            return Response.Created('Address doredildi!', address)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addMessageService(body, userId, file) {
        try {
            const customerId = await this.isCustomer(userId) || await this.isCustomer(body.userId)
            const sellerId = await this.isSeller(body.userId) || await this.isSeller(userId)
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
            const customerId = await this.isCustomer(userId)
            const sellerId = await this.isSeller(userId)
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

    async topRatedService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const rated_products = await Models.ProductReviews.findAll({
                attributes: [ [Sequelize.fn('SUM', Sequelize.col('star')), 'totalStar'] ],
                include: {
                    model: Models.Products,
                    attributes: { exclude: ['updatedAt', 'isActive'] }
                },
                group: ['productId', 'product.id'],
                order: [['totalStar', 'desc']],
                limit: Number(limit),
                offset: Number(offset)
            })
            return Response.Success('Üstünlikli!', rated_products)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async topSellingService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sendOtpService(user) {
        try {
            console.log('Send Otp Service --> ', JSON.stringify(user.phone, 2, null));
            const bodyParameters = { phone: user.phone }
            const { data } = await Axios.post('http://localhost:3000/otp', bodyParameters)
            const random = data.pass
            const token = fackeToken(user)
            await redis.set(user.phone, random)
            await redis.expire(user.phone, 300)
            return Response.Success('Tassyklama kody ugradyldy!', { token })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allStorageListService() {
        try {
            const storages = await Models.Storages.findAll({
                where: { isActive: true },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                order: [['id', 'DESC']]
            })
            if (storages.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', storages)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allCategoryService() {
        try {
            const categories = await Models.Categories.findAll({
                where: { isActive: true },
                attributes: { exclude: ['createdAt', 'updatedAt', 'storageId'] },
                include: {
                    model: Models.Storages,
                    where: { isActive: true },
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                },
                order: [['id', 'DESC']]
            })
            if (categories.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', categories)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allBrandListService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const brands = await Models.Brands.findAll({
                where: { isActive: true },
                attributes: { exclude: ['desc', 'createdAt', 'updatedAt'] },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (brands.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
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
            const users = await Models.Users.findAll({
                where: { isActive: true },
                attributes: { exclude: ['password', 'uuid', 'groupId', 'createdAt', 'updatedAt'] },
                include: {
                    model: Models.Groups,
                    attributes: ['id', 'name']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (users.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
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

    async allSubcategoryListService() {
        try {
            const subcategories = await Models.Subcategories.findAll({
                where: { isActive: true },
                attributes: ['id', 'tm_name', 'ru_name', 'en_name'],
                order: [['id', 'DESC']]
            })
            if (subcategories.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', subcategories)
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
                    attributes: ['fullname']
                },
                order: [['id', 'DESC']]
            })
            if (likes.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', likes)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async productSearchService(search) {
        try {
            let page = search.page || 1
            let limit = search.limit || 10
            let offset = page * limit - limit
            if (search.name) {
                search = [
                    { tm_name: { [Op.iLike]: `%${search.name}%` } },
                    { ru_name: { [Op.iLike]: `%${search.name}%` } },
                    { en_name: { [Op.iLike]: `%${search.name}%` } },
                    { tm_desc: { [Op.iLike]: `%${search.name}%` } },
                    { ru_desc: { [Op.iLike]: `%${search.name}%` } },
                    { en_desc: { [Op.iLike]: `%${search.name}%` } }
                ]
            } else { search = [] }
            const product = await Models.Products.findAll({
                where: {
                    isActive: true,
                    [Op.or]: search
                },
                attributes: { exclude: ['gender', 'isActive', 'createdAt', 'updatedAt'] },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            return Response.Success('Gozleg netijesi...', product)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchOneBasketService(id) {
        try {
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
            return Response.Success('Sebedim', basket)
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