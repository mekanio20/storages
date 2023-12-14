const Models = require('../config/models')

class VerificationService {
    
    async isFound(Model, slug) {
        try {
            return Model.findAll({ where: { slug: slug } })
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
                    userId: Number(userId)
                }
            })
            return seller ? seller.id : null
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new VerificationService()