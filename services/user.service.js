const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const { Users, Groups, Storages, Categories, Subcategories, Brands } = require('../config/models')
const jwt = require('jsonwebtoken')

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
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userLoginService(password, phone) {
        try {
            const user = await this.isExists(phone)
            if (user.length === 0) {
                return {
                    status: 401,
                    msg: 'user nod found',
                    msg_key: 'unauthorized',
                    detail: []
                }
            }
            const hash = await bcrypt.compare(password, user[0].password)
            if (hash) {
                const token = generateJwt(user[0].id, user.groupId)
                return {
                    status: 200,
                    msg: 'token matched',
                    msg_key: 'password is correct',
                    detail: user,
                    token: token
                }
            }
            return {
                status: 401,
                msg: 'token did not match',
                msg_key: 'password is incorrect',
                detail: []
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userRegisterService(oby) {
        try {
            const user = await this.isExists(oby.phone)
            if (user.length > 0) {
                return {
                    status: 403,
                    msg: 'user found',
                    msg_key: 'already exist',
                    detail: []
                }
            }
            const hash = await bcrypt.hash(oby.password, 5)
            let group_id = await Groups.findOne({ where: { name: 'USERS' }, attributes: ['id'] })
            group_id = JSON.stringify(group_id)
            group_id = Number(JSON.parse(group_id).id)
            const _user = await
                Users.create({
                    phone: oby.phone,
                    password: hash,
                    groupId: group_id
                })
            const token = generateJwt(_user.id, group_id)
            return {
                status: 201,
                msg: 'user registered',
                msg_key: 'created',
                detail: _user,
                token: token
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userProfileService(id) {
        try {
            const user = await
                Users.findOne({
                    where: { id: id },
                    attributes: [
                        'id',
                        'phone'
                    ]
                })
            if (!user) {
                return {
                    status: 403,
                    msg: 'user nod found',
                    msg_key: 'unauthorized',
                    detail: []
                }
            }
            return {
                status: 200,
                msg: 'user found',
                msg_key: 'authorized',
                detail: user
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sendOtpService(phone) {
        try {
            const _phone = phone
            const _otp = generateOTP()
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
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
                }
            })
            if (storages.length > 0) {
                return {
                    status: 200,
                    msg: 'storages were sent',
                    msg_key: 'success',
                    detail: storages
                }
            }
            return {
                status: 404,
                msg: 'storages nod found',
                msg_key: 'unsuccess',
                detail: storages
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
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
                }
            })
            if (categories.length > 0) {
                return {
                    status: 200,
                    msg: 'categories were sent',
                    msg_key: 'success',
                    detail: categories
                }
            }
            return {
                status: 404,
                msg: 'categories nod found',
                msg_key: 'unsuccess',
                detail: categories
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allBrandListService() {
        try {
            const brands = await Brands.findAll({
                attributes: { exclude: ['desc', 'createdAt', 'updatedAt'] },
                where: { isActive: true }
            })
            if (brands.length > 0) {
                return {
                    status: 200,
                    msg: 'brands were sent',
                    msg_key: 'success',
                    detail: brands
                }
            }
            return {
                status: 404,
                msg: 'brands nod found',
                msg_key: 'unsuccess',
                detail: brands
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new UserService()