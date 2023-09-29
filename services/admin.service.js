const Response = require('../services/response.service')
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
            return Response.Created('Grupba döredildi!', group)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addAccessPathService(url, method, groupId) {
        try {
            const isExist = await GroupPermissions.findAll({ where: { url: url, method: method, groupId: groupId } })
            if (isExist.length > 0) {
                return Response.Forbidden('Maglumat döredilen!', [])
            }
            const permission = await GroupPermissions.create({ url: url, method: method, groupId: groupId })
            return Response.Created('Maglumat döredildi!', permission)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addStorageService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _storage = await this.isExists(Storages, slug)
            if (_storage.length > 0) {
                return Response.Forbidden('Maglumat döredilen!', [])
            }
            const storage = await Storages.create({
                tm_name: oby.tm_name,
                ru_name: oby?.ru_name || null,
                en_name: oby?.en_name || null,
                slug: slug
            })
            return Response.Created('Maglumat döredildi!', storage)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addCategoryService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _category = await this.isExists(Categories, slug)
            if (_category) {
                return Response.Forbidden('Maglumat döredilen!', [])
            }
            const category = await Categories.create({
                tm_name: oby.tm_name,
                ru_name: oby?.ru_name || null,
                en_name: oby?.en_name || null,
                slug: slug,
                storageId: oby.storageId
            })
            return Response.Created('Maglumat döredildi!', category)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    
    async addSubcategoryService(oby) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const _subcategory = await this.isExists(Subcategories, slug)
            if (_subcategory) {
                return Response.Forbidden('Maglumat döredilen!', [])
            }
            const subcategory = await Subcategories.create({
                tm_name: oby.tm_name,
                ru_name: oby?.ru_name || null,
                en_name: oby?.en_name || null,
                slug: slug,
                categoryId: oby.categoryId
            })
            return Response.Created('Maglumat döredildi!', subcategory)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFeatureService(oby) {
        try {
            const feature = await Features.create({ tm_name: oby.tm_name, ru_name: oby?.ru_name || null, en_name: oby?.en_name || null })
            return Response.Created('Maglumat döredildi!', feature)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFeatureDescriptionService(desc, featureId) {
        try {
            const featureDesc = await FeatureDescriptions.create({ desc: desc, featureId: featureId })
            return Response.Created('Maglumat döredildi!', featureDesc)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubcategoryFeatureService(subcategoryId, featureId) {
        try {
            const subcategory_features = await SubcategoryFeatures.create({ subcategoryId: subcategoryId, featureId: featureId })
            return Response.Created('Maglumat döredildi!', subcategory_features)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBrandService(oby, brand_img) {
        try {
            let slug = oby.tm_name.split(" ").join('-').toLowerCase()
            const brand = await this.isExists(Brands, slug)
            if (brand) {
                return Response.Forbidden('Maglumat döredilen!', [])
            }
            oby.name = oby.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + oby.name.slice(1).toLowerCase()
            const brands = await Brands.create({ name: oby.name, slug: slug, img: brand_img, desc: oby?.desc || null, userId: oby.userId })
            return Response.Created('Maglumat döredildi!', brands)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBannerService(oby) {
        try {
            return oby // should be updated
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async staffRegisterService(userId) {
        try {
            const groupId = await this.getGroupId('STAFF')
            await Users.update({ isStaff: true, isCustomer: false, groupId: groupId }, { where: { id: Number(userId) } })
            const token = generateJwt(userId, groupId)
            let response = Response.Created('Admin hasaba alyndy!', [])
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteAccessPathService(id) {
        try {
            await GroupPermissions.destroy({ where: { id: Number(id) } })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }
    
    async deleteBrandService(id) {
        try {
            await Brands.destroy({ where: { id: Number(id) } })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new AdminService()