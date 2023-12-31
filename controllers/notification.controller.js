const notificationService = require('../services/notification.service')

class NotificationController {
    async addNotification(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const data = await notificationService.addNotificationService(body, userId)
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

module.exports = new NotificationController()