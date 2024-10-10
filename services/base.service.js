const Response = require('../helpers/response.service')

class BaseService {
    constructor(model) { this.Model = model }
    async addService(isExist, body) {
        try {
            const [data, created] = await this.Model.findOrCreate({ where: isExist, defaults: body })
            if (!created) { return Response.BadRequest('Maglumat eýýäm döredilen!', data) }
            return Response.Created('Maglumat döredildi!', data)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    async getService(q) {
        try {
            const { page = 1, limit = 10, sort = 'id', order = 'asc', status = true } = q
            const whereCondition = status === 'all' ? {} : { isActive: status }
            const data = await this.Model.findAndCountAll({
                where: whereCondition,
                limit,
                offset: (page - 1) * limit,
                order: [[sort, order]]
            })
            return data.count
                ? Response.Success('Successful!', data)
                : Response.NotFound('No data found!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }    
    async updateService(body) {
        try {
            const obj = {}
            for (const item in body) {
                if (item && item !== 'id') {
                    obj[item] = body[item]
                }
            }
            await this.Model.update(obj, { where: { id: Number(body.id) } })
                .then(() => console.log(true))
            return Response.Success('Üstünlikli', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    async deleteService(id) {
        try {
            await this.Model.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = BaseService