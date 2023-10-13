const Response = require('../services/response.service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { Op } = require('sequelize')
const { Users, Groups, Storages, Categories, Subcategories, Brands, Customers, Contacts, Products, ProductReviews, Likes, Comments, Orders, Baskets, ProductImages } = require('../config/models')

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
            if (user.length === 0) {
                return Response.Unauthorized('Ulanyjy tapylmady!', [])
            }
            const hash = await bcrypt.compare(password, user[0].password)
            if (hash) {
                const token = generateJwt(user[0].id, user[0].groupId)
                let response = await Response.Success('Üstünlikli!', user)
                response.token = token
                return response
            }
            return Response.Unauthorized('Parol nädogry!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async forgotPasswordService(phone, orgPass, verifPass) { // should be updated
        try {
            if (orgPass !== verifPass) {
                return Response.BadRequest('Parol nädogry!', [])
            }
            const user = await this.isExists(phone)
            if (user.length === 0) {
                return Response.Unauthorized('Ulanyjy tapylmady!', [])
            }
            return {}
            // send otp
            // -------------
            // -------------
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userRegisterService(oby, ip, device) { // should be updated
        try {
            const user = await this.isExists(oby.phone)
            if (user.length > 0) {
                return Response.Forbidden('Ulanyjy hasaba alynan!', [])
            }
            const hash = await bcrypt.hash(oby.password, 5)
            const groupId = await this.getGroupId('USERS')
            const _user = await Users.create({
                phone: oby.phone,
                password: hash,
                ip: ip,
                device: device,
                uuid: uuid.v4(),
                groupId: groupId
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            const token = generateJwt(_user.id, groupId)
            let response = await Response.Created('Ulanyjy hasaba alyndy!', _user)
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async customerRegisterService(oby) {
        try {
            const { fullname, gender, email, userId } = oby
            const [customer, created] = await Customers.findOrCreate({ 
                where: { email: email },
                defaults: {
                    fullname: fullname,
                    gender: gender,
                    email: email,
                    userId: userId
                } 
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            if (created == false) {
                return Response.Forbidden('Müşteri hasaba alnan!', [])
            }
            await Users.update({ isCustomer: true }, { where: { id: userId } })
            return Response.Created('Müşteri hasaba alyndy!', customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

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
            if (storages.length > 0) {
                return Response.Success('Üstünlikli!', storages)
            }
            return Response.NotFound('Maglumat tapylmady!', [])
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
            if (categories.length > 0) {
                return Response.Success('Üstünlikli!', categories)
            }
            return Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allBrandListService() {
        try {
            const brands = await Brands.findAll({
                attributes: { exclude: ['desc', 'createdAt', 'updatedAt'] },
                where: { isActive: true },
                order: [['id', 'DESC']]
            })
            if (brands.length > 0) {
                return Response.Success('Üstünlikli!', brands)
            }
            return Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addContactService(oby) {
        try {
            const contact = await Contacts.create({
                phone: oby.phone,
                email: oby.email,
                fullname: oby.fullname,
                message: oby.message,
                userId: oby.userId || null
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            return Response.Created('Maglumat ugradyldy!', contact)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addProductReviewService(oby) {
        try {
            const order = await Orders.findOne({
                attributes: ['id'],
                where: {
                    customerId: oby.customerId,
                    productId: oby.productId,
                    status: 'completed'
                }
            })
            if (order.id) {
                const review = await ProductReviews.create({
                    star: oby.star,
                    productId: oby.productId,
                    customerId: oby.customerId
                }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
                return Response.Created('Maglumat ugradyldy!', review)
            }
            return Response.Forbidden('Harydy sargyt etmediniz!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addLikeService(oby) {
        try {
            const likes = await Likes.create({
                userId: oby.userId,
                productId: oby.productId
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            return Response.Created('Like goyuldy!', likes)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addCommentService(oby) {
        try {
            const order = await Orders.findOne({
                attributes: ['id'],
                where: {
                    customerId: oby.customerId,
                    productId: oby.productId,
                    status: 'completed'
                }
            })
            if (order.id) {
                const comments = await Comments.create({
                    customerId: oby.customerId,
                    productId: oby.productId,
                    comment: oby.comment
                }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
                return Response.Created('Teswir goyuldy!', comments)
            }
            return Response.Forbidden('Harydy sargyt etmediniz!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addOrderService(oby) {
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
                fullname: oby.fullname,
                phone: oby.phone,
                address: oby.address,
                order_id: order_id,
                status: 'inprocess',
                payment: oby.payment,
                amount: oby.amount,
                time: today,
                note: oby.note,
                customerId: oby.customerId,
                productId: oby.productId
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            return Response.Created('Hasaba alyndy!', order)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBasketService(oby) {
        try {
            const basket = await Baskets.create({
                quantity: oby.quantity,
                productId: oby.productId,
                customerId: oby.customerId
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            return Response.Created('Harydynyz sebede goshuldy!', basket)
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