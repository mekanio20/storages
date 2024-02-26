const sellerService = require('../services/seller.service')
const Response = require('../helpers/response.service')

class SellerController {
    async sellerRegister(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const { logo } = req.files
            if (!logo) {
                let result = await Response.BadRequest('logo gerek!', [])
                return res.json(result)
            }
            const data = await sellerService.sellerRegisterService(body, req.files, userId)
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

    async allOrders(req, res) {
        try {
            const q = req.query
            const userId = req.user.id
            const data = await sellerService.allOrdersService(q, userId)
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

    async orderDetail(req, res) {
        try {
            const { id } = req.params
            const data = await sellerService.orderDetailService(id, req.user.id)
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

    async sellerFollowers(req, res) {
        try {
            const { id } = req.params
            const data = await sellerService.sellerFollowersService(id)
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

    async topSellers(req, res) {
        try {
            const q = req.query
            const data = await sellerService.topSellersSerive(q)
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

    async profileSeller(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id
            const data = await sellerService.profileSellerService(id, userId)
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

    async sellerProducts(req, res) {
        try {
            const q = req.query
            const data = await sellerService.sellerProductsService(q)
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
                msg: error,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async sellerStatistic(req, res) {
        try {
            const userId = req.user.id
            const data = await sellerService.sellerStatisticService(userId)
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
                msg: error,
                msg_key: error.name,
                detail: []
            })
        }
    }

    // PUT
    async updateSellerProfile(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const files = req.files
            const data = await sellerService.updateSellerProfileService(body, userId, files)
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
    async deleteSeller(req, res) {
        try {
            const userId = req.user.id
            const data = await sellerService.deleteSellerService(userId)
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