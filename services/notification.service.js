const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class NotificationService {
    async updateNotificationService(userId, body) {
        try {
            const seller = await Verification.isSeller(userId)
            if (isNaN(seller)) { console.log(seller) }
            if (body.status === "sent") {
                const notf = await Models.Notifications.findOne({ where: { id: body.id } })
                if (!notf) { return Response.BadRequest('Bildiriş tapylmady!', []) }
                if (notf.receivers === "my-customers") {

                }
            }
            return Response.Success("", [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new NotificationService()