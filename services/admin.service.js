const { Op } = require('sequelize')
const { Groups, GroupPermissions, Storages, Categories,
    Brands, Subcategories, Features, FeatureDescriptions,
    SubcategoryFeatures } = require('../config/models')

class AdminService {

    async isExists(Model, slug) {
        try {
            return Model.findAll({ where: { slug: slug } })
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // ADD
    async addGroupService(name) {
        try {
            name = name.trim().toUpperCase()
            const group = await Groups.create({ name: name })
            return {
                status: 201,
                msg: 'group name added',
                msg_key: 'created',
                detail: group,
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addAccessPathService(url, method, groupId) {
        try {
            const isExist = await GroupPermissions.findAll({ where: { url: url, method: method, groupId: groupId } })
            if (isExist.length > 0) {
                return {
                    status: 403,
                    msg: 'group permission found',
                    msg_key: 'already exist',
                    detail: []
                }
            }
            const permission = await GroupPermissions.create({ url: url, method: method, groupId: groupId })
            return {
                status: 201,
                msg: 'group permission added',
                msg_key: 'created',
                detail: permission
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addStorageService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _storage = await this.isExists(Storages, slug)
            if (_storage.length > 0) {
                return {
                    status: 403,
                    msg: 'storage found',
                    msg_key: 'already exist',
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
                msg: 'storage name added',
                msg_key: 'created',
                detail: storage
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addCategoryService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _category = await this.isExists(Categories, slug)
            if (_category) {
                return {
                    status: 403,
                    msg: 'category found',
                    msg_key: 'already exist',
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
                msg: 'category name added',
                msg_key: 'created',
                detail: category
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubcategoryService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _subcategory = await this.isExists(Subcategories, slug)
            if (_subcategory) {
                return {
                    status: 403,
                    msg: 'subcategory found',
                    msg_key: 'already exist',
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
                msg: 'subcategory name added',
                msg_key: 'created',
                detail: subcategory
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
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
                msg: 'feature name added',
                msg_key: 'created',
                detail: feature
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFeatureDescriptionService(desc, featureId) {
        try {
            const featureDesc = await FeatureDescriptions.create({ desc: desc, featureId: featureId })
            return {
                status: 201,
                msg: 'feature description name added',
                msg_key: 'created',
                detail: featureDesc
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubcategoryFeatureService(subcategoryId, featureId) {
        try {
            const subcategory_features = await SubcategoryFeatures.create({ subcategoryId: subcategoryId, featureId: featureId })
            return {
                status: 201,
                msg: 'subcategory feature name added',
                msg_key: 'created',
                detail: subcategory_features
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBrandService(oby, brand_img) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const brand = await this.isExists(Brands, slug)
            if (brand) {
                return {
                    status: 403,
                    msg: 'brand found',
                    msg_key: 'already exist',
                    detail: []
                }
            }
            oby.name = oby.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + oby.name.slice(1).toLowerCase()
            const brands = await Brands.create({ name: oby.name, slug: slug, img: brand_img, desc: oby?.desc || null, userId: oby.userId })
            return {
                status: 201,
                msg: 'brand name added',
                msg_key: 'created',
                detail: brands
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteAccessPathService(id) {
        try {
            const group = await GroupPermissions.destroy({ where: { id: Number(id) } })
            return {
                status: 200,
                msg: 'group permission deleted',
                msg_key: 'deleted',
                detail: group
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new AdminService()