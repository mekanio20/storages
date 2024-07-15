const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class CommentService {

    // POST
    async addCommentService(body, filenames, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const order = await Models.OrderItems.findOne({
                where: {
                    productId: body.productId
                },
                include: {
                    model: Models.Orders,
                    attributes: ['id', 'customerId', 'status'],
                    where: {
                        customerId: customer,
                        status: 'completed'
                    }
                }
            }).catch((err) => console.log(err))
            if (!order) { return Response.Forbidden('Harydy sargyt etmediniz!', []) }
            const [comment, created] = await Models.Comments.findOrCreate({
                where: {
                    customerId: customer,
                    productId: body.productId
                },
                defaults: {
                    customerId: customer,
                    productId: body.productId,
                    comment: body.comment
                }
            }).catch((err) => console.log(err))
            if (created == false) {
                comment.comment = body.comment
                await comment.save()
            }
            if (filenames?.review) {
                console.log(filenames.review);
                const imgs = await Models.ProductReviewImages.count({ where: { commentId: comment.id, customerId: customer } })
                if (imgs > 3) { return Response.Created('Teswir goyuldy! Surat limidi doldy!', []) }
                else {
                    filenames.review.forEach(async (item) => {
                        await Models.ProductReviewImages.create({
                            img: item.filename,
                            commentId: comment.id,
                            customerId: customer
                        }).then(() => { console.log(true) })
                        .catch((err) => { console.log(err) })
                    })
                }
            }
            return Response.Created('Teswir goyuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // GET
    async allCommentService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let sort = q.sort || 'id'
            let order = q.order || 'desc'
            let whereState = {}
            for (let item in q) {
                if (q.productId || q.isActive) {
                    whereState[item] = q[item]
                }
            }
            const comments = await Models.Comments.findAndCountAll({
                where: whereState,
                attributes: ['id', 'comment', 'createdAt'],
                include: [
                    {
                        model: Models.Customers,
                        attributes: ['id', 'fullname', 'img']
                    },
                    {
                        model: Models.Products,
                        attributes: ['id', 'tm_name'],
                        // where: { isActive: true }, required: false
                    },
                    {
                        model: Models.ProductReviewImages,
                        attributes: ['id', 'img'],
                        where: { isActive: true }, required: false,
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [[sort, order]]
            }).catch((err) => console.log(err))
            const result = { count: 0, rows: [] }
            result.count = comments.count
            await Promise.all(comments.rows.map(async (item) => {
                const star = await Models.ProductReviews.findOne({ where: { productId: item.product.id } })
                result.rows.push({
                    ...item.dataValues,
                    star: star.star
                })
            }))
            return Response.Success('Üstünlikli!', result)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // DELETE
    async deleteCommentService(id, user) {
        try {
            if (user.group == 1) {
                await Models.Comments.destroy({ where: { id: Number(id) } })
                    .then(() => { console.log(true) })
                return Response.Success('Üstünlikli!', [])
            }
            const customer = await Verification.isCustomer(user.id)
            if (isNaN(customer)) { return customer }
            const comment = await Models.Comments.findOne({ where: { customerId: customer } })
            if (!comment) { return Response.Forbidden('Rugsat edilmedi!', []) }
            await Models.Comments.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new CommentService()