const Models = require('../config/models')

class VerificationService {
    
    async isFound(Model, slug) {
        try {
            return Model.findAll({ where: { slug: slug } })
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
            return customer ? customer.id : null
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
            return seller ? seller.id : null
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new VerificationService()