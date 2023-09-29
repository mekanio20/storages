const Response = require('./response.service')
const { Sellers, Users } = require('../config/models')

class SellerService {

    async sellerRegisterService(oby, filenames) {
        try {
            const seller = await Sellers.findAll({ attributes: ['id'], where: { name: oby.name } })
            const { logo, bg_img } = filenames
            if (seller.length > 0) {
                return Response.Forbidden('Satyjy registrasiýa bolan!', [])
            }
            if (oby.main_number === oby.second_number) {
                return Response.BadRequest('Telefon belgi nädogry!', [])
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
            return Response.Created('Satyjy hasaba alyndy!', _seller)
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

    async updateSellerProfileService(oby) {
        try {
            let newObj = {}
            for (const key in oby) {
                if (oby[key].length > 0) {
                    newObj[key] = oby[key]
                }
            }
            await Sellers.update({ newObj }, { where: { id: oby.id } })
                .then(() => { return Response.Success('Satyjy maglumatlary täzelendi!', []) })
                .catch((err) => {
                    console.log(err)
                })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new SellerService()