const Response = require('../services/response.service')
const Models = require('../config/models')

class CommentService {

    async isCustomer(userId) {
        try {
            const customer = await Models.Customers.findOne({
                attributes: ['id'],
                where: {
                    userId: Number(userId)
                }
            })
            return customer ? customer.id : null
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // POST
    async addCommentService(body, filenames, userId) {
        try {
            const customerId = await this.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Mushderi tapylmady!', []) }
            const order = await Models.Orders.findOne({
                attributes: ['id'],
                where: {
                    customerId: customerId,
                    productId: body.productId,
                    status: 'completed'
                }
            })
            if (!order) { return Response.Forbidden('Harydy sargyt etmediniz!', []) }
            const comments = await Models.Comments.create({
                customerId: customerId,
                productId: body.productId,
                comment: body.comment
            })
            if (filenames.review) {
                filenames.review.forEach(async (item) => {
                    await Models.ProductReviewImages.create({ img: item.filename })
                    .then(() => { console.log(true) })
                    .catch((err) => { console.log(err) })
                })
            }
            return Response.Created('Teswir goyuldy!', comments)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async allCommentService(productId) {
        try {
            const comments = await Models.Comments.findAndCountAll({
                where: {
                    productId: productId,
                    isActive: true
                },
                attributes: ['id', 'comment'],
                include: [
                    {
                        model: Models.Customers,
                        attributes: ['id', 'fullname']
                    },
                    {
                        model: Models.ProductReviewImages,
                        where: { isActive: true },
                        attributes: ['id', 'img']
                    }
                ],
                order: [['id', 'ASC']]
            })
            return Response.Success('Üstünlikli!', comments)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new CommentService()