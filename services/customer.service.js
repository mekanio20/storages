const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')

class CustomerService {
    // POST
    async customerRegisterService(body, userId, img) {
        try {
            const { fullname, gender, email } = body
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
                    img: img.filename,
                    userId: userId
                }
            }).catch(((err) => { console.log(err) }))
            if (created == false) { return Response.Forbidden('Müşteri hasaba alnan!', []) }
            await Models.Users.update({ isCustomer: true, isSeller: false, isStaff: false }, { where: { id: userId } })
            return Response.Created('Müşteri hasaba alyndy!', customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

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