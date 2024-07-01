const userService = require('../services/user.service')
const baseService = require('../services/base.service')
const Verification = require('../helpers/verification.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')

class UserController {
    // POST
    async userLogin(req, res) {
        try {
            const { phone, password } = req.body
            const data = await userService.userLoginService(phone, password)
            return res.status(data.status).json(data) 
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async userVerification(req, res) {
        try {
            const data = await userService.userVerificationService(req.body.code, req.userDto)
            return res.status(data.status).json(data) 
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async userRegister(req, res) {
        try {
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
            const data = await userService.userRegisterService(req.body, ip, device)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async checkControl(req, res) {
        try {
            const data = await userService.checkControlService(req.body.code, req.userDto)
            return res.status(data.status).json(data) 
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async forgotPassword(req, res) {
        try {
            const { phone, orgPass, verifPass } = req.body
            const data = await userService.forgotPasswordService(phone, orgPass, verifPass)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async resetPassword(req, res) {
        try {
            const data = await userService.resetPasswordService(req.body.code, req.userDto)
            return res.status(data.status).json(data) 
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async resetSubscription(req, res) {
        try {
            const data = await userService.resetSubscriptionService(req.body.code, req.userDto)
            return res.status(data.status).json(data) 
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }
    // -----
    async addLike(req, res) {
        try {
            const customerId = await Verification.isCustomer(req.user.id)
            if (!customerId) { return customerId }
            const body = req.body
            body.customerId = customerId
            body.productId = body.id
            delete body.id
            const data = await new baseService(Models.Likes).addService(body, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addOrder(req, res) {
        try {
            const data = await userService.addOrderService(req.body, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addBasket(req, res) {
        try {
            const data = await userService.addBasketService(req.body, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addFollower(req, res) {
        try {
            const customerId = await Verification.isCustomer(req.user.id)
            if (isNaN(customerId)) { return res.status(customerId.status).json(customerId) }
            const seller = await Models.Sellers.findOne({ where: { id: Number(req.params.id) }, attributes: ['id']})
            if (!seller) {
                const response = await Response.Unauthorized('Satyjy tapylmady!', [])
                return res.status(response.status).json(response)
            }
            const body = { customerId: customerId, sellerId: seller.id }
            const data = await new baseService(Models.Followers).addService(body, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addMessage(req, res) {
        try {
            const file = req.file?.filename || null
            const data = await userService.addMessageService(req.body, req.user.id, file)
            if (data.type === 'success') {
                const socket = req.app.get("socketio")
                socket.emit("msg", data.detail)
            }
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // GET
    async allMessages(req, res) {
        try {
            const data = await userService.allMessagesService(req.params.id, req.user.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allUsers(req, res) {
        try {
            const data = await userService.allUsersService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async userLogout(req, res) {
        try {
            const data = await userService.userLogoutService(req.user)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

}

module.exports = new UserController()