const adminService = require('../services/admin.service')

class AdminController {

    async addGroup(req, res) {
        try {
            const { name } = req.body
            const data = await adminService.addGroupService(name)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addAccessPath(req, res) {
        try {
            const { url, method, groupId } = req.body
            const data = await adminService.addAccessPathService(url, method, groupId)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addStorage(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addStorageService(oby)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addCategory(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addCategoryService(oby)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async deleteAccessPath(req, res) {
        try {
            const { id } = req.params
            const data = await adminService.deleteAccessPathService(id)
            return res.status(data.status).json({
                status: data.status,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

module.exports = new AdminController()