const bcrypt = require('bcrypt')
const { Op } = require('sequelize')
const { Users, Groups, UserRoles, Roles } = require('../config/models')
const jwt = require('jsonwebtoken')

const generateJwt = (id, group) => {
    return jwt.sign({ id, group }, process.env.PRIVATE_KEY, { expiresIn: '30d' })
}
const generateOTP = () => {
    return Math.floor(Math.random() * 10000)
}

class UserService {

    async isExists(username, phone) {
        try {
            return Users.findAll({
                where: {
                    [Op.or]: {
                        username: username,
                        phone: phone
                    }
                },
                attributes: ['id', 'username', 'password', 'phone', 'groupId']
            })
        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }

    async userLoginService(username, password, phone) {
        try {
            const user = await this.isExists(username, phone)

            if (user.length === 0) {
                return { 
                    success: false, 
                    code: 401, 
                    message: 'unauthorized', 
                    data: [] 
                }
            }

            const hash = await bcrypt.compare(password, user[0].password)
            if (hash) {
                const token = generateJwt(user[0].id, user.groupId)
                return {
                    success: true,
                    code: 200,
                    message: '',
                    data: user,
                    token: token
                }
            }

            return {
                success: false,
                code: 401,
                message: 'unauthorized',
                data: []
            }

        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }

    async userRegisterService(oby) {
        try {
            const user = await this.isExists(oby.username, oby.phone)

            if (user.length > 0) {
                return {
                    success: false,
                    code: 403,
                    message: 'already exist',
                    data: []
                }
            }

            const hash = await bcrypt.hash(oby.password, 5)
            let group_id = await
                Groups.findOne({
                    where: { name: 'USERS' },
                    attributes: ['id']
                })
                group_id = JSON.stringify(group_id)
                group_id = Number(JSON.parse(group_id).id)

            let role_id = await
                Roles.findOne({
                    where: { role: 'user' },
                    attributes: ['id']
                })
                role_id = JSON.stringify(role_id)
                role_id = Number(JSON.parse(role_id).id)

            const _user = await
                Users.create({
                    fullname: oby.fullname,
                    username: oby.username,
                    phone: oby.phone,
                    password: hash,
                    groupId: group_id,
                    address: oby?.address || null,
                })

            await UserRoles.create({
                userId: _user.id,
                roleId: role_id
            })

            const token = generateJwt(_user.id, group_id)

            return {
                success: true,
                code: 201,
                message: '',
                data: _user,
                token: token
            }

        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }

    async userProfileService(id) {
        try {
            const user = await
                Users.findOne({
                    where: { id: id },
                    attributes: [
                        'id', 
                        'fullname', 
                        'username', 
                        'phone', 
                        'address'
                    ]
                })

            if (!user) {
                return {
                    success: false,
                    code: 401,
                    message: 'unauthorized',
                    data: []
                }
            }

            return {
                success: true,
                code: 200,
                message: '',
                data: user
            }

        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }


    async sendOtpService(phone) {
        try {
            const _phone = phone
            const _otp = generateOTP()
        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }
}

module.exports = new UserService()