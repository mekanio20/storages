const userService = require('../services/user.service')

const userPermission = (reqId, userId) => {
    if (reqId !== userId)
        return false
    return true
}

class UserController {

    async userLogin(req, res) {
        try {
            const { password, phone } = req.body
            const data = await userService.userLoginService(password, phone)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
                token: data.token
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async userRegister(req, res) {
        try {
            const oby = req.body
            const data = await userService.userRegisterService(oby)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
                token: data.token
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async userProfile(req, res) {
        try {
            const { id } = req.params
            const user = userPermission(req.user.id, id)
            if (!user) {
                return res.status(403).json({
                    status: 403,
                    msg: 'user blocked',
                    msg_key: 'forbidden',
                    detail: []
                })
            }
            const data = await userService.userProfileService(id)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async allStorageList(req, res) {
        try {
            const data = await userService.allStorageListService()
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async allCategoryList(req, res) {
        try {
            const data = await userService.allCategoryService()
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

    async allBrandList(req, res) {
        try {
            const data = await userService.allBrandListService()
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }

}

module.exports = new UserController()