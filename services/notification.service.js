const Response = require('../services/response.service')
const { Notifications } = require('../config/models')

class NotificationService {
    async addNotificationService(oby) {
        try {
            const ntf = await Notifications.create({
                receivers: oby.receivers,
                title: oby.title,
                desc: oby.desc,
                status: oby.status || 'on-wait',
                send_date: oby.send_date,
                userId: oby.userId
            })
            return Response.Created('Bildiriş hasaba alyndy!', ntf)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new NotificationService()