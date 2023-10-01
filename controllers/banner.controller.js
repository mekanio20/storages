const Response = require('../services/response.service')
const bannerService = require('../services/banner.service')

class BannerController {

    async addBanner(req, res) {
        try {
            const oby = req.body
            const { tm_img } = req.files
            if (!tm_img) { return Response.BadRequest('banner gerek!', []) }
            const data = await bannerService.addBannerService(oby, req.files)
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