const sellerService = require('../services/seller.service')
const Response = require('../helpers/response.service')

class SellerController {
    // POST
    async sellerRegister(req, res) {
        try {
            const { logo } = req.files
            if (!logo) {
                let result = await Response.BadRequest('logo gerek!', [])
                return res.json(result)
            }
            const data = await sellerService.sellerRegisterService(req.body, req.files, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // GET
    async allSeller(req, res) {
        try {
            const data = await sellerService.allSellerService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allOrders(req, res) {
        try {
            const data = await sellerService.allOrdersService(req.query, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async orderDetail(req, res) {
        try {
            const data = await sellerService.orderDetailService(req.params.id, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async sellerFollowers(req, res) {
        try {
            const data = await sellerService.sellerFollowersService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async topSellers(req, res) {
        try {
            const data = await sellerService.topSellersSerive(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async profileSeller(req, res) {
        try {
            const data = await sellerService.profileSellerService(req.params.id, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async sellerProducts(req, res) {
        try {
            const data = await sellerService.sellerProductsService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async sellerStatistic(req, res) {
        try {
            const data = await sellerService.sellerStatisticService(req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async sellerVideos(req, res) {
        try {
            const data = await sellerService.sellerVideosService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // PUT
    async updateSellerProfile(req, res) {
        try {
            const data = await sellerService.updateSellerProfileService(req.body, req.user.id, req.files)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // DELETE
    async deleteSeller(req, res) {
        try {
            const data = await sellerService.deleteSellerService(req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })

        }
    }
}

module.exports = new SellerController()