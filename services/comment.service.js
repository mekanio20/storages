const Response = require('../services/response.service')
const { Orders, Comments, Customers, ProductReviewImages } = require('../config/models')

class CommentService {
    // POST
    async addCommentService(body, filenames) {
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
            if (filenames.review) {
                filenames.review.forEach(async (item) => {
                    await ProductReviewImages.create({ img: item.filename })
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
            const comments = await Comments.findAndCountAll({
                where: {
                    productId: productId,
                    isActive: true
                },
                attributes: ['id', 'comment'],
                include: [
                    {
                        model: Customers,
                        attributes: ['id', 'fullname']
                    },
                    {
                        model: ProductReviewImages,
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