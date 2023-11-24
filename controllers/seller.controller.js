const sellerService = require('../services/seller.service')
const Response = require('../services/response.service')

const userPermission = (reqId, userId) => {
    if (String(reqId) !== String(userId))
        return false
    return true
}

class SellerController {
    async sellerRegister(req, res) {
        try {
            const body = req.body
            const { logo } = req.files
            if (!logo) {
                let result = await Response.BadRequest('logo gerek!', [])
                return res.json(result)
            }
            const data = await sellerService.sellerRegisterService(body, req.files)
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

    async addOffer(req, res) {
        try {
            const body = req.body
            const data = await sellerService.addOfferService(body)
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

    async addCoupon(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const { img } = req.files
            if (!img) {
                let result = await Response.BadRequest('surat gerek!', [])
                return res.json(result)
            }
            const data = await sellerService.addCouponService(body, img, userId)
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
    async fetchOneSeller(req, res) {
        try {
            const { id } = req.params
            const user = userPermission(req.user.id, id)
            if (!user) { 
                let result = await Response.Forbidden('Rugsat edilmedi!', [])
                return res.json(result)
            }
            const data = await sellerService.fetchOneSellerService(id)
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

    async allSeller(req, res) {
        try {
            const q = req.query
            const data = await sellerService.allSellerService(q)
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

    async fetchFollowers(req, res) {
        try {
            const { id } = req.params
            const data = await sellerService.fetchFollowersService(id)
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

    // PUT
    async updateSellerProfile(req, res) {
        try {
            const body = req.body
            const user = userPermission(req.user.id, body.id)
            if (!user) { 
                let result = await Response.Forbidden('Rugsat edilmedi!', [])
                return res.json(result)
            }
            const data = await sellerService.updateSellerProfileService(body)
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

    // DELETE
    async deleteProduct(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id
            const user = userPermission(userId, id)
            if (!user) { 
                let result = await Response.Forbidden('Rugsat edilmedi!', [])
                return res.json(result)
            }
            const data = await sellerService.deleteProductService(id, userId)
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

    async deleteSeller(req, res) {
        try {
            const { id } = req.params
            const user = userPermission(req.user.id, id)
            if (!user) { 
                let result = await Response.Forbidden('Rugsat edilmedi!', [])
                return res.json(result)
            }
            const data = await sellerService.deleteSellerService(id, req.user.id)
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

module.exports = new SellerController()