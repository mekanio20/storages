const Response = require('../services/response.service')
const { Notifications } = require('../config/models')

class NotificationService {
    async addNotificationService(body) {
        try {
            const ntf = await Notifications.create({
                receivers: body.receivers,
                title: body.title,
                desc: body.desc,
                status: body.status || 'on-wait',
                send_date: body.send_date,
                userId: body.userId
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            return Response.Created('Bildiriş hasaba alyndy!', ntf)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new NotificationService()