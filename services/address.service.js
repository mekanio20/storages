const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class AddressService {

    // POST
    async addAddressService(body, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Mushderi tapylmady!', []) }
            await Models.Addresses.update({ isDefault: false }, { where: { customerId: customerId } })
                .then(() => { console.log('Default false...') })
                .catch((err) => { console.log(err) })
            const address = Models.Addresses.create({ address: body.address, isDefault: true, customerId: customerId })
            return Response.Created('Address doredildi!', address)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async allAddressService(userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Mushderi tapylmady!', []) }
            const addresses = await Models.Addresses.findAll({
                attributes: ['id', 'address', 'isDefault'],
                where: { customerId: customerId }
            })
            if (addresses.length === 0) { return Response.NotFound('Salgy yok!', []) }
            return Response.Success('Salgylar...', addresses)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // PUT
    async updateAddressService(addressId, body, userId) {
        try {
            const customerId = await Verification.isCustomer(userId)
            if (!customerId) { return Response.Unauthorized('Mushderi tapylmady!', []) }
            let isDefault = body.isDefault ? true : false
            if (isDefault === true) {
                await Models.Addresses.update({ isDefault: false }, { where: { id: addressId, customerId: customerId } })
                    .then(() => { console.log('Default false...') })
                    .catch((err) => { console.log(err) })
            }
            await Models.Addresses.update(
                { address: body.address, isDefault: isDefault }, 
                { where: { id: addressId, customerId: customerId } 
            })
            return Response.Success('Salgy uytgedildi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new AddressService()