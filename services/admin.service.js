const { Op } = require('sequelize')
const { Users, Groups, Roles, GroupPermissions, Storages, Categories } = require('../config/models')

class UserService {

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
            throw { success: false, code: 500, message: error.message }
        }
    }

    async addGroupService(name) {
        try {
            const group = await
                Groups.create({ name: name })

            return {
                status: true,
                code: 201,
                message: '',
                data: group
            }
        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }

    async addRoleService(name) {
        try {
            const role = await
                Roles.create({ role: name })

            return {
                status: true,
                code: 201,
                message: '',
                data: role
            }
        } catch (error) {
            throw { success: false, code: 500, message: error.message }
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
                    status: false,
                    code: 403,
                    message: 'already exist',
                    data: []
                }
            }

            const permission = await
                GroupPermissions.create({
                    url: url,
                    method: method,
                    groupId: groupId
                })

            return {
                status: true,
                code: 201,
                message: '',
                data: permission
            }

        } catch (error) {
            throw { success: false, code: 500, message: error.message }
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
                status: true,
                code: 201,
                message: '',
                data: storage
            }

        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }

    async addCategoryService(oby) {
        try {

            return {
                status: true,
                code: 201,
                message: '',
                data: 'test'
            }

            const category = await 
                Categories.create({
                    tm_name: oby.tm_name,
                    ru_name: oby?.ru_name || null,
                    en_name: oby?.en_name || null,
                    slug: oby.slug,
                    storageId: oby.storageId
                })

            return {
                status: true,
                code: 201,
                message: '',
                data: category
            }

        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }

    async deleteAccessPathService(id) {
        try {
            const group = await
                GroupPermissions
                    .destroy({ where: { id: Number(id) } })

            return {
                success: true,
                code: 200,
                message: '',
                data: group
            }
        } catch (error) {
            throw { success: false, code: 500, message: error.message }
        }
    }


}

module.exports = new UserService()