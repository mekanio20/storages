const { Op } = require('sequelize')
const { Users, Groups, GroupPermissions, Storages, Categories } = require('../config/models')

class AdminService {

    async isExists(username, phone) {
        try {
            return Users.findAll({
                where: {
                    [Op.or]: {
                        username: username,
                        phone: phone
                    }
                },
                attributes: ['id', 'username', 'password', 'phone']
            })
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addGroupService(name) {
        try {
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
            const isExist = await
                GroupPermissions.findAll({
                    where: {
                        url: url,
                        method: method,
                        groupId: groupId
                    }
                })
            if (isExist.length > 0) {
                return {
                    status: 403,
                    msg: 'group permission found',
                    msg_key: 'already exist',
                    detail: []
                }
            }
            const permission = await
                GroupPermissions.create({
                    url: url,
                    method: method,
                    groupId: groupId
                })
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
            const storage = await 
                Storages.create({
                    tm_name: oby.tm_name,
                    ru_name: oby?.ru_name || null,
                    en_name: oby?.en_name || null,
                    slug: oby.slug
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
            const category = await 
                Categories.create({
                    tm_name: oby.tm_name,
                    ru_name: oby?.ru_name || null,
                    en_name: oby?.en_name || null,
                    slug: oby.slug,
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

    async deleteAccessPathService(id) {
        try {
            const group = await GroupPermissions
                .destroy({ where: { id: Number(id) } })
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