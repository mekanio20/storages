const sellerService = require('../services/seller.service')

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
            if (!logo) {
                return res.status(400).json({
                    status: 400,
                    type: 'error',
                    msg: 'logo required',
                    msg_key: 'bad request',
                    detail: []
                }) 
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
    
    async fetchSellerOne(req, res) {
        try {
            const { id } = req.params
            const user = userPermission(req.user.id, id)
            if (!user) {
                return res.status(403).json({
                    status: 403,
                    type: 'error',
                    msg: 'user blocked',
                    msg_key: 'forbidden',
                    detail: []
                })
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
                type: data.type,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
            
        }
    }
}

module.exports = new SellerController()