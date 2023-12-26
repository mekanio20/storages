const Response = require('../helpers/response.service')
const Models = require('../config/models')

class VideoService {

    // POST 
    async addVideoService(body) {
        try {
            
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
}

module.exports = new VideoService()