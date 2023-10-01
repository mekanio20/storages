const Response = require('./response.service')
const { Sellers, Users, Products, ProductImages } = require('../config/models')

class SellerService {
    
    async isExists(Model, slug) {
        try {
            return Model.findAll({ where: { slug: slug } })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

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

    async addProductService(oby, filenames) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _product = await this.isExists(Products, slug)
            if (_product.length > 0) { return Response.Forbidden('Maglumat döredilen!', []) }
            const product = await Products.create({
                tm_name: oby.tm_name,
                ru_name: oby.ru_name || null,
                en_name: oby.en_name || null,
                tm_desc: oby.tm_desc,
                ru_desc: oby.ru_desc || null,
                en_desc: oby.en_desc || null,
                slug: slug,
                barcode: oby.barcode,
                stock_code: oby.stock_code,
                quantity: oby.quantity,
                org_price: oby.org_price,
                sale_price: oby.sale_price,
                gender: oby.gender
            })
            if (filenames.img) {
                filenames.img.forEach( async (item, index) => {
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