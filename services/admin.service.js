const Verification = require('../helpers/verification.service')
const Functions = require('../helpers/functions.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')

class AdminService {

    // POST
    async addGroupService(name) {
        try {
            name = name.trim().toUpperCase()
            const [group, created] = await Models.Groups.findOrCreate({
                where: { name: name },
                defaults: {
                    name: name
                }
            })
            if (!created) { return Response.BadRequest('Maglumat eyyam döredilen!', group) }
            return Response.Created('Grupba döredildi!', group)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addAccessPathService(url, method, groupId) {
        try {
            const isExist = await Models.GroupPermissions.findAll({ where: { url: url, method: method, groupId: groupId } })
            if (isExist.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const permission = await Models.GroupPermissions.create({ url: url, method: method, groupId: groupId })
            return Response.Created('Maglumat döredildi!', permission)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addStorageService(body, userId) {
        try {
            let slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _storage = await Verification.isFound(Models.Storages, slug)
            if (_storage.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const storage = await Models.Storages.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                slug: slug,
                userId: userId
            })
            return Response.Created('Maglumat döredildi!', storage)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addCategoryService(body, userId) {
        try {
            let slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _category = await Verification.isFound(Models.Categories, slug)
            if (_category.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const category = await Models.Categories.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                slug: slug,
                storageId: body.storageId,
                userId: userId
            })
            return Response.Created('Maglumat döredildi!', category)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubcategoryService(body, userId) {
        try {
            let slug = body.tm_name.split(" ").join('-').toLowerCase()
            const _subcategory = await Verification.isFound(Models.Subcategories, slug)
            if (_subcategory.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const subcategory = await Models.Subcategories.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                slug: slug,
                categoryId: body.categoryId,
                userId: userId
            })
            return Response.Created('Maglumat döredildi!', subcategory)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFeatureService(body, userId) {
        try {
            const _features = await Models.Features.findAll({ where: { tm_name: body.tm_name } })
            if (_features.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const feature = await Models.Features.create({
                tm_name: body.tm_name,
                ru_name: body.ru_name || null,
                en_name: body.en_name || null,
                userId: userId
            })
            return Response.Created('Maglumat döredildi!', feature)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addFeatureDescriptionService(body, userId) {
        try {
            const { desc, featureId } = body
            const _featureDesc = await Models.FeatureDescriptions.findAll({ where: { desc: desc, featureId: featureId } })
            if (_featureDesc.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const featureDesc = await Models.FeatureDescriptions.create({ desc: desc, featureId: featureId, userId: userId })
            return Response.Created('Maglumat döredildi!', featureDesc)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubcategoryFeatureService(body, userId) {
        try {
            const { subcategoryId, featureId } = body
            const _subcategory_features = await Models.SubcategoryFeatures.findAll({ where: { subcategoryId: subcategoryId, featureId: featureId } })
            if (_subcategory_features.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const subcategory_features = await Models.SubcategoryFeatures.create({ subcategoryId: subcategoryId, featureId: featureId, userId: userId })
            return Response.Created('Maglumat döredildi!', subcategory_features)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addBrandService(body, brand_img, userId) {
        try {
            if (!brand_img) { return Response.BadRequest('logo gerek!', []) }
            let slug = body.name.split(" ").join('-').toLowerCase()
            const brand = await Verification.isFound(Models.Brands, slug)
            if (brand.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            body.name = body.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + body.name.slice(1).toLowerCase()
            const brands = await Models.Brands.create({ 
                name: body.name,
                slug: slug,
                img: brand_img.filename,
                isActive: body.isActive || true,
                desc: body.desc || null,
                userId: userId 
            })
            return Response.Created('Maglumat döredildi!', brands)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addStaffService(userId) {
        try {
            const groupId = await Models.Groups.findOne({ where: { name: 'STAFF' }, attributes: ['id'] })
            if (!groupId) { return Response.NotFound('Beyle grupba yok!', []) }
            const staff = await Models.Users.findOne({ where: { id: Number(userId), isStaff: true } })
            if (staff.length > 0) { return Response.BadRequest('Admin doredilen!', []) }
            await Models.Users.update({ isStaff: true, isCustomer: false, isSeller: false, groupId: groupId.id }, { where: { id: Number(userId) } })
            const token = await Functions.generateJwt(userId, groupId.id)
            let response = await Response.Created('Admin hasaba alyndy!', [])
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addSubscriptionService(body) {
        try {
            const _subscription = await Models.Subscriptions.findAll({ where: { name: body.name } })
            if (_subscription.length > 0) { return Response.BadRequest('Maglumat eyyam döredilen!', []) }
            const subscription = await Models.Subscriptions.create({
                name: body.name,
                price: body.price,
                order: body.order,
                p_limit: body.p_limit,
                p_img_limit: body.p_img_limit,
                seller_banner_limit: body.seller_banner_limit,
                main_banner_limit: body.main_banner_limit,
                ntf_limit: body.ntf_limit,
                voucher_limit: body.voucher_limit,
                smm_support: body.smm_support,
                tech_support: body.tech_support
            })
            return Response.Created('Subscription döredildi!', subscription)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // GET
    async allGroupsService(q) {
        try {
            const groups = await Models.Groups.findAll({
                where: { isActive: true },
                attributes: ['id', 'name'],
                order: [['id', 'ASC']]
            })
            if (groups.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', groups)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allPermissionsService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const permissions = await Models.GroupPermissions.findAndCountAll({
                attributes: { exclude: ['groupId'] },
                include: {
                    model: Models.Groups,
                    attributes: ['id', 'name']
                },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            if (permissions.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', permissions)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allContactsService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const contact = await Models.Contacts.findAll({
                where: { isActive: true },
                limit: Number(limit),
                offset: Number(offset)
            })
            if (contact.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', contact)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allSubscriptionsService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            const subscriptions = await Models.Subscriptions.findAndCountAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { isActive: true },
                limit: Number(limit),
                offset: Number(offset),
                order: [['order', 'asc']]
            })
            if (subscriptions.length == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', subscriptions)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // UPDATE
    async updatePermissionService(body) {
        try {
            const permission = await Models.GroupPermissions.update(
                { url: body.url, method: body.method, groupId: body.groupId },
                { where: { id: body.id } }
            )
            if (!permission) { return Response.BadRequest('Ýalňyşlyk ýüze çykdy!', []) }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async updateSubscriptionService(body) {
        try {
            const subscription = await Models.Subscriptions.update(
                {
                    name: body.name,
                    order: body.order,
                    price: body.price,
                    p_limit: body.p_limit,
                    p_img_limit: body.p_img_limit,
                    seller_banner_limit: body.seller_banner_limit,
                    main_banner_limit: body.main_banner_limit,
                    ntf_limit: body.ntf_limit,
                    voucher_limit: body.voucher_limit,
                    smm_support: body.smm_support,
                    tech_support: body.tech_support
                },
                { where: { id: body.id } }
            ).catch((err) => { console.log(err) })
            if (!subscription) { return Response.BadRequest('Ýalňyşlyk ýüze çykdy!', []) }
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async updateBrandService(body, file) {
        try {
            const obj = {}
            for (const item in body) {
                if (item.length > 0 && item !== 'id') {
                    if (item == 'isActive') {
                        obj[item] = body[item] == 'true' ? true : false
                    } else {
                        obj[item] = body[item]
                    }
                }
            }
            if (file) { obj.img = file.filename }
            obj.slug = obj.name.split(" ").join('-').toLowerCase()
            obj.name = body.name.trim().split(' ').join(' ').charAt(0).toUpperCase() + body.name.slice(1).toLowerCase()
            await Models.Brands.update(obj, { where: { id: Number(body.id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DELETE
    async deleteGroupService(id) {
        try {
            await Models.Groups.destroy({ where: { id: Number(id) } })
            return Response.Success('Üstünlikli', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteAccessPathService(id) {
        try {
            await Models.GroupPermissions.destroy({ where: { id: id } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteScubscriptionService(id) {
        try {
            await Models.Subscriptions.destroy({ where: { id: id } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteBrandService(id) {
        try {
            await Models.Brands.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteStorageService(id) {
        try {
            await Models.Storages.update({ isActive: false }, { where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteCategoryService(id) {
        try {
            await Models.Categories.update({ isActive: false }, { where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteFeatureService(id) {
        try {
            await Models.Features.update({ isActive: false }, { where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async deleteContactService(id) {
        try {
            await Models.Contacts.update({ isActive: false }, { where: { id: id } })
                .then(() => { return Response.Success('Üstünlikli!', []) })
                .catch((err) => { console.log(err) })
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    // DEFAULT
    async defaultCreateService() {
        try {
            await Models.Groups.bulkCreate([
                { name: 'SUPERADMIN' },
                { name: 'STAFF' },
                { name: 'SELLERS' },
                { name: 'USERS' }
            ]).then(() => { console.log('Groups created') }).catch((err) => { console.log(err) })

            let passwords = []
            for (let i = 1; i <= 11; i++) {
                let hash = await bcrypt.hash(`user${i}`, 5)
                passwords.push(hash)
            }

            await Models.Users.bulkCreate([
                { phone: '61111111', password: passwords[0], ip: '127.0.0.1', device: 'Android', uuid: uuid.v4(), groupId: 1, isSuperAdmin: true },
                { phone: '61111112', password: passwords[1], ip: '127.0.0.2', device: 'Android', uuid: uuid.v4(), groupId: 2, isStaff: true },
                { phone: '61111113', password: passwords[2], ip: '127.0.0.3', device: 'iPhone', uuid: uuid.v4(), groupId: 3, isSeller: true },
                { phone: '61111114', password: passwords[3], ip: '127.0.0.4', device: 'Android', uuid: uuid.v4(), groupId: 4, isCustomer: true },
                { phone: '61111115', password: passwords[4], ip: '127.0.0.5', device: 'Android', uuid: uuid.v4(), groupId: 2, isStaff: true },
                { phone: '61111116', password: passwords[5], ip: '127.0.0.6', device: 'iPhone', uuid: uuid.v4(), groupId: 2, isStaff: true },
                { phone: '61111117', password: passwords[6], ip: '127.0.0.7', device: 'Android', uuid: uuid.v4(), groupId: 2, isStaff: true },
                { phone: '61111118', password: passwords[7], ip: '127.0.0.8', device: 'iPhone', uuid: uuid.v4(), groupId: 2, isStaff: true },
                { phone: '61111119', password: passwords[8], ip: '127.0.0.9', device: 'Android', uuid: uuid.v4(), groupId: 4, isCustomer: true },
                { phone: '61111121', password: passwords[9], ip: '127.0.0.10', device: 'Android', uuid: uuid.v4(), groupId: 3, isSeller: true },
                { phone: '61111122', password: passwords[10], ip: '127.0.0.11', device: 'iPhone', uuid: uuid.v4(), groupId: 3, isSeller: true }
            ]).then(() => { console.log('Users created') }).catch((err) => { console.log(err) })

            await Models.Customers.bulkCreate([
                { fullname: 'Akmuhammet Nurmuradow', gender: 'male', email: 'akmuhammednumuradow@gmail.com', userId: 4 },
                { fullname: 'Muhammetnazar Alymow', gender: 'male', email: 'marcurLorry@gmail.com', userId: 9 }
            ]).then(() => { console.log('Customers created') }).catch((err) => { console.log(err) })

            await Models.Brands.bulkCreate([
                { name: 'miweler', slug: 'miweler', img: 'test1.jpg', desc: 'abcdefg', userId: 1 },
                { name: 'addidas', slug: 'addidas', img: 'test2.jpg', desc: 'abcdefg', userId: 1 },
                { name: 'pumma', slug: 'pumma', img: 'test3.jpg', desc: 'abcdefg', userId: 2 },
                { name: 'galaxy', slug: 'galaxy', img: 'test4.jpg', desc: 'abcdefg', userId: 2 }
            ]).then(() => { console.log('Brands created') }).catch((err) => { console.log(err) })

            await Models.Storages.bulkCreate([
                { tm_name: 'Elektronika', ru_name: 'Электроника', en_name: 'Electronics', slug: 'elektronika', userId: 1 },
                { tm_name: 'Supermarket', ru_name: 'Супермаркет', en_name: 'Supermarket', slug: 'supermarket', userId: 1 },
                { tm_name: 'Aýakgap & Sumka', ru_name: 'Сумка & Обувь', en_name: 'Shoes & Bag', slug: 'aýakgap-&-sumka', userId: 2 },
                { tm_name: 'Egin-Eşikler', ru_name: 'Одежда', en_name: 'Clothes', slug: 'egin-eşikler', userId: 2 },
                { tm_name: 'Sport Geýimler', ru_name: 'Спортивная Одежда', en_name: 'Sportswear', slug: 'sport-geýimler', userId: 5 },
                { tm_name: 'Kosmetika önümleri', ru_name: 'Косметическая Продукция', en_name: 'Cosmetic Products', slug: 'kosmetika-önümleri', userId: 6 }
            ]).then(() => { console.log('Storages created') }).catch((err) => { console.log(err) })

            await Models.Categories.bulkCreate([
                { logo: 'image.jpg', tm_name: 'Gök we bakja önümleri', ru_name: 'Овощи и садовая продукция', en_name: 'Vegetables and garden products', slug: 'gök-we-bakja-önümleri', storageId: 2, userId: 1 },
                { logo: 'image.jpg', tm_name: 'Süýt önümleri', ru_name: 'Молочные продукты', en_name: 'Dairy products', slug: 'süýt-önümleri', storageId: 2, userId: 1 },
                { logo: 'image.jpg', tm_name: 'Telefon', ru_name: 'Телефон', en_name: 'Phone', slug: 'telefon', storageId: 1, userId: 2 },
                { logo: 'image.jpg', tm_name: 'Telewizor', ru_name: 'Телевидение', en_name: 'Television', slug: 'telewizor', storageId: 1, userId: 5 },
                { logo: 'image.jpg', tm_name: 'Oglan aýakgap', ru_name: 'Мужская обувь', en_name: 'Men shoes', slug: 'oglan-aýakgap', storageId: 3, userId: 6 },
                { logo: 'image.jpg', tm_name: 'Gyz aýakgap', ru_name: 'Женская обувь', en_name: 'Women shoes', slug: 'gyz-aýakgap', storageId: 3, userId: 7 },
                { logo: 'image.jpg', tm_name: 'Kostýum', ru_name: 'Костюм', en_name: 'Costume', slug: 'kostýum', storageId: 4, userId: 8 }
            ]).then(() => { console.log('Categories created') }).catch((err) => { console.log(err) })

            await Models.Features.bulkCreate([
                { tm_name: 'renk', ru_name: 'цвет', en_name: 'color', userId: 1 },
                { tm_name: 'olceg', ru_name: 'измерение', en_name: 'dimension', userId: 2 },
                { tm_name: 'model', ru_name: 'модель', en_name: 'model', userId: 2 },
            ]).then(() => { console.log('Features created') }).catch((err) => { console.log(err) })

            await Models.FeatureDescriptions.bulkCreate([
                { desc: 'ak', featureId: 1, userId: 1 },
                { desc: 'gara', featureId: 1, userId: 1 },
                { desc: 'sary', featureId: 1, userId: 1 },
                { desc: 'gyzyl', featureId: 1, userId: 1 },
                { desc: 'Redmi', featureId: 3, userId: 2 },
                { desc: 'Samsung', featureId: 3, userId: 2 }
            ]).then(() => { console.log('Feature Descriptions created') }).catch((err) => { console.log(err) })

            await Models.Subcategories.bulkCreate([
                { logo: 'image.jpg', tm_name: 'Miweler', ru_name: 'Фрукты', en_name: 'Fruits', slug: 'miweler', categoryId: 1, userId: 1 },
                { logo: 'image.jpg', tm_name: 'Gök önümler', ru_name: 'Овощи', en_name: 'Vegetables', slug: 'gök-önümler', categoryId: 1, userId: 2 },
                { logo: 'image.jpg', tm_name: 'Ýumurtga', ru_name: 'Яйцо', en_name: 'An egg', slug: 'ýumurtga', categoryId: 2, userId: 5 },
                { logo: 'image.jpg', tm_name: 'Peýnir', ru_name: 'Сыр', en_name: 'Cheese', slug: 'peýnir', categoryId: 2, userId: 6 },
                { logo: 'image.jpg', tm_name: 'Öýjükli telefon', ru_name: 'Мобильный телефон', en_name: 'Mobile phone', slug: 'öýjükli-telefon', categoryId: 3, userId: 7 },
                { logo: 'image.jpg', tm_name: 'Sensor telefon', ru_name: 'Сенсорный телефон', en_name: 'Touchscreen phone', slug: 'sensor-telefon', categoryId: 3 },
                { logo: 'image.jpg', tm_name: 'Smart TV', ru_name: 'Смарт ТВ', en_name: 'Smart TV', slug: 'smart-tv', categoryId: 4, userId: 1 }
            ]).then(() => { console.log('Subcategories created') }).catch((err) => { console.log(err) })

            await Models.SubcategoryFeatures.bulkCreate([
                { subcategoryId: 6, featureId: 1, userId: 1 },
                { subcategoryId: 6, featureId: 3, userId: 1 },
                { subcategoryId: 7, featureId: 2, userId: 1 }
            ]).then(() => { console.log('Subcategory Features created') }).catch((err) => { console.log(err) })

            await Models.Subscriptions.bulkCreate([
                { name: 'simple', price: 100, order: 1, p_limit: 100, p_img_limit: 100, seller_banner_limit: 10, main_banner_limit: 1, ntf_limit: 10, smm_support: false, tech_support: false, voucher_limit: 10 },
                { name: 'middle', price: 200, order: 2, p_limit: 200, p_img_limit: 200, seller_banner_limit: 20, main_banner_limit: 2, ntf_limit: 20, smm_support: false, tech_support: false, voucher_limit: 20 },
                { name: 'big', price: 500, order: 3, p_limit: 300, p_img_limit: 300, seller_banner_limit: 30, main_banner_limit: 3, ntf_limit: 30, smm_support: false, tech_support: false, voucher_limit: 30 },
            ]).then(() => { console.log('Subscriptions created') }).catch((err) => { console.log(err) })

            await Models.Sellers.bulkCreate([
                { name: 'Mekan dukan1', store_number: 1, store_floor: 1, about: 'hosh geldiniz!', logo: 'test1.jpg', bg_img: 'bg.jpg', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '63755727', second_number: '63755728', userId: 3, categoryId: 1, subscriptionId: 1 },
                { name: 'Mekan dukan2', store_number: 2, store_floor: 1, about: 'hosh geldiniz!', logo: 'test2.jpg', bg_img: 'bg.jpg', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '63755729', second_number: '63755730', userId: 10, categoryId: 1, subscriptionId: 2 },
                { name: 'Mekan dukan3', store_number: 3, store_floor: 2, about: 'hosh geldiniz!', logo: 'test3.jpg', bg_img: 'bg.jpg', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '63755731', second_number: '63755732', userId: 11, categoryId: 3, subscriptionId: 3 }
            ]).then(() => { console.log('Sellers created') }).catch((err) => { console.log(err) })

            await Models.Products.bulkCreate([
                { tm_name: 'alma', ru_name: 'яблоко', en_name: 'apple', tm_desc: 'alma1', ru_desc: 'яблоко1', en_desc: 'apple1', slug: 'alma', barcode: 11111, stock_code: 'aaaaaa', quantity: 10, org_price: 20, sale_price: 19.90, subcategoryId: 1, brandId: 1, sellerId: 1 },
                { tm_name: 'apelsin', ru_name: 'апельсин', en_name: 'orange', tm_desc: 'apelsin1', ru_desc: 'апельсин1', en_desc: 'orange1', slug: 'apelsin', barcode: 22222, stock_code: 'bbbbb', quantity: 10, org_price: 20, sale_price: 19.90, subcategoryId: 1, brandId: 1, sellerId: 2 },
                { tm_name: 'banan', ru_name: 'банан', en_name: 'banana', tm_desc: 'banan1', ru_desc: 'банан1', en_desc: 'banana1', slug: 'banan', barcode: 33333, stock_code: 'ccccc', quantity: 10, org_price: 20, sale_price: 19.90, subcategoryId: 1, brandId: 1, sellerId: 2 },
                { tm_name: 'Galaxy-A12', ru_name: 'Галакси-А12', en_name: 'Galaxy-A12', tm_desc: 'Galaxy-A12 desc', ru_desc: 'Галакси-А12 1', en_desc: 'Galaxy-A12 desc', slug: 'galaxy-a12', barcode: 44444, stock_code: 'ddddd', quantity: 10, org_price: 2000, sale_price: 19000, subcategoryId: 6, brandId: 4, sellerId: 3 }
            ]).then(() => { console.log('Products created') }).catch((err) => { console.log(err) })

            await Models.ProductFeatures.bulkCreate([
                { productId: 4, fatureDescriptionId: 2 },
                { productId: 4, fatureDescriptionId: 6 }
            ]).then(() => { console.log('Product Features created') }).catch((err) => { console.log(err) })

            await Models.ProductReviews.bulkCreate([
                { star: 3, productId: 4, customerId: 1 },
                { star: 2, productId: 4, customerId: 2 },
                { star: 4, productId: 1, customerId: 2 },
                { star: 5, productId: 2, customerId: 2 },
                { star: 5, productId: 2, customerId: 1 }
            ]).then(() => { console.log('Product Reviews created') }).catch((err) => { console.log(err) })

            await Models.Orders.bulkCreate([
                { fullname: 'Mekan', phone: '63755727', address: 'Anew 27', order_id: '30-11-2023qwer7926', status: 'ondelivery', payment: 'cash', amount: 3, time: '30-11-2023 18:15', note: 'caltrak getirayin...', customerId: 1, productId: 1 },
                { fullname: 'Mekan', phone: '63755727', address: 'Anew 27', order_id: '30-11-2023tyui7926', status: 'ondelivery', payment: 'cash', amount: 1, time: '30-11-2023 18:17', note: 'bolow...', customerId: 2, productId: 1 },
                { fullname: 'Mekan', phone: '63755727', address: 'Anew 27', order_id: '30-11-2023tyui3219', status: 'ondelivery', payment: 'cash', amount: 3, time: '30-11-2023 18:17', note: 'bolow...', customerId: 2, productId: 2 },
            ]).then(() => { console.log('Orders created') }).catch((err) => { console.log(err) })

            await Models.Likes.bulkCreate([
                { customerId: 1, productId: 1 },
                { customerId: 1, productId: 2 },
                { customerId: 1, productId: 3 },
                { customerId: 2, productId: 1 },
                { customerId: 2, productId: 2 }
            ]).then(() => { console.log('Likes created') }).catch((err) => { console.log(err) })

            await Models.Offers.bulkCreate([
                { discount: 17.9, productId: 1, currency: 'manat' },
                { discount: 17.9, productId: 2, currency: 'manat' },
                { discount: 12.9, productId: 3, currency: 'manat' }
            ]).then(() => { console.log('Offers created') }).catch((err) => { console.log(err) })

            await Models.Comments.bulkCreate([
                { comment: 'gaty gowey', productId: 1, customerId: 1 },
                { comment: 'aldama gowy dal', productId: 1, customerId: 2 }
            ]).then(() => { console.log('Comments created') }).catch((err) => { console.log(err) })

            await Models.Addresses.bulkCreate([
                { address: 'Anew, 27-nji mekdep', customerId: 1, isDefault: false },
                { address: 'Kone polidin yany...', customerId: 1, isDefault: true }
            ]).then(() => { console.log('Addresses created') }).catch((err) => { console.log(err) })

            await Models.Coupons.bulkCreate([
                { tm_name: 'boss', ru_name: 'босс', en_name: 'boss', tm_desc: 'desc boss', ru_name: 'босс', en_name: 'desc boss', img: 'test1.jpg', conditions: 'on-register', limit: 10, start_date: '2023-12-21', end_date: '2023-12-22', isPublic: true },
                { tm_name: 'al', ru_name: 'босс', en_name: 'al', tm_desc: 'desc al', ru_name: 'босс', en_name: 'desc al', img: 'test2.jpg', conditions: 'on-follow', limit: 10, start_date: '2023-12-21', end_date: '2023-12-30', isPublic: false }
            ]).then(() => { console.log('Coupons created') }).catch((err) => { console.log(err) })

            await Models.GroupPermissions.bulkCreate([
                // ADMIN ROUTERS
                { url: '/api/admin/add/group', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/permission', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/storage', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/storage', method: 'POST', groupId: 2 },
                { url: '/api/admin/add/category', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/category', method: 'POST', groupId: 2 },
                { url: '/api/admin/add/subcategory', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/subcategory', method: 'POST', groupId: 2 },
                { url: '/api/admin/add/feature', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/feature', method: 'POST', groupId: 2 },
                { url: '/api/admin/add/feature/desc', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/feature/desc', method: 'POST', groupId: 2 },
                { url: '/api/admin/add/subcategory/feature', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/subcategory/feature', method: 'POST', groupId: 2 },
                { url: '/api/admin/add/brand', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/brand', method: 'POST', groupId: 2 },
                { url: '/api/admin/add/brand', method: 'POST', groupId: 3 },
                { url: '/api/admin/add/staff', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/subscription', method: 'POST', groupId: 1 },
                { url: '/api/admin/update/permission', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/subscription', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/brand', method: 'PUT', groupId: 1 },
                { url: '/api/admin/delete/group', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/permission', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/subscription', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/brand', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/storage', method: 'PUT', groupId: 1 },
                { url: '/api/admin/delete/category', method: 'PUT', groupId: 1 },
                { url: '/api/admin/delete/feature', method: 'PUT', groupId: 1 },
                { url: '/api/admin/delete/contact', method: 'PUT', groupId: 1 },
                { url: '/api/admin/delete/contact', method: 'PUT', groupId: 2 },
                { url: '/api/admin/all/groups', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/permissions', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/subscriptions', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/subscriptions', method: 'GET', groupId: 2 },
                { url: '/api/admin/all/contacts', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/contacts', method: 'GET', groupId: 2 },
                // USER ROUTERS
                { url: '/api/user/add/product/review', method: 'POST', groupId: 4 },
                { url: '/api/user/add/like', method: 'POST', groupId: 4 },
                { url: '/api/user/add/order', method: 'POST', groupId: 4 },
                { url: '/api/user/add/basket', method: 'POST', groupId: 4 },
                { url: '/api/user/add/follower', method: 'POST', groupId: 4 },
                { url: '/api/user/add/message', method: 'POST', groupId: 4 },
                { url: '/api/user/add/message', method: 'POST', groupId: 3 },
                { url: '/api/user/profile', method: 'GET', groupId: 4 },
                { url: '/api/user/basket', method: 'GET', groupId: 4 },
                { url: '/api/user/profile', method: 'GET', groupId: 4 },
                { url: '/api/user/all', method: 'GET', groupId: 1 },
                { url: '/api/user/all', method: 'GET', groupId: 2 },
                { url: '/api/user/likes', method: 'GET', groupId: 1 },
                { url: '/api/user/likes', method: 'GET', groupId: 2 },
                { url: '/api/user/likes', method: 'GET', groupId: 3 },
                { url: '/api/user/messages', method: 'GET', groupId: 3 },
                { url: '/api/user/messages', method: 'GET', groupId: 4 },
                { url: '/api/user/favorite', method: 'GET', groupId: 4 },
                { url: '/api/user/followed', method: 'GET', groupId: 1 },
                { url: '/api/user/followed', method: 'GET', groupId: 2 },
                { url: '/api/user/followed', method: 'GET', groupId: 4 },
                // SELLER ROUTERS
                { url: '/api/seller/register', method: 'POST', groupId: 4 },
                { url: '/api/seller/add/offer', method: 'POST', groupId: 3 },
                { url: '/api/seller/add/product/feature', method: 'POST', groupId: 3 },
                { url: '/api/seller', method: 'GET', groupId: 3 },
                { url: '/api/seller/all', method: 'GET', groupId: 1 },
                { url: '/api/seller/all', method: 'GET', groupId: 2 },
                { url: '/api/seller/orders', method: 'GET', groupId: 1 },
                { url: '/api/seller/orders', method: 'GET', groupId: 2 },
                { url: '/api/seller/orders', method: 'GET', groupId: 3 },
                { url: '/api/seller/order/detail', method: 'GET', groupId: 3 },
                { url: '/api/seller/update', method: 'PUT', groupId: 3 },
                { url: '/api/seller', method: 'DELETE', groupId: 3 },
                { url: '/api/seller/delete/product', method: 'DELETE', groupId: 3 },
                { url: '/api/seller/delete/product', method: 'DELETE', groupId: 1 },
                // BANNER ROUTERS
                { url: '/api/banner/add', method: 'POST', groupId: 1 },
                { url: '/api/banner/add', method: 'POST', groupId: 2 },
                { url: '/api/banner/add', method: 'POST', groupId: 3 },
                // COMMENT ROUTERS
                { url: '/api/comment/add', method: 'POST', groupId: 4 },
                // NOTIFICATIONS
                { url: '/api/notification/add', method: 'POST', groupId: 1 },
                { url: '/api/notification/add', method: 'POST', groupId: 2 },
                { url: '/api/notification/add', method: 'POST', groupId: 3 },
                // PRODUCT ROUTERS
                { url: '/api/product/add', method: 'POST', groupId: 3 },
                { url: '/api/product/add/feature', method: 'POST', groupId: 3 },
                { url: '/api/product/add/review', method: 'POST', groupId: 4 },
                { url: '/api/product/add/coupon', method: 'POST', groupId: 1 },
                { url: '/api/product/add/coupon', method: 'POST', groupId: 3 },
                // ADDRESS ROUTER
                { url: '/api/address/add', method: 'POST', groupId: 4 },
                { url: '/api/address/all', method: 'GET', groupId: 4 },
                { url: '/api/address', method: 'PUT', groupId: 4 },
                { url: '/api/address', method: 'DELETE', groupId: 4 },
            ]).then(() => { console.log('Permissions created') }).catch((err) => { console.log(err) })

            return Response.Created('Default maglumatlar döredildi!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new AdminService()