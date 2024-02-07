const jwt = require('jsonwebtoken')

class Functions {
    async generateJwt(id, group) {
        try {
            console.log('id: ', id, 'groupId: ', group)
            return jwt.sign({ id, group }, process.env.PRIVATE_KEY, { expiresIn: '30d' })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    async userPermission (reqId, userId) {
        if (String(reqId) !== String(userId))
            return false
        return true
    }
}

module.exports = new Functions()