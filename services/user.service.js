const Response = require('../services/response.service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { Op } = require('sequelize')
const { Users, Groups, Storages, Categories, Subcategories, Brands, Customers, Contacts, Products, ProductReviews, Likes, Comments, Orders, Baskets, ProductImages, Followers } = require('../config/models')

const generateJwt = (id, group) => {
    console.log('id: ', id, 'groupId: ', group);
    return jwt.sign({ id, group }, process.env.PRIVATE_KEY, { expiresIn: '30d' })
}
const generateOTP = () => {
    return Math.floor(Math.random() * 10000)
}

class UserService {

    async isExists(phone) {
        try {
            return Users.findAll({
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
            let group_id = await Groups.findOne({ where: { name: group }, attributes: ['id'] })
            if (!group_id) { group_id = await Groups.create({ name: group }) }
            group_id = JSON.stringify(group_id)
            group_id = Number(JSON.parse(group_id).id)
            return group_id
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userLoginService(phone, password) {
        try {
            const user = await this.isExists(phone)
            if (user.length === 0) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            const hash = await bcrypt.compare(password, user[0].password)
            if (!hash) { return Response.Forbidden('Parol nädogry!', []) }
            const token = generateJwt(user[0].id, user[0].groupId)
            let response = await Response.Success('Üstünlikli!', user)
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async forgotPasswordService(phone, orgPass, verifPass) { // should be updated
        try {
            if (orgPass !== verifPass) { return Response.BadRequest('Parol nädogry!', []) }
            const user = await this.isExists(phone)
            if (user.length === 0) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            return {}
            // send otp
            // -------------
            // -------------
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userRegisterService(body, ip, device) {
        try {
            const user = await this.isExists(body.phone)
            if (user.length > 0) { return Response.BadRequest('Ulanyjy hasaba alynan!', []) }
            const hash = await bcrypt.hash(body.password, 5)
            const groupId = await this.getGroupId('USERS')
            const _user = await Users.create({
                phone: body.phone,
                password: hash,
                ip: ip,
                device: device,
                uuid: uuid.v4(),
                groupId: groupId
            })
            const token = generateJwt(_user.id, groupId)
            let response = await Response.Created('Ulanyjy hasaba alyndy!', _user)
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async customerRegisterService(body) {
        try {
            const { fullname, gender, email, userId } = body
            const [customer, created] = await Customers.findOrCreate({ 
                where: { email: email },
                defaults: {
                    fullname: fullname,
                    gender: gender,
                    email: email,
                    userId: userId
                } 
            })
            if (created == false) { return Response.Forbidden('Müşteri hasaba alnan!', []) }
            await Users.update({ isCustomer: true }, { where: { id: userId } })
            return Response.Created('Müşteri hasaba alyndy!', customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addContactService(body) {
        try {
            const contact = await Contacts.create({
                phone: body.phone,
                email: body.email,
                fullname: body.fullname,
                message: body.message,
                userId: body.userId || null
            })
            return Response.Created('Maglumat ugradyldy!', contact)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addLikeService(body) {
        try {
            const likes = await Likes.create({
                userId: body.userId,
                productId: body.productId
            })
            return Response.Created('Like goyuldy!', likes)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addOrderService(body) {
        try {
            let order_id = null
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
            const order = await Orders.create({
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
            })
            return Response.Created('Hasaba alyndy!', order)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBasketService(body) {
        try {
            const basket = await Baskets.create({
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
            const follower = await Followers.create({
                sellerId: body.sellerId,
                customerId: body.customerId
            })
            return Response.Created('Follow doredildi!', follower)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async userProfileService(id) {
        try {
            const user = await Users.findOne({
                where: { id: id },
                attributes: ['id', 'phone'],
                include: {
                    model: Customers,
                    attributes: ['id', 'fullname', 'email']
                }
            })
            if (!user) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', user)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sendOtpService(phone) { // should be updated
        try {
            const _phone = phone
            const _otp = generateOTP()
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allStorageListService() {
        try {
            const storages = await Storages.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { isActive: true },
                include: {
                    model: Categories,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'storageId'] },
                    where: { isActive: true },
                    include: {
                        model: Subcategories,
                        attributes: { exclude: ['createdAt', 'updatedAt', 'categoryId'] },
                        where: { isActive: true }
                    }
                },
                order: [['id', 'DESC']]
            })
            if (!storages) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', storages)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allCategoryService() {
        try {
            const categories = await Categories.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt', 'storageId'] },
                where: { isActive: true },
                include: {
                    model: Subcategories,
                    attributes: { exclude: ['createdAt', 'updatedAt', 'categoryId'] },
                    where: { isActive: true }
                },
                order: [['id', 'DESC']]
            })
            if (categories.length > 0) { return Response.Success('Üstünlikli!', categories) }
            return Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allBrandListService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const brands = await Brands.findAll({
                attributes: { exclude: ['desc', 'createdAt', 'updatedAt'] },
                where: { isActive: true },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (!brands) { return Response.NotFound('Maglumat tapylmady!', []) }
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
            const users = await Users.findAll({
                attributes: { exclude: ['password', 'uuid', 'groupId', 'createdAt', 'updatedAt'] },
                where: { isActive: true },
                include: {
                    model: Groups,
                    attributes: ['id', 'name']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            console.log(JSON.stringify(users, null, 2));
            if (!users) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', users)
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
            const product = await Products.findAll({
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
            const basket = await Baskets.findOne({
                where: {
                    isActive: true,
                    customerId: Number(id)
                },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Products,
                    where: { isActive: true },
                    attributes: [
                        'id', 'tm_name', 'ru_name', 'en_name', 
                        'tm_desc', 'ru_desc', 'en_desc', 
                        'quantity', 'sale_price'
                    ],
                    include: {
                        model: ProductImages,
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
            await Likes.destroy({ where: { userId: userId, productId: productId } })
                .then(() => { return Response.Success('Haryt pozuldy!', []) })
                .catch((err) => { console.log(err) })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new UserService()