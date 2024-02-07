const Response = require('../helpers/response.service')
const userService = require('../services/user.service')
const Functions = require('../helpers/functions.service')

class UserController {
    // POST
    async userLogin(req, res) {
        try {
            const { phone, password } = req.body
            const data = await userService.userLoginService(phone, password)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
                token: data.token
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async userRegister(req, res) {
        try {
            const body = req.body
            let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
            ip = ip.substr(7)
            let device = null
            const info = req.get('User-Agent')
            const devices = ['Android', 'iPhone', 'Mac OS', 'Windows']
            for (let i = 0; i < devices.length; i++) {
                if (info.includes(devices[i])) {
                    device = devices[i]
                    break
                }
            }
            console.log('DEVICE --> ', device)
            const data = await userService.userRegisterService(body, ip, device)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async checkControl(req, res) {
        try {
            const { code } = req.body
            const { userDto } = req
            const data = await userService.checkControlService(code, userDto)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            }) 
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async forgotPassword(req, res) {
        try {
            const { phone, orgPass, verifPass } = req.body
            const data = await userService.forgotPasswordService(phone, orgPass, verifPass)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async resetPassword(req, res) {
        try {
            const { code } = req.body
            const { userDto } = req
            const data = await userService.resetPasswordService(code, userDto)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            }) 
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
    
    async addLike(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const data = await userService.addLikeService(body, userId)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async addOrder(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const data = await userService.addOrderService(body, userId)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async addBasket(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const data = await userService.addBasketService(body, userId)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async addFollower(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id
            const data = await userService.addFollowerService(id, userId)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async addMessage(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const file = req.file?.filename || null
            const data = await userService.addMessageService(body, userId, file)
            if (data.type === 'success') {
                const socket = req.app.get("socketio")
                socket.emit("msg", data.detail)
            }
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    // GET
    async allMessages(req, res) {
        try {
            const { id } = req.params
            const userId = req.user.id
            const data = await userService.allMessagesService(id, userId)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async allUsers(req, res) {
        try {
            const q = req.query
            const data = await userService.allUsersService(q)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async userLogout(req, res) {
        try {
            const userDto = req.user
            const data = await userService.userLogoutService(userDto)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

}

module.exports = new UserController()