const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class CommentService {
    // POST
    async addCommentService(body, filenames, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) return customer
    
            const order = await Models.OrderItems.findOne({
                where: { productId: body.productId },
                include: {
                    model: Models.Orders,
                    attributes: ['id', 'customerId', 'status'],
                    where: { customerId: customer, status: 'completed' }
                }
            })
            if (!order) return Response.Forbidden('Harydy sargyt etmediniz!', [])
    
            const [comment, created] = await Models.Comments.findOrCreate({
                where: { customerId: customer, productId: body.productId },
                defaults: { customerId: customer, productId: body.productId, comment: body.comment }
            })
    
            if (!created) {
                comment.comment = body.comment
                await comment.save()
            }
    
            if (filenames?.review) {
                const imgsCount = await Models.ProductReviewImages.count({ where: { commentId: comment.id, customerId: customer } })
                if (imgsCount > 3) return Response.Created('Teswir goyuldy! Surat limidi doldy!', [])
    
                await Promise.all(filenames.review.map(item => 
                    Models.ProductReviewImages.create({
                        img: item.filename,
                        commentId: comment.id,
                        customerId: customer
                    }).then(console.log(true))
                ))
            }
    
            return Response.Created('Teswir goyuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // GET
    async allCommentService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'id',
                order = 'desc',
                productId,
                isActive,
                sellerId
            } = q
    
            const whereClause = {
                ...(productId && { productId }),
                ...(isActive && { isActive }),
            }
            const sellerClause = sellerId ? { sellerId } : {}
    
            const comments = await Models.Comments.findAndCountAll({
                where: whereClause,
                attributes: ['id', 'comment', 'createdAt'],
                include: [
                    { model: Models.Customers, attributes: ['id', 'fullname', 'img'] },
                    { model: Models.Products, where: sellerClause, attributes: ['id', 'tm_name'] },
                    { model: Models.ProductReviewImages, attributes: ['id', 'img'], where: { isActive: true }, required: false },
                ],
                limit,
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })
    
            const rowsWithStars = await Promise.all(comments.rows.map(async (comment) => {
                const { id: productId } = comment.product || {}
                const starData = await Models.ProductReviews.findOne({ where: { productId } })
                return {
                    ...comment.dataValues,
                    star: starData ? starData.star : 0,
                }
            }))
    
            return Response.Success('Üstünlikli!', { count: comments.count, rows: rowsWithStars })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    } 
    async sellerCommentService(userId, q) {
        try {
            const {
                page = 1,
                limit = 10,
                order = 'desc',
                sort = 'id',
                productId,
                isActive
            } = q
    
            const whereClause = {
                ...(productId && { productId }),
                ...(isActive && { isActive }),
            }
    
            const sellerId = await Verification.isSeller(userId)
            if (isNaN(sellerId)) return sellerId
    
            const comments = await Models.Comments.findAll({
                where: whereClause,
                attributes: ['id', 'comment'],
                include: [
                    { model: Models.Customers, attributes: ['id', 'fullname'] },
                    {
                        model: Models.Products,
                        attributes: ['id', 'tm_name'],
                        where: { sellerId },
                        required: true,
                        include: {
                            model: Models.ProductImages,
                            attributes: ['id', 'img'],
                            where: { isActive: true },
                            required: false,
                        }
                    }
                ],
                limit,
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })
    
            return Response.Success('Üstünlikli!', { count: comments.length, rows: comments })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    
    // DELETE
    async deleteCommentService(id, user) {
        try {
            if (user.group == 1) {
                await Models.Comments.destroy({ where: { id } })
                    .then(() => { console.log(true) })
                return Response.Success('Üstünlikli!', [])
            }

            const customer = await Verification.isCustomer(user.id)
            if (isNaN(customer)) { return customer }

            const comment = await Models.Comments.findOne({ where: { customerId: customer } })
            if (!comment) { return Response.Forbidden('Rugsat edilmedi!', []) }

            await Models.Comments.destroy({ where: { id } })
                .then(() => { console.log(true) })
                
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new CommentService()