const { Op } = require('sequelize')
const { Sellers, Users } = require('../config/models')

class SellerService {

    async sellerRegisterService(oby, filenames) {
        try {
            const seller = await Sellers.findAll({ attributes: ['id'], where: { name: oby.name } })
            const { logo, bg_img } = filenames
            if (seller.length > 0) {
                return {
                    status: 403,
                    type: 'error',
                    msg: 'already exist',
                    msg_key: 'forbidden',
                    detail: []
                }
            }
            if (oby.main_number === oby.second_number) {
                return {
                    status: 400,
                    type: 'error',
                    msg: 'phone numbers equal',
                    msg_key: 'bad request',
                    detail: []
                }
            }
            const _seller = await Sellers.create({
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
                type: 'success',
                msg: 'seller registered',
                msg_key: 'created',
                detail: _seller
            }
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
                        id: id, 
                        isSeller: true 
                    }
                } 
            })
            if (seller.length > 0) {
                return {
                    status: 201,
                    type: 'success',
                    msg: 'seller found',
                    msg_key: 'ok',
                    detail: seller
                }
            }
            if (seller.isVerified === false) {
                return {
                    status: 403,
                    type: 'error',
                    msg: 'seller not verified',
                    msg_key: 'forbidden',
                    detail: []
                }
            }
            return {
                status: 404,
                type: 'error',
                msg: 'seller not found',
                msg_key: 'not found',
                detail: []
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    
    async updateSellerProfileService(oby) {
        try {
            let newDto = {}
            for (const key in oby) {
                if (oby[key].length > 0) {
                    newDto[key] = oby[key]
                }
            }
            await Sellers.update({ newDto }, { where: { id: oby.id }})
            return {
                status: 200,
                type: 'success',
                msg: '1',
                msg_key: '1',
                detail: newDto
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new SellerService()