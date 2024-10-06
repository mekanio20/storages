const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class AddressService {
    // POST
    async addAddressService(body, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }

            await Models.Addresses.update({ isDefault: false }, { where: { customerId: customer } })
                .then(() => { console.log('Default false...') })

            const address = Models.Addresses.create({ address: body.address, isDefault: true, customerId: customer })

            return Response.Created('Address döredildi!', address)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // GET
    async allAddressService(userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }

            const addresses = await Models.Addresses.findAll({
                attributes: ['id', 'address', 'isDefault'],
                where: { customerId: customer },
                order: [['id', 'desc']]
            })

            return addresses.length
                ? Response.Success('Salgylar', addresses)
                : Response.NotFound('Salgy yok!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // PUT
    async updateAddressService(addressId, body, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) return customer
    
            if (body.isDefault) { await Models.Addresses.update({ isDefault: false }, { where: { customerId: customer } }) }
            await Models.Addresses.update(
                { address: body.address, isDefault: !!body.isDefault }, 
                { where: { id: addressId, customerId: customer } }
            )
    
            return Response.Success('Salgy üytgedildi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
    // DELETE
    async deleteAddressService(addressId, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }

            const address = await Models.Addresses.destroy({ where: { id: addressId, customerId: customer } })

            return address
                ? Response.Success('Salgy pozuldy!', [])
                : Response.BadRequest('Yalnyshlyk yuze cykdy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message || error, detail: [] }
        }
    }
}

module.exports = new AddressService()