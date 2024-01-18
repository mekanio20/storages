const Response = require('../helpers/response.service')
const customerService = require('../services/customer.service')

class CustomerController {
    // GET
    async allCustomer(req, res) {
        try {
            const q = req.query
            const data = await customerService.allCustomerService(q)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
}

module.exports = new CustomerController()