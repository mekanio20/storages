const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class AddressService {
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
}

module.exports = new AddressService()