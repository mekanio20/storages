const Models = require('../config/models')
const Response = require('../helpers/response.service')
const bannerService = require('../services/banner.service')
const baseService = require('../services/base.service')

class BannerController {
    // POST
    async addBanner(req, res) {
        try {
            const { tm_img } = req.files
            if (!tm_img) {
                let result = await Response.BadRequest('Banner gerek!', [])
                return res.json(result)
            }
            const data = await bannerService.addBannerService(req.body, req.user, req.files)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // GET
    async allBanner(req, res) {
        try {
            const data = await new baseService(Models.Banners).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // DELETE
    async deleteBanner(req, res) {
        try {
            const data = await new baseService(Models.Banners).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }
}

module.exports = new BannerController()