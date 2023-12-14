const Response = require('../helpers/response.service')
const Models = require('../config/models')

class NotificationService {
    async addNotificationService(body, userId) {
        try {
            const ntf = await Models.Notifications.create({
                receivers: body.receivers,
                title: body.title,
                desc: body.desc,
                status: body.status || 'on-wait',
                send_date: body.send_date,
                userId: userId
            })
            return Response.Created('Bildiriş hasaba alyndy!', ntf)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new NotificationService()