const sellerService = require('../services/seller.service')

class SellerController {
    async sellerRegister(req, res) {
        try {
            const oby = req.body
            // const [] = req.file
            const data = await sellerService.sellerRegisterService(oby)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
}

module.exports = new SellerController()