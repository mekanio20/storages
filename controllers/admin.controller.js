const adminService = require('../services/admin.service')

class AdminController {

    async addGroup(req, res) {
        try {
            const { name } = req.body
            const data = await adminService.addGroupService(name)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

    async addRole(req, res) {
        try {
            const { role } = req.body
            const data = await adminService.addRoleService(role)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

    async addAccessPath(req, res) {
        try {
            const { url, method, groupId } = req.body
            const data = await adminService.addAccessPathService(url, method, groupId)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

    async addStorage(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addStorageService(oby)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

    async addCategory(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addCategoryService(oby)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data
            })
        } catch (error) {
            return res.status(500).json({ 
                success: false, 
                code: 500, 
                message: error.message 
            })
        }
    }

    async deleteAccessPath(req, res) {
        try {
            const { id } = req.params
            const data = await adminService.deleteAccessPathService(id)
            return res.status(data.code).json({
                success: data.success,
                code: data.code,
                message: data.message,
                data: data.data
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

module.exports = new AdminController()