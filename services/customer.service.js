const Response = require('../helpers/response.service')
const Models = require('../config/models')

class CustomerService {
    // GET
    async allCustomerService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            let whereState = {}
            if (q.gender) { whereState = { gender: q.gender } }
            const customers = await Models.Customers.findAndCountAll({
                attributes: { exclude: ['userId' ] },
                where: whereState,
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            })
            if (customers.count == 0) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', customers)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new CustomerService()