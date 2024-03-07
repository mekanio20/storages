const addressService = require('../services/address.service')

class AddressController {
    // POST
    async addAddress(req, res) {
        try {
            const data = await addressService.addAddressService(req.body, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // GET
    async allAddress(req, res) {
        try {
            const data = await addressService.allAddressService(req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // PUT
    async updateAddress(req, res) {
        try {
            const data = await addressService.updateAddressService(req.params.id, req.body, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // DELETE
    async deleteAddress(req, res) {
        try {
            const data = await addressService.deleteAddressService(req.params.id, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }
}

module.exports = new AddressController()