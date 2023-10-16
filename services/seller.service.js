const Response = require('./response.service')
const { Sellers, Users, Products, ProductImages, ProductsFeatures, ProductReviews, ProductReviewImages, Offers, Baskets, Comments, Likes, Orders, Chats, Coupons, Brands, Notifications, Banners } = require('../config/models')

class SellerService {

    async isExists(Model, slug) {
        try {
            return Model.findAll({ where: { slug: slug } })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sellerRegisterService(body, filenames) {
        try {
            const seller = await Sellers.findAll({ attributes: ['id'], where: { name: body.name } })
            if (seller.length > 0) {
                return Response.Forbidden('Satyjy registrasiýa bolan!', [])
            }
            if (body.main_number === body.second_number) {
                return Response.BadRequest('Telefon belgi nädogry!', [])
            }
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
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            return Response.Created('Satyjy hasaba alyndy!', _seller)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addProductService(body, filenames) {
        try {
            let slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _product = await this.isExists(Products, slug)
            if (_product.length > 0) { return Response.Forbidden('Maglumat döredilen!', []) }
            const product = await Products.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                tm_desc: body.tm_desc,
                ru_desc: body.ru_desc || null,
                en_desc: body.en_desc || null,
                slug: slug,
                barcode: body.barcode,
                stock_code: body.stock_code,
                quantity: body.quantity,
                org_price: body.org_price,
                sale_price: body.sale_price,
                gender: body.gender,
                subscriptionId: body.subscriptionId,
                brandId: body.brandId,
                sellerId: body.sellerId
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            if (filenames.img) {
                filenames.img.forEach(async (item, index) => {
                    await ProductImages.create({
                        img: item.filename,
                        order: index + 1,
                        productId: product.id
                    })
                        .then(() => { console.log('success') })
                        .catch((err) => { console.log(err) })
                })
            }
            return Response.Created('Haryt goýuldy!', product)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async fetchOneSellerService(id) {
        try {
            const seller = await Sellers.findOne({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Users,
                    attributes: ['id'],
                    where: {
                        id: id
                        // isSeller: true
                    }
                }
            })
            console.log(JSON.stringify(seller, null, 2));
            if (seller.isVerified === false) {
                return Response.Unauthorized('Satyjy tassyklanmady!', [])
            }
            if (seller.length > 0) {
                return Response.Success('Üstünlikli!', seller)
            }
            return Response.NotFound('Satyjy tapylmady!', [])
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
            await Sellers.update({ newObj }, { where: { id: body.id } })
                .then(() => { return Response.Success('Satyjy maglumatlary täzelendi!', []) })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteProductService(productId, userId) {
        try {
            const sellerId = await Sellers.findOne({
                attributes: ['id'],
                where: { userId: userId },
                include: {
                    model: Users,
                    attributes: ['isSeller'],
                    where: {
                        id: userId,
                        isSeller: true
                    }
                }
            })
            if (sellerId) {
                await Products.destroy({ where: { sellerId: sellerId.id, id: productId } })
                await ProductImages.destroy({ where: { productId: productId } })
                await ProductReviews.destroy({ where: { productId: productId } })
                await ProductReviewImages.destroy({ where: { productId: productId } })
                await ProductsFeatures.destroy({ where: { productId: productId } })
                await Offers.destroy({ where: { productId: productId } })
                await Baskets.destroy({ where: { productId: productId } })
                await Comments.destroy({ where: { productId: productId } })
                await Likes.destroy({ where: { productId: productId } })
                await Orders.destroy({ where: { productId: productId } })
                return Response.Success('Haryt pozuldy!', [])
            }
            return Response.Forbidden('Rugsat edilmedi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteSellerService(sellerId, userId) {
        try {
            const seller = await Sellers.findOne({
                attributes: ['id'],
                where: { userId: userId }
            }).then(() => { console.log(true) }).catch((err) => { console.log(err) })
            if (seller) {
                await Users.destroy({ where: { id: userId } })
                await Brands.destroy({ where: { userId: userId } })
                await Notifications.destroy({ where: { userId: userId } })
                await Banners.destroy({ where: { userId: userId } })
                await Sellers.destroy({ where: { id: sellerId } })
                await Chats.destroy({ where: { sellerId: sellerId }})
                await Products.destroy({ where: { sellerId: sellerId } })
                await Coupons.destroy({ where: { sellerId: sellerId } })
                return Response.Success('Satyjy pozuldy!', [])
            }
            return Response.Forbidden('Rugsat edilmedi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new SellerService()