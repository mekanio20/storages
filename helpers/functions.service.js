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
    async generateSlug(name) {
        try {
            return name.split(" ").join('-').toLowerCase()
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new Functions()