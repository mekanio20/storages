const Response = require('../services/response.service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { Op } = require('sequelize')
const { Users, Groups, Storages, Categories, Subcategories, Brands, Customers, Contacts, Products } = require('../config/models')

const generateJwt = (id, group) => {
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

    async userLoginService(phone, password) { // should be updated
        try {
            const user = await this.isExists(phone)
            if (user.length === 0) {
                return Response.Unauthorized('Ulanyjy tapylmady!', [])
            }
            const hash = await bcrypt.compare(password, user[0].password)
            if (hash) {
                const token = generateJwt(user.id, user.groupId)
                let response = Response.Success('Üstünlikli!', user)
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

    async userRegisterService(oby, ip) { // should be updated
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
                device: oby.device,
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

    async customerRegisterService(oby, userId) {
        try {
            const { fullname, gender, email } = oby
            const customer = await Customers.findOne({ where: { email: email } })
            if (customer.length > 0) {
                return Response.Forbidden('Ulanyjy hasaba bolan!', [])
            }
            const _customer = await Customers.create({
                fullname: fullname,
                gender: gender,
                email: email,
                userId: userId
            })
            await Users.update({ isCustomer: true }, { where: { id: userId } })
            return Response.Created('Ulanyjy hasaba alyndy!', _customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userProfileService(id) {
        try {
            const user = await Customers.findOne({
                where: { userId: id },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Users,
                    attributes: ['id', 'phone']
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
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    where: { isActive: true },
                    include: {
                        model: Subcategories,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
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
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { isActive: true },
                include: {
                    model: Subcategories,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
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
            })
            return Response.Created('Maglumat ugradyldy!', contact)
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

}

module.exports = new UserService()