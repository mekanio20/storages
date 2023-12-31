const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class CommentService {

    // POST
    async addCommentService(body, filenames, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
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
            if (filenames?.review) {
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
    async allCommentService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const comments = await Models.Comments.findAndCountAll({
                where: {
                    productId: q.productId,
                    isActive: true
                },
                attributes: ['id', 'comment', 'createdAt'],
                include: [
                    {
                        model: Models.Customers,
                        attributes: ['id', 'fullname', 'img']
                    },
                    {
                        model: Models.ProductReviewImages,
                        where: { isActive: true }, required: false,
                        attributes: ['id', 'img']
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'ASC']]
            })
            const result = { count: 0, rows: [] }
            result.count = comments.count
            await Promise.all(comments.rows.map(async (item) => {
                const star = await Models.ProductReviews.findOne({ where: { productId: q.productId }})
                result.rows.push({
                    ...item.dataValues,
                    star: star.star
                })
            }))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new CommentService()