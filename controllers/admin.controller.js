const Models = require('../config/models')
const adminService = require('../services/admin.service')
const Verification = require('../helpers/verification.service')
const Functions = require('../helpers/functions.service')
const Response = require('../helpers/response.service')
const baseService = require('../services/base.service')

class AdminController {
    // POST
    async adminLogin(req, res) {
        try {
            const data = await adminService.adminLoginService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addGroup(req, res) {
        try {
            const name = req.body.name.trim().toUpperCase()
            const isExist = { name: name }
            const body = { name: name, isActive: req.body.isActive }
            const data = await new baseService(Models.Groups).addService(isExist, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addPermission(req, res) {
        try {
            const data = await new baseService(Models.GroupPermissions).addService(req.body, req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addCategory(req, res) {
        try {
            const file = await Verification.isFile(req?.file?.filename)
            if (!file) {
                const response = await Response.BadRequest('logo gerek!', [])
                return res.status(response.status).json(response)
            }
            const slug = await Functions.generateSlug(req.body.tm_name)
            const isExist = { slug: slug }
            const body = req.body
            body.logo = file
            body.slug = slug
            body.userId = req.user.id
            const data = await new baseService(Models.Categories).addService(isExist, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addSubcategory(req, res) {
        try {
            const file = await Verification.isFile(req?.file?.filename)
            if (!file) {
                const response = await Response.BadRequest('logo gerek!', [])
                return res.status(response.status).json(response)
            }
            const slug = await Functions.generateSlug(req.body.tm_name)
            const isExist = { slug: slug }
            const body = req.body
            body.logo = file
            body.slug = slug
            body.userId = req.user.id
            const data = await new baseService(Models.Subcategories).addService(isExist, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addFeature(req, res) {
        try {
            const body = req.body
            body.userId = req.user.id
            const isExist = { tm_name: body.tm_name }
            const data = await new baseService(Models.Features).addService(isExist, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addFeatureDescription(req, res) {
        try {
            const body = req.body
            body.userId = req.user.id
            const isExist = { desc: body.desc, featureId: body.featureId }
            const data = await new baseService(Models.FeatureDescriptions).addService(isExist, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addSubcategoryFeature(req, res) {
        try {
            const body = req.body
            body.userId = req.user.id
            const isExist = { subcategoryId: body.subcategoryId, featureId: body.featureId }
            const data = await new baseService(Models.SubcategoryFeatures).addService(isExist, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addBrand(req, res) {
        try {
            const body = req.body
            const file = await Verification.isFile(req?.file?.filename)
            if (!file) {
                const response = await Response.BadRequest('logo gerek!', [])
                return res.status(response.status).json(response)
            }
            const slug = await Functions.generateSlug(req.body.name)
            const isExist = { slug: slug }
            body.img = file
            body.slug = slug
            body.userId = req.user.id
            body.name = body.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + body.name.slice(1).toLowerCase()
            const data = await new baseService(Models.Brands).addService(isExist, body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addStaff(req, res) {
        try {
            const data = await adminService.addStaffService(req.body.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async addSubscription(req, res) {
        try {
            const isExist = { name: req.body.name }
            const data = await new baseService(Models.Subscriptions).addService(isExist, req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // GET
    async allGroups(req, res) {
        try {
            const data = await new baseService(Models.Groups).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allPermissions(req, res) {
        try {
            const data = await adminService.allPermissionsService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allSubscriptions(req, res) {
        try {
            const data = await new baseService(Models.Subscriptions).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allFeatures(req, res) {
        try {
            const data = await new baseService(Models.Features).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allFeatureDescriptions(req, res) {
        try {
            const data = await adminService.allFeatureDescriptionsService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allSubcategoryFeatures(req, res) {
        try {
            const data = await adminService.allSubcategoryFeaturesService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async allSystems(req, res) {
        try {
            const data = await adminService.allSystemsService()
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async registerStatistic(req, res) {
        try {
            const data = await adminService.registerStatisticService()
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // UPDATE
    async udpateGroup(req, res) {
        try {
            const data = await new baseService(Models.Groups).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updatePermission(req, res) {
        try {
            const data = await new baseService(Models.GroupPermissions).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateSubscription(req, res) {
        try {
            const data = await new baseService(Models.Subscriptions).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateBrand(req, res) {
        try {
            const body = req.body
            const file = await Verification.isFile(req?.file?.filename)
            let slug = null
            if (file) { body.img = file }
            if (body.name) {
                body.name = body.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + body.name.slice(1).toLowerCase()
                slug = await Functions.generateSlug(body.name)
                body.slug = slug
            }
            const data = await new baseService(Models.Brands).updateService(body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateCategory(req, res) {
        try {
            const body = req.body
            const file = await Verification.isFile(req?.file?.filename)
            const slug = await Functions.generateSlug(req.body.tm_name)
            if (file) { body.logo = file }
            body.slug = slug
            const data = await new baseService(Models.Categories).updateService(body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateSubCategory(req, res) {
        try {
            const body = req.body
            const file = await Verification.isFile(req?.file?.filename)
            const slug = await Functions.generateSlug(req.body.tm_name)
            if (file) { body.logo = file }
            body.slug = slug
            const data = await new baseService(Models.Subcategories).updateService(body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateUser(req, res) {
        try {
            const data = await adminService.updateUserService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateSeller(req, res) {
        try {
            const data = await new baseService(Models.Sellers).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateProduct(req, res) {
        try {
            const data = await new baseService(Models.Products).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateComment(req, res) {
        try {
            const data = await new baseService(Models.Comments).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateFeature(req, res) {
        try {
            const data = await new baseService(Models.Features).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateFeatureDescription(req, res) {
        try {
            const data = await new baseService(Models.FeatureDescriptions).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async updateSubcategoryFeature(req, res) {
        try {
            const data = await new baseService(Models.SubcategoryFeatures).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // DELETE
    async deleteGroup(req, res) {
        try {
            const data = await new baseService(Models.Groups).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deletePermission(req, res) {
        try {
            const data = await new baseService(Models.GroupPermissions).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteScubscription(req, res) {
        try {
            const data = await new baseService(Models.Subscriptions).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteBrand(req, res) {
        try {
            const data = await new baseService(Models.Brands).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteCategory(req, res) {
        try {
            const data = await new baseService(Models.Categories).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteSubCategory(req, res) {
        try {
            const data = await new baseService(Models.Subcategories).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteUser(req, res) {
        try {
            const data = await adminService.deleteUserService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteCustomer(req, res) {
        try {
            const data = await adminService.deleteCustomerService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteSeller(req, res) {
        try {
            const data = await adminService.deleteSellerService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteFeature(req, res) {
        try {
            const data = await new baseService(Models.Features).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteFeatureDesc(req, res) {
        try {
            const data = await new baseService(Models.FeatureDescriptions).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    async deleteSubcategoryFeature(req, res) {
        try {
            const data = await new baseService(Models.SubcategoryFeatures).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

    // DEFAULT
    async defaultCreate(req, res) {
        try {
            const data = await adminService.defaultCreateService()
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error, detail: [] })
        }
    }

}

module.exports = new AdminController()