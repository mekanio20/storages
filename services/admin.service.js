const { Op } = require('sequelize')
const { Groups, GroupPermissions, Storages, Categories,
    Brands, Subcategories, Features, FeatureDescriptions,
    SubcategoryFeatures } = require('../config/models')

const generateJwt = (id, group) => {
    return jwt.sign({ id, group }, process.env.PRIVATE_KEY, { expiresIn: '30d' })
}

class AdminService {

    async isExists(Model, slug) {
        try {
            return Model.findAll({ where: { slug: slug } })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async getGroupId(group) {
        try {
            let group_id = await Groups.findOne({ where: { name: group }, attributes: ['id'] })
            if (!group_id) { group_id = await Groups.create({ name: group }) }
            group_id = JSON.stringify(group_id)
            group_id = Number(JSON.parse(group_id).id)
            return group_id
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // ADD
    async addGroupService(name) {
        try {
            name = name.trim().toUpperCase()
            const group = await Groups.create({ name: name })
            return {
                status: 201,
                type: 'successs',
                msg: 'group name added',
                msg_key: 'created',
                detail: group,
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addAccessPathService(url, method, groupId) {
        try {
            const isExist = await GroupPermissions.findAll({ where: { url: url, method: method, groupId: groupId } })
            if (isExist.length > 0) {
                return {
                    status: 403,
                    type: 'error',
                    msg: 'already exist',
                    msg_key: 'forbidden',
                    detail: []
                }
            }
            const permission = await GroupPermissions.create({ url: url, method: method, groupId: groupId })
            return {
                status: 201,
                type: 'success',
                msg: 'group permission added',
                msg_key: 'created',
                detail: permission
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addStorageService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _storage = await this.isExists(Storages, slug)
            if (_storage.length > 0) {
                return {
                    status: 403,
                    type: 'error',
                    msg: 'already exist',
                    msg_key: 'forbidden',
                    detail: []
                }
            }
            const storage = await Storages.create({
                tm_name: oby.tm_name,
                ru_name: oby?.ru_name || null,
                en_name: oby?.en_name || null,
                slug: slug
            })
            return {
                status: 201,
                type: 'success',
                msg: 'storage name added',
                msg_key: 'created',
                detail: storage
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addCategoryService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _category = await this.isExists(Categories, slug)
            if (_category) {
                return {
                    status: 403,
                    type: 'error',
                    msg: 'already exist',
                    msg_key: 'forbidden',
                    detail: []
                }
            }
            const category = await Categories.create({
                tm_name: oby.tm_name,
                ru_name: oby?.ru_name || null,
                en_name: oby?.en_name || null,
                slug: slug,
                storageId: oby.storageId
            })
            return {
                status: 201,
                type: 'success',
                msg: 'category name added',
                msg_key: 'created',
                detail: category
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubcategoryService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _subcategory = await this.isExists(Subcategories, slug)
            if (_subcategory) {
                return {
                    status: 403,
                    type: 'error',
                    msg: 'already exist',
                    msg_key: 'forbidden',
                    detail: []
                }
            }
            const subcategory = await Subcategories.create({
                tm_name: oby.tm_name,
                ru_name: oby?.ru_name || null,
                en_name: oby?.en_name || null,
                slug: slug,
                categoryId: oby.categoryId
            })
            return {
                status: 201,
                type: 'success',
                msg: 'subcategory name added',
                msg_key: 'created',
                detail: subcategory
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFeatureService(oby) {
        try {
            const feature = await Features.create({
                tm_name: oby.tm_name,
                ru_name: oby?.ru_name || null,
                en_name: oby?.en_name || null
            })
            return {
                status: 201,
                type: 'success',
                msg: 'feature name added',
                msg_key: 'created',
                detail: feature
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFeatureDescriptionService(desc, featureId) {
        try {
            const featureDesc = await FeatureDescriptions.create({ desc: desc, featureId: featureId })
            return {
                status: 201,
                type: 'success',
                msg: 'feature description name added',
                msg_key: 'created',
                detail: featureDesc
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubcategoryFeatureService(subcategoryId, featureId) {
        try {
            const subcategory_features = await SubcategoryFeatures.create({ subcategoryId: subcategoryId, featureId: featureId })
            return {
                status: 201,
                type: 'success',
                msg: 'subcategory feature added',
                msg_key: 'created',
                detail: subcategory_features
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBrandService(oby, brand_img) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const brand = await this.isExists(Brands, slug)
            if (brand) {
                return {
                    status: 403,
                    type: 'error',
                    msg: 'already exist',
                    msg_key: 'forbidden',
                    detail: []
                }
            }
            oby.name = oby.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + oby.name.slice(1).toLowerCase()
            const brands = await Brands.create({ name: oby.name, slug: slug, img: brand_img, desc: oby?.desc || null, userId: oby.userId })
            return {
                status: 201,
                type: 'success',
                msg: 'brand name added',
                msg_key: 'created',
                detail: brands
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBannerService(oby) {
        try {
            return oby
            return {
                status: 201,
                type: 'success',
                msg: 'brand name added',
                msg_key: 'created',
                detail: brands
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async staffRegisterService(userId) {
        try {
            const groupId = await this.getGroupId('STAFF')
            await Users.update({ isStaff: true, isCustomer: false, groupId: groupId }, { where: { id: Number(userId) } })
            const token = generateJwt(userId, groupId)
            return {
                status: 200,
                type: 'success',
                msg: 'staff registered',
                msg_key: 'updated',
                detail: [],
                token: token
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteAccessPathService(id) {
        try {
            const group = await GroupPermissions.destroy({ where: { id: Number(id) } })
            return {
                status: 200,
                type: 'success',
                msg: 'group permission deleted',
                msg_key: 'deleted',
                detail: group
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteBrandService(id) {
        try {
            const brand = await Brands.destroy({ where: { id: Number(id) } })
            return {
                status: 200,
                type: 'error',
                msg: 'brand deleted',
                msg_key: 'deleted',
                detail: brand
            }
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new AdminService()