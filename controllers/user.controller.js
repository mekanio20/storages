const userService = require('../services/user.service')

const userPermission = (reqId, userId) => {
    if (reqId !== userId)
        return false
    return true
}

class UserController {

    async userLogin(req, res) {
        try {
            const { username, password, phone } = req.body
            const data = await userService.userLoginService(username, password, phone)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data,
                token: data.token
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

    async userRegister(req, res) {
        try {
            const oby = req.body
            const data = await userService.userRegisterService(oby)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data,
                token: data.token
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

    async userProfile(req, res) {
        try {
            const { id } = req.params
            const user = userPermission(req.user.id, id)
            if (!user) {
                return res.status(403).json({
                    success: false,
                    code: 403,
                    message: 'forbidden',
                    data: []
                })
            }
            const data = await userService.userProfileService(id)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data,
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

}

module.exports = new UserController()