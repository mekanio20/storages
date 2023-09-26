const sellerService = require('../services/seller.service')

class SellerController {
    async sellerRegister(req, res) {
        try {
            const oby = req.body
            const { logo } = req.files
            if (!logo) {
                return {
                    status: 403,
                    type: 'error',
                    msg: "logo required",
                    msg_key: "empty fields",
                    detail: []
                }
            }
            const data = await sellerService.sellerRegisterService(oby, req.files)
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
                type: data.type,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
}

module.exports = new SellerController()