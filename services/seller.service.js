const { Op } = require('sequelize')
const { Sellers } = require('../config/models')

class SellerService {

    async sellerRegisterService(oby, filenames) {
        try {
            const seller = await Sellers.findAll({ attributes: ['id'], where: { name: oby.name } })
            const { logo, bg_img } = filenames
            if (seller.length > 0) {
                return {
                    status: 403,
                    msg: 'user found',
                    msg_key: 'already exist',
                    detail: []
                }
            }
            if (oby.main_number === oby.second_number) {
                return {
                    status: 400,
                    msg: 'phone numbers equal',
                    msg_key: 'bad request',
                    detail: []
                }
            }
           const _seller = await
                Sellers.create({
                    name: oby.name,
                    store_number: oby.store_number,
                    store_floor: oby.store_floor,
                    about: oby.about,
                    logo: logo[0].filename,
                    bg_img: bg_img[0].filename || 'bg.jpg',
                    color: oby.color,
                    seller_type: oby.seller_type,
                    sell_type: oby.sell_type,
                    instagram: oby.instagram,
                    tiktok: oby.tiktok,
                    main_number: oby.main_number,
                    second_number: oby.second_number,
                    userId: oby.userId,
                    categoryId: oby.categoryId,
                    subscriptionId: oby.subscriptionId,
                    userId: oby.userId,
                    categoryId: oby.categoryId,
                    subscriptionId: oby.subscriptionId
                })
            return {
                status: 201,
                msg: 'seller registered',
                msg_key: 'created',
                detail: _seller
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new SellerService()