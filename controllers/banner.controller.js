const Response = require('../helpers/response.service')
const bannerService = require('../services/banner.service')

class BannerController {
    async addBanner(req, res) {
        try {
            const body = req.body
            const user = req.user
            const { tm_img } = req.files
            if (!tm_img) {
                let result = await Response.BadRequest('Banner gerek!', [])
                return res.json(result)
            }
            const data = await bannerService.addBannerService(body, user, req.files)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

module.exports = new BannerController()