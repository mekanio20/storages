const customerService = require('../services/customer.service')

class CustomerController {
    // POST
    async customerRegister(req, res) {
        try {
            const data = await customerService.customerRegisterService(req.body, req.user.id, req.file)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // GET
    async allCustomer(req, res) {
        try {
            const data = await customerService.allCustomerService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async customerfavorite(req, res) {
        try {
            const data = await customerService.customerFavoriteService(req.user.id, req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async customerBasket(req, res) {
        try {
            const data = await customerService.customerBasketService(req.user.id, req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async customerFollowed(req, res) {
        try {
            const data = await customerService.customerFollowedService(req.user.id, req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async customerOrders(req, res) {
        try {
            const data = await customerService.customerOrdersService(req.user.id, req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async customerProfile(req, res) {
        try {
            const data = await customerService.customerProfileService(req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
}

module.exports = new CustomerController()