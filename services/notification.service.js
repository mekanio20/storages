const Response = require('../helpers/response.service')
const Models = require('../config/models')

class NotificationService {
    // POST
    async addNotificationService(body, userId) {
        try {
            const ntf = await Models.Notifications.create({
                receivers: body.receivers,
                title: body.title,
                desc: body.desc,
                status: 'on-wait',
                // send_date: body.send_date,
                userId: userId
            })
            return Response.Created('Bildiriş hasaba alyndy!', ntf)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    // GET
    async allNotificationService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            const ntf = await Models.Notifications.findAndCountAll({
                order: [[sort, order]],
                limit: Number(limit),
                offset: Number(offset)
            })
            if (ntf.count === 0) { return Response.NotFound('Bildiriş ýok!', []) }
            return Response.Success('Üstünlikli!', ntf)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    // UPDATE
    async updateNotificationService(body) {
        try {
            const obj = {}
            for (const item in body) {
                if (item && item !== 'id') {
                    obj[item] = body[item]
                }
            }
            await Models.Notifications.update(obj, { where: { id: Number(body.id) } })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    // DELETE
    async deleteNotificationService(id) {
        try {
            await Models.Notifications.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new NotificationService()