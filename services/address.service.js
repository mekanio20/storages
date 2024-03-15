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
                .catch((err) => { console.log(err) })
            const address = Models.Addresses.create({ address: body.address, isDefault: true, customerId: customer })
            return Response.Created('Address döredildi!', address)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
            if (addresses.length === 0) { return Response.NotFound('Salgy yok!', []) }
            return Response.Success('Salgylar...', addresses)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // PUT
    async updateAddressService(addressId, body, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            let isDefault = body.isDefault ? true : false
            if (isDefault === true) {
                await Models.Addresses.update({ isDefault: false }, { where: { customerId: customer } })
                    .then(() => { console.log('Default false...') })
                    .catch((err) => { console.log(err) })
            }
            await Models.Addresses.update(
                { address: body.address, isDefault: isDefault }, 
                { where: { id: addressId, customerId: customer } 
            })
            return Response.Success('Salgy üytgedildi!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // DELETE
    async deleteAddressService(addressId, userId) {
        try {
            const customer = await Verification.isCustomer(userId)
            if (isNaN(customer)) { return customer }
            const address = await Models.Addresses.destroy({
                where: {
                    id: addressId,
                    customerId: customer
                }
            })
            if (!address) { return Response.BadRequest('Yalnyshlyk yuze cykdy!', []) }
            return Response.Success('Salgy pozuldy!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }
}

module.exports = new AddressService()