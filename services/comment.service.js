const Response = require('../services/response.service')
const { Orders, Comments, Customers } = require('../config/models')

class CommentService {
    // POST
    async addCommentService(body) {
        try {
            const order = await Orders.findOne({
                attributes: ['id'],
                where: {
                    customerId: body.customerId,
                    productId: body.productId,
                    status: 'completed'
                }
            })
            if (!order) { return Response.Forbidden('Harydy sargyt etmediniz!', []) }
            const comments = await Comments.create({
                customerId: body.customerId,
                productId: body.productId,
                comment: body.comment
            })
            return Response.Created('Teswir goyuldy!', comments)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async allCommentService(productId) {
        try {
            const comments = await Comments.findAndCountAll({
                where: {
                    productId: productId,
                    isActive: true
                },
                attributes: ['id', 'comment'],
                include: {
                    model: Customers,
                    attributes: ['id', 'fullname']
                },
                order: [['id', 'ASC']]
            })
            return Response.Success('Üstünlikli!', comments)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new CommentService()