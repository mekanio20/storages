const Models = require('../config/models')
const baseService = require('../services/base.service')

class NotificationController {
    // POST
    async addNotification(req, res) {
        try {
            const body = req.body
            body.userId = req.user.id
            body.status = 'on-wait'
            const data = await new baseService(Models.Notifications).addService(body, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    // GET
    async allNotification(req, res) {
        try {
            const data = await new baseService(Models.Notifications).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    // UPDATE
    async updateNotification(req, res) {
        try {
            const data = await new baseService(Models.Notifications).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    // DELETE
    async deleteNotification(req, res) {
        try {
            const data = await new baseService(Models.Notifications).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
}

module.exports = new NotificationController()