const Response = require('../helpers/response.service')
const Models = require('../config/models')
const { Op } = require('sequelize')

class BannerService {
    // GET
    async allBannerService(q) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = 'id',
                order = 'asc',
                type,
                size,
                isMain
            } = q

            const whereState = {
                ...(type && { type }),
                ...(size && { size }),
                ...(isMain && { userId: { [Op.ne]: 3 } })
            }
    
            const banners = await Models.Banners.findAndCountAll({
                where: whereState,
                limit: Number(limit),
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })

            return banners.count
                ? Response.Success('Üstünlikli!', banners)
                : Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // POST
    async addBannerService(body, user, filenames) {
        try {
            const group = await Models.Groups.findOne({ attributes: ['name'], where: { id: user.group } })
            const start_date = body?.start_date || new Date()
            const end_date = body?.end_date || start_date.setFullYear(start_date.getFullYear() + 1)
    
            if (group.name === 'SELLERS') {
                body.type = 'profile'
                const seller = await Models.Sellers.findOne({
                    attributes: ['subscriptionId'],
                    where: { userId: user.id, isVerified: true }
                })
    
                const limit = await Models.Subscriptions.findOne({
                    attributes: ['seller_banner_limit'],
                    where: { id: seller.subscriptionId }
                })
    
                const bannerCount = await Models.Banners.count({ where: { userId: user.id } })
                if (limit && Number(limit.seller_banner_limit) <= Number(bannerCount)) {
                    return Response.Forbidden('Limidiniz doldy!', [])
                }
            }
    
            const banner = await Models.Banners.create({
                tm_img: filenames.tm_img[0].filename,
                ru_img: filenames.ru_img?.[0]?.filename || null,
                en_img: filenames.en_img?.[0]?.filename || null,
                url: body?.url || null,
                type: body.type,
                size: body.size,
                sort_order: body.sort_order,
                start_date,
                end_date,
                userId: user.id
            })
    
            return banner
                ? Response.Created('Banner döredildi!', [])
                : Response.BadRequest('Ýalňyşlyk ýüze çykdy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new BannerService()