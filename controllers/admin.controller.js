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
            return res.status(500).json({ status: 500, type: 'error', msg: error })
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
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addPermission(req, res) {
        try {
            const data = await new baseService(Models.GroupPermissions).addService(req.body, req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
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
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addSubcategory(req, res) {
        try {
            const img = req.file
            const body = req.body
            const userId = req.user.id
            const data = await adminService.addSubcategoryService(body, userId, img)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addFeature(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const data = await adminService.addFeatureService(body, userId)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addFeatureDescription(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const data = await adminService.addFeatureDescriptionService(body, userId)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addSubcategoryFeature(req, res) {
        try {
            const body = req.body
            const userId = req.user.id
            const data = await adminService.addSubcategoryFeatureService(body, userId)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addBrand(req, res) {
        try {
            const body = req.body
            const brand_img = req.file
            const userId = req.user.id
            const data = await adminService.addBrandService(body, brand_img, userId)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addStaff(req, res) {
        try {
            const data = await adminService.addStaffService(req.body.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async addSubscription(req, res) {
        try {
            const data = await adminService.addSubscriptionService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // GET
    async allGroups(req, res) {
        try {
            const data = await new baseService(Models.Groups).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allPermissions(req, res) {
        try {
            const data = await adminService.allPermissionsService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allSubscriptions(req, res) {
        try {
            const data = await new baseService(Models.Subscriptions).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allFeatures(req, res) {
        try {
            const data = await new baseService(Models.Features).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allFeatureDescriptions(req, res) {
        try {
            const data = await new baseService(Models.FeatureDescriptions).getService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allSubcategoryFeatures(req, res) {
        try {
            const data = await adminService.allSubcategoryFeaturesService(req.query)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async allSystems(req, res) {
        try {
            const data = await adminService.allSystemsService()
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async registerStatistic(req, res) {
        try {
            const data = await adminService.registerStatisticService()
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // UPDATE
    async udpateGroup(req, res) {
        try {
            const data = await new baseService(Models.Groups).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updatePermission(req, res) {
        try {
            const data = await new baseService(Models.GroupPermissions).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateSubscription(req, res) {
        try {
            const data = await new baseService(Models.Subscriptions).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateBrand(req, res) {
        try {
            const data = await adminService.updateBrandService(req.body, req.file)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateCategory(req, res) {
        try {
            const data = await adminService.updateCategoryService(req.body, req.file)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateSubCategory(req, res) {
        try {
            const data = await adminService.updateSubCategoryService(req.body, req.file)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateUser(req, res) {
        try {
            const data = await adminService.updateUserService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateSeller(req, res) {
        try {
            const data = await new baseService(Models.Sellers).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateProduct(req, res) {
        try {
            const data = await new baseService(Models.Products).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateComment(req, res) {
        try {
            const data = await new baseService(Models.Comments).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateFeature(req, res) {
        try {
            const data = await new baseService(Models.Features).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateFeatureDescription(req, res) {
        try {
            const data = await new baseService(Models.FeatureDescriptions).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async updateSubcategoryFeature(req, res) {
        try {
            const data = await new baseService(Models.SubcategoryFeatures).updateService(req.body)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // DELETE
    async deleteGroup(req, res) {
        try {
            const data = await new baseService(Models.Groups).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteAccessPath(req, res) {
        try {
            const data = await new baseService(Models.GroupPermissions).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteScubscription(req, res) {
        try {
            const data = await new baseService(Models.Subscriptions).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteBrand(req, res) {
        try {
            const data = await new baseService(Models.Brands).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteCategory(req, res) {
        try {
            const data = await new baseService(Models.Categories).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteSubCategory(req, res) {
        try {
            const data = await new baseService(Models.Subcategories).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteUser(req, res) {
        try {
            const data = await adminService.deleteUserService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteCustomer(req, res) {
        try {
            const data = await adminService.deleteCustomerService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteSeller(req, res) {
        try {
            const data = await adminService.deleteSellerService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteFeature(req, res) {
        try {
            const data = await new baseService(Models.Features).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteFeatureDesc(req, res) {
        try {
            const data = await new baseService(Models.FeatureDescriptions).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    async deleteSubcategoryFeature(req, res) {
        try {
            const data = await new baseService(Models.SubcategoryFeatures).deleteService(req.params.id)
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

    // DEFAULT
    async defaultCreate(req, res) {
        try {
            const data = await adminService.defaultCreateService()
            return res.status(data.status).json(data)
        } catch (error) {
            return res.status(500).json({ status: 500, type: 'error', msg: error })
        }
    }

}

module.exports = new AdminController()