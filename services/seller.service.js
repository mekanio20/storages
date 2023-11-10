const Response = require('./response.service')
const Models = require('../config/models')

class SellerService {

    async isSeller(userId) {
        try {
            const seller = await Models.Sellers.findOne({
                attributes: ['id'],
                where: {
                    userId: userId
                }
            })
            return seller.id
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sellerRegisterService(body, filenames) {
        try {
            const seller = await Models.Sellers.findAll({ attributes: ['id'], where: { name: body.name } })
            if (seller.length > 0) { return Response.Forbidden('Satyjy registrasiýa bolan!', []) }
            if (body.main_number === body.second_number) { return Response.BadRequest('Iki sany menzesh nomer bolup bilmez!', []) }
            console.log(body);
            const _seller = await Sellers.create({
                name: body.name,
                store_number: body.store_number,
                store_floor: body.store_floor,
                about: body.about,
                logo: filenames.logo[0].filename,
                bg_img: filenames.bg_img[0].filename || 'bg.jpg',
                color: body.color,
                seller_type: body.seller_type,
                sell_type: body.sell_type,
                instagram: body.instagram,
                tiktok: body.tiktok,
                main_number: body.main_number,
                second_number: body.second_number,
                userId: body.userId,
                categoryId: body.categoryId,
                subscriptionId: body.subscriptionId
            })
            return Response.Created('Satyjy hasaba alyndy!', _seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addOfferService(body) {
        try {
            const offer = await Models.Offers.create({
                promocode: body.promocode || null,
                discount: body.discount,
                productId: body.productId
            })
            return Response.Success('Arzanladysh goshuldy!', offer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addCouponService(body, img, userId) {
        try {
            const sellerId = await this.isSeller(userId)
            if (!sellerId) { return Response.Unauthorized('Satyjy tapylmady!', []) }
            const limit = await Models.Subscriptions.findOne({
                attributes: ['voucher_limit'],
                where: {
                    sellerId: body.sellerId
                }
            })
            const coupon_count = await Models.Coupons.count({ where: { sellerId: sellerId } })
            if (limit.voucher_limit <= coupon_count) {
                return Response.Forbidden('Limidiniz doldy!', [])
            }
            await Models.Coupons.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                tm_desc: body.tm_desc,
                ru_desc: body.ru_desc || null,
                en_desc: body.en_desc || null,
                img: img[0].filename,
                conditions: body.conditions,
                min_amount: body.min_amount,
                amount: body.amount,
                limit: body.limit,
                star_date: body.star_date,
                end_date: body.end_date,
                isPublic: body.isPublic,
                sellerId: sellerId
            }).then((res) => { return Response.Created('Kupon doredildi!', []) })
            .catch((err) => { return Response.BadRequest('Yalnyshlyk yuze cykdy!', []) })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async fetchOneSellerService(id) {
        try {
            const seller = await Models.Sellers.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Models.Users,
                    where: {
                        id: id,
                        isSeller: true
                    }
                }
            })
            console.log(JSON.stringify(seller, null, 2))
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            if (seller.isVerified === false) { return Response.Unauthorized('Satyjy tassyklanmady!', []) }
            return Response.Success('Üstünlikli!', seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchFollowersService(id) {
        try {
            const followers = await Models.Followers.findAll({
                where: { sellerId: Number(id) },
                include: {
                    model: Models.Customers,
                    attributes: ['id', 'fullnamme'],
                    order: [['id', 'DESC']]
                }
            })
            if (followers.length == 0) { return Response.NotFound('Follower yok!', []) }
            return Response.Success('Follwerler!', followers)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // PUT
    async updateSellerProfileService(body) {
        try {
            let newObj = {}
            for (const key in body) {
                if (body[key].length > 0) {
                    newObj[key] = body[key]
                }
            }
            await Models.Sellers.update({ newObj }, { where: { id: body.id } })
                .then(() => { return Response.Success('Satyjy maglumatlary täzelendi!', []) })
                .catch((err) => {
                    console.log(err)
                    return Response.BadRequest('Yalnyshlyk yuze cykdy!', [])
                })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteProductService(productId, userId) {
        try {
            const sellerId = await Models.Sellers.findOne({
                attributes: ['id'],
                where: { userId: userId },
                include: {
                    model: Models.Users,
                    attributes: ['isSeller'],
                    where: {
                        id: userId,
                        isSeller: true
                    }
                }
            })
            console.log(JSON.stringify(sellerId, null, 2))
            if (!sellerId) { return Response.NotFound('Haryt tapylmady!', []) }

            await Models.ProductImages.destroy({ where: { productId: productId } })
            await Models.ProductReviews.destroy({ where: { productId: productId } })
            await Models.ProductReviewImages.destroy({ where: { productId: productId } })
            await Models.ProductFeatures.destroy({ where: { productId: productId } })
            await Models.Offers.destroy({ where: { productId: productId } })
            await Models.Baskets.destroy({ where: { productId: productId } })
            await Models.Comments.destroy({ where: { productId: productId } })
            await Models.Likes.destroy({ where: { productId: productId } })
            await Models.Orders.destroy({ where: { productId: productId } })
            await Models.Products.destroy({ where: { sellerId: sellerId.id, id: productId } })
            return Response.Success('Haryt pozuldy!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteSellerService(sellerId, userId) {
        try {
            const seller = await Models.Sellers.findOne({ attributes: ['id'], where: { userId: userId } })
            console.log(JSON.stringify(seller, null, 2))
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }

            await Models.Users.destroy({ where: { id: userId } })
            await Models.Brands.destroy({ where: { userId: userId } })
            await Models.Notifications.destroy({ where: { userId: userId } })
            await Models.Banners.destroy({ where: { userId: userId } })
            await Models.Chats.destroy({ where: { sellerId: sellerId } })
            await Models.Products.destroy({ where: { sellerId: sellerId } })
            await Models.Coupons.destroy({ where: { sellerId: sellerId } })
            await Models.Sellers.destroy({ where: { id: sellerId } })
            return Response.Success('Satyjy pozuldy!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new SellerService()