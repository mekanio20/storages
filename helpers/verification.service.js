const Models = require('../config/models')
const Response = require('./response.service')

class VerificationService {
    async isFile(file) {
        try {
            if (!file) return false
            return file
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async isExists(phone, status) {
        try {
            let whereState = { phone: phone }
            if (status) { whereState = { phone: phone, isActive: true } }
            return Models.Users.findOne({
                attributes: ['id', 'password', 'phone', 'groupId'],
                where: whereState,
            })
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
            if (!customer) { return Response.Unauthorized('Müşderi tapylmady!', []) }
            return customer.id
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async isSeller(userId) {
        try {
            const seller = await Models.Sellers.findOne({
                attributes: ['id'],
                where: {
                    userId: Number(userId),
                    isVerified: true
                }
            })
            if (!seller) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            return seller.id
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new VerificationService()