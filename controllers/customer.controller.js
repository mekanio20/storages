const customerService = require('../services/customer.service')

class CustomerController {
    // POST
    async customerRegister(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const img = req.file
            const data = await customerService.customerRegisterService(body, userId, img)
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

    async customerfavorite(req, res) {
        try {
            const userId = req.user.id
            const data = await customerService.customerFavoriteService(userId)
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

    async customerBasket(req, res) {
        try {
            const id = req.user.id
            const data = await customerService.customerBasketService(id)
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

    async customerFollowed(req, res) {
        try {
            const id = req.user.id
            const data = await customerService.customerFollowedService(id)
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

    async customerOrders(req, res) {
        try {
            const id = req.user.id
            const data = await customerService.customerOrdersService(id)
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

    async customerProfile(req, res) {
        try {
            const userId = req.user.id
            const data = await customerService.customerProfileService(userId)
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