const sellerService = require('../services/seller.service')
const Response = require('../services/response.service')

const userPermission = (reqId, userId) => {
    if (reqId !== userId)
        return false
    return true
}

class SellerController {
    async sellerRegister(req, res) {
        try {
            const oby = req.body
            const { logo } = req.files
            if (!logo) { return Response.BadRequest('logo gerekli!', []) }
            const data = await sellerService.sellerRegisterService(oby)
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
    
    async fetchOneSeller(req, res) {
        try {
            const { id } = req.params
            const user = userPermission(req.user.id, id)
            if (!user) { return Response.Forbidden('Rugsat edilmedi!', []) }
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

    async updateSellerProfile(req, res) {
        try {
            const oby = req.body
            const user = userPermission(req.user.id, oby.id)
            if (!user) { return Response.Forbidden('Rugsat edilmedi!', []) }
            const data = await sellerService.updateSellerProfileService(oby)
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