const adminService = require('../services/admin.service')

class AdminController {

    // ADD
    async addGroup(req, res) {
        try {
            const { name } = req.body
            const data = await adminService.addGroupService(name)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addAccessPath(req, res) {
        try {
            const { url, method, groupId } = req.body
            const data = await adminService.addAccessPathService(url, method, groupId)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addStorage(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addStorageService(oby)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addCategory(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addCategoryService(oby)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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
    
    async addSubcategory(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addSubcategoryService(oby)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addFeature(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addFeatureService(oby)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addFeatureDescription(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addFeatureDescriptionService(oby)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addSubcategoryFeature(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addSubcategoryFeatureService(oby)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addBrand(req, res) {
        try {
            const oby = req.body
            const brand_img = req.file
            const data = await adminService.addBrandService(oby, brand_img)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async addBanner(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addBannerService(oby)
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

    async addStaff(req, res) {
        try {
            const { userId } = req.body
            const data = await adminService.addStaffService(userId)
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

    async addSubscription(req, res) {
        try {
            const oby = req.body
            const data = await adminService.addSubscriptionService(oby)
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

    // DELETE
    async deleteAccessPath(req, res) {
        try {
            const { id } = req.params
            const data = await adminService.deleteAccessPathService(id)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    async deleteBrand(req, res) {
        try {
            const { id } = req.params
            const data = await adminService.deleteBrandService(id)
            return res.status(data.status).json({
                status: data.status,
                type: data.type,
                msg: data.msg,
                msg_key: data.msg_key,
                detail: data.detail,
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

    // DEFAULT
    async defaultCreate(req, res) {
        try {
            const data = await adminService.defaultCreateService()
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

module.exports = new AdminController()