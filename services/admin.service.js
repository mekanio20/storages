const Verification = require('../helpers/verification.service')
const Functions = require('../helpers/functions.service')
const Response = require('../helpers/response.service')
const Models = require('../config/models')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { Sequelize } = require('sequelize')

class AdminService {
    // POST
    async adminLoginService(body) {
        try {
            const user = await Verification.isExists(body.phone)
            if (!user) { return Response.Unauthorized('Admin tapylmady!', []) }
            const hash = await bcrypt.compare(body.password, user.password)
            if (!hash) { return Response.Forbidden('Telefon nomeri ya-da parol nädogry!', []) }
            const token = await Functions.generateJwt(user.id, user.groupId)
            delete user.dataValues.password
            user.dataValues.token = token
            return Response.Success('Admin hasaba alyndy!', user)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async addStaffService(userId) {
        try {
            const groupId = await Models.Groups.findOne({ where: { name: 'STAFF' }, attributes: ['id'] })
            if (!groupId) { return Response.NotFound('Beýle grupba yok!', []) }
            const staff = await Models.Users.findOne({ where: { id: Number(userId), isStaff: true } })
            if (staff.length > 0) { return Response.BadRequest('Admin döredilen!', []) }
            await Models.Users.update({ isStaff: true, isCustomer: false, isSeller: false, groupId: groupId.id }, { where: { id: Number(userId) } })
            const token = await Functions.generateJwt(userId, groupId.id)
            let response = await Response.Created('Admin hasaba alyndy!', [])
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // GET
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
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allFeatureDescriptionsService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            let whereState = { isActive: true }
            if (q.status === 'all') { whereState = {} }
            if (q.featureId) { whereState.featureId = q.featureId }
            const featureDescriptions = await Models.FeatureDescriptions.findAndCountAll({
                where: whereState,
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', order]]
            }).catch((err) => { console.log(err) })
            if (featureDescriptions.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', featureDescriptions)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allSubcategoryFeaturesService(q) {
        try {
            let page = q.page || 1
            let limit = q.limit || 10
            let offset = page * limit - limit
            let order = q.order || 'desc'
            let whereState = { isActive: true }
            if (q.status === 'all') { whereState = {} }
            if (q.subcategoryId) { whereState.subcategoryId = q.subcategoryId }
            const subcategory_features = await Models.SubcategoryFeatures.findAndCountAll({
                attributes: ['id', 'isActive', 'createdAt', 'updatedAt'],
                where: whereState,
                include: [
                    {
                        model: Models.Features,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive'],
                        where: { isActive: true }
                    },
                    {
                        model: Models.Subcategories,
                        attributes: ['id', 'tm_name', 'ru_name', 'en_name', 'isActive'],
                        where: { isActive: true }
                    }
                ],
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', order]]
            }).catch((err) => { console.log(err) })
            if (subcategory_features.count == 0) { return Response.NotFound('Maglumat tapylmady!', []) }
            return Response.Success('Üstünlikli!', subcategory_features)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async allSystemsService() {
        try {
            const user_systems = await Models.Users.findAll({
                attributes: ['device', [Sequelize.fn('COUNT', Sequelize.col('device')), 'count']],
                group: ['device']
            }).catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', user_systems)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async registerStatisticService() {
        try {
            const users = await Models.Users.findAll({
                attributes: [
                  [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'date'],
                  [Sequelize.fn('COUNT', Sequelize.col('id')), 'userCount']
                ],
                group: [Sequelize.fn('DATE', Sequelize.col('createdAt'))]
              }).catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', users)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // UPDATE
    async updateUserService(body) {
        try {
            const obj = {}
            const superadmin = await Models.Users.findOne({ where: { id: body.id, isSuperAdmin: true } })
            if (superadmin) { return Response.Forbidden('Rugsat edilmedi!', []) }
            for (const item in body) {
                if (item && item !== 'id' && item !== 'isSuperadmin') {
                    obj[item] = body[item]
                }
            }
            await Models.Users.update(obj, { where: { id: Number(body.id) } })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    // DELETE
    async deleteUserService(id) {
        try {
            const superadmin = await Models.Users.findOne({ where: { id: id, isSuperAdmin: true } })
            if (superadmin) { return Response.Forbidden('Rugsat edilmedi!', []) }
            await Models.Users.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async deleteCustomerService(id) {
        try {
            const customer = await Models.Customers.findOne({ where: { id: id } })
            if (!customer) { return Response.NotFound('Müşderi tapylmady!', []) }
            await Models.Users.update({ isCustomer: false }, { where: { id: customer.userId } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            await Models.Customers.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

    async deleteSellerService(id) {
        try {
            const seller = await Models.Sellers.findOne({ where: { id: id } })
            if (!seller) { return Response.NotFound('Satyjy tapylmady!', []) }
            await Models.Users.update({ isSeller: false }, { where: { id: seller.userId } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            await Models.Sellers.destroy({ where: { id: Number(id) } })
                .then(() => { console.log(true) })
                .catch((err) => { console.log(err) })
            return Response.Success('Üstünlikli!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
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
                { phone: '61111111', password: passwords[0], ip: '127.0.0.1', device: 'Android', uuid: uuid.v4(), groupId: 1, isSuperAdmin: true, createdAt: new Date("2024-01-28") },
                { phone: '61111112', password: passwords[1], ip: '127.0.0.2', device: 'Mac OS', uuid: uuid.v4(), groupId: 2, isStaff: true, createdAt: new Date("2024-01-28") },
                { phone: '61111113', password: passwords[2], ip: '127.0.0.3', device: 'iPhone', uuid: uuid.v4(), groupId: 3, isSeller: true, createdAt: new Date("2024-01-28") },
                { phone: '61111114', password: passwords[3], ip: '127.0.0.4', device: 'Android', uuid: uuid.v4(), groupId: 4, isCustomer: true, createdAt: new Date("2024-01-29") },
                { phone: '61111115', password: passwords[4], ip: '127.0.0.5', device: 'Windows', uuid: uuid.v4(), groupId: 2, isStaff: true, createdAt: new Date("2024-01-29") },
                { phone: '61111116', password: passwords[5], ip: '127.0.0.6', device: 'iPhone', uuid: uuid.v4(), groupId: 2, isStaff: true, createdAt: new Date("2024-01-29") },
                { phone: '61111117', password: passwords[6], ip: '127.0.0.7', device: 'Android', uuid: uuid.v4(), groupId: 2, isStaff: true, createdAt: new Date("2024-01-29") },
                { phone: '61111118', password: passwords[7], ip: '127.0.0.8', device: 'iPhone', uuid: uuid.v4(), groupId: 2, isStaff: true, createdAt: new Date("2024-01-30") },
                { phone: '61111119', password: passwords[8], ip: '127.0.0.9', device: 'Windows', uuid: uuid.v4(), groupId: 4, isCustomer: true, createdAt: new Date("2024-01-30") },
                { phone: '61111121', password: passwords[9], ip: '127.0.0.10', device: 'Android', uuid: uuid.v4(), groupId: 3, isSeller: true, createdAt: new Date("2024-01-30") },
                { phone: '61111122', password: passwords[10], ip: '127.0.0.11', device: 'Mac OS', uuid: uuid.v4(), groupId: 3, isSeller: true, createdAt: new Date("2024-02-1") }
            ]).then(() => { console.log('Users created') }).catch((err) => { console.log(err) })

            await Models.Customers.bulkCreate([
                { fullname: 'Akmuhammet Nurmuradow', gender: 'male', email: 'akmuhammednumuradow@gmail.com', userId: 4 },
                { fullname: 'Muhammetnazar Alymow', gender: 'male', email: 'marcurLorry@gmail.com', userId: 9 }
            ]).then(() => { console.log('Customers created') }).catch((err) => { console.log(err) })

            await Models.Brands.bulkCreate([
                { name: 'miweler', slug: 'miweler', img: 'test1.jpg', desc: 'abcdefg', isActive: true, userId: 1 },
                { name: 'addidas', slug: 'addidas', img: 'test2.jpg', desc: 'abcdefg', isActive: true, userId: 1 },
                { name: 'pumma', slug: 'pumma', img: 'test3.jpg', desc: 'abcdefg', isActive: true, userId: 2 },
                { name: 'galaxy', slug: 'galaxy', img: 'test4.jpg', desc: 'abcdefg', isActive: true, userId: 2 },
                { name: 'brendsiz', slug: 'brendsiz', img: 'test5.jpg', desc: 'abcdefg', isActive: true, userId: 1 },
            ]).then(() => { console.log('Brands created') }).catch((err) => { console.log(err) })

            await Models.Categories.bulkCreate([
                { logo: 'image.jpg', tm_name: 'Gök we bakja önümleri', ru_name: 'Овощи и садовая продукция', en_name: 'Vegetables and garden products', slug: 'gök-we-bakja-önümleri', userId: 1 },
                { logo: 'image.jpg', tm_name: 'Süýt önümleri', ru_name: 'Молочные продукты', en_name: 'Dairy products', slug: 'süýt-önümleri', userId: 1 },
                { logo: 'image.jpg', tm_name: 'Telefon', ru_name: 'Телефон', en_name: 'Phone', slug: 'telefon', userId: 2 },
                { logo: 'image.jpg', tm_name: 'Telewizor', ru_name: 'Телевидение', en_name: 'Television', slug: 'telewizor', userId: 5 },
                { logo: 'image.jpg', tm_name: 'Oglan aýakgap', ru_name: 'Мужская обувь', en_name: 'Men shoes', slug: 'oglan-aýakgap', userId: 6 },
                { logo: 'image.jpg', tm_name: 'Gyz aýakgap', ru_name: 'Женская обувь', en_name: 'Women shoes', slug: 'gyz-aýakgap', userId: 7 },
                { logo: 'image.jpg', tm_name: 'Kostýum', ru_name: 'Костюм', en_name: 'Costume', slug: 'kostýum', userId: 8 },
                { logo: 'image.jpg', tm_name: 'Batnik', slug: 'batnik', userId: 8 },
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
                { logo: 'image.jpg', tm_name: 'Smart TV', ru_name: 'Смарт ТВ', en_name: 'Smart TV', slug: 'smart-tv', categoryId: 4, userId: 1 },
                { logo: 'image.jpg', tm_name: 'Kici maykalar', slug: 'kici-maykalar', categoryId: 8, userId: 1 }
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
                { name: 'Mekan dukan1', store_number: 1, store_floor: 1, about: 'hosh geldiniz!', logo: 'test1.jpg', bg_img: 'bg.jpg', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '63755727', second_number: '63755728', userId: 3, categoryId: 1, subscriptionId: 1, isVerified: true },
                { name: 'Mekan dukan2', store_number: 2, store_floor: 1, about: 'hosh geldiniz!', logo: 'test2.jpg', bg_img: 'bg.jpg', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '63755729', second_number: '63755730', userId: 10, categoryId: 1, subscriptionId: 2, isVerified: true },
                { name: 'Mekan dukan3', store_number: 3, store_floor: 2, about: 'hosh geldiniz!', logo: 'test3.jpg', bg_img: 'bg.jpg', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '63755731', second_number: '63755732', userId: 11, categoryId: 3, subscriptionId: 3, isVerified: true }
            ]).then(() => { console.log('Sellers created') }).catch((err) => { console.log(err) })

            await Models.Products.bulkCreate([
                { tm_name: 'alma', ru_name: 'яблоко', en_name: 'apple', tm_desc: 'alma1', ru_desc: 'яблоко1', en_desc: 'apple1', slug: 'alma', barcode: 11111, stock_code: 'aaaaaa', quantity: 10, org_price: 10, sale_price: 20, final_price: 20, subcategoryId: 1, brandId: 1, sellerId: 1, model_code: 891748124719 },
                { tm_name: 'apelsin', ru_name: 'апельсин', en_name: 'orange', tm_desc: 'apelsin1', ru_desc: 'апельсин1', en_desc: 'orange1', slug: 'apelsin', barcode: 22222, stock_code: 'bbbbb', quantity: 10, org_price: 20, sale_price: 25, dis_price: 3, final_price: 22, subcategoryId: 1, brandId: 1, sellerId: 2, model_code: 891748124719 },
                { tm_name: 'banan', ru_name: 'банан', en_name: 'banana', tm_desc: 'banan1', ru_desc: 'банан1', en_desc: 'banana1', slug: 'banan', barcode: 33333, stock_code: 'ccccc', quantity: 10, org_price: 60, sale_price: 100, dis_type: 'goterim', dis_price: 10, final_price: 90, subcategoryId: 1, brandId: 1, sellerId: 2, model_code: 891748124719 },
                { tm_name: 'Galaxy-A12', ru_name: 'Галакси-А12', en_name: 'Galaxy-A12', tm_desc: 'Galaxy-A12 desc', ru_desc: 'Галакси-А12 1', en_desc: 'Galaxy-A12 desc', slug: 'galaxy-a12', barcode: 44444, stock_code: 'ddddd', quantity: 10, org_price: 2000, sale_price: 19000, dis_price: 6000, final_price: 13000, subcategoryId: 6, brandId: 4, sellerId: 3, model_code: 891748124718 },
                { tm_name: 'Ak batnik', tm_desc: 'Ak batnik desc', slug: 'ak-batnik', barcode: 55555, stock_code: 'eeeeee', quantity: 2, org_price: 1000, sale_price: 1200, dis_price: 100, final_price: 1100, subcategoryId: 8, brandId: 5, sellerId: 1, model_code: 3123718927381 },
            ]).then(() => { console.log('Products created') }).catch((err) => { console.log(err) })

            await Models.ProductImages.bulkCreate([
                { img: "download.jpeg", productId: 1 },
                { img: "download.jpeg", productId: 1 },
                { img: "download.jpeg", productId: 1 },
            ]).then(() => { console.log('Products images created') }).catch((err) => { console.log(err) })

            await Models.ProductFeatures.bulkCreate([
                { productId: 4, featureDescriptionId: 2 },
                { productId: 4, featureDescriptionId: 6 }
            ]).then(() => { console.log('Product Features created') }).catch((err) => { console.log(err) })

            await Models.Comments.bulkCreate([
                { comment: 'Eýýý muň ysyneý gaty gowy ekena gyşda sepinaýsen muny göni däli guş bolýan duz ursun.', customerId: 1, productId: 1 },
                { comment: 'Gaty gowy ysy bar tüweleme Ärime aldym gaty begendi. Size maslahadym alyň şu atyry herkimi begendiriň.', customerId: 2, productId: 1 },
            ]).then(() => { console.log('Comments created') }).catch((err) => { console.log(err) })

            await Models.ProductReviews.bulkCreate([
                { star: 3, productId: 4, customerId: 1 },
                { star: 2, productId: 4, customerId: 2 },
                { star: 4, productId: 1, customerId: 2 },
                { star: 5, productId: 2, customerId: 2 },
                { star: 5, productId: 2, customerId: 1 }
            ]).then(() => { console.log('Product Reviews created') }).catch((err) => { console.log(err) })

            await Models.ProductReviewImages.bulkCreate([
                { img: 'test1.jpg', customerId: 2, commentId: 2 },
                { img: 'test2.jpg', customerId: 2, commentId: 2 },
                { img: 'test3.jpg', customerId: 2, commentId: 2 }
            ]).then(() => { console.log('Product Review Images created') }).catch((err) => { console.log(err) })

            await Models.Orders.bulkCreate([
                { fullname: 'Mekan', phone: '63755727', address: 'Anew 27', order_id: '30-11-2023qwer7926', status: 'completed', payment: 'cash', amount: 3, time: '30-12-2023 18:15', note: 'caltrak getirayin...', customerId: 1, productId: 1 },
                { fullname: 'Mekan', phone: '63755727', address: 'Anew 27', order_id: '30-11-2023tyui7926', status: 'completed', payment: 'cash', amount: 1, time: '30-12-2023 18:17', note: 'bolow...', customerId: 2, productId: 1 },
                { fullname: 'Mekan', phone: '63755727', address: 'Anew 27', order_id: '30-11-2023tyui3219', status: 'completed', payment: 'cash', amount: 3, time: '30-12-2023 18:17', note: 'bolow...', customerId: 2, productId: 2 },
            ]).then(() => { console.log('Orders created') }).catch((err) => { console.log(err) })

            await Models.Likes.bulkCreate([
                { customerId: 1, productId: 1 },
                { customerId: 1, productId: 2 },
                { customerId: 1, productId: 3 },
                { customerId: 2, productId: 1 },
                { customerId: 2, productId: 2 }
            ]).then(() => { console.log('Likes created') }).catch((err) => { console.log(err) })

            await Models.Comments.bulkCreate([
                { comment: 'gaty gowey', productId: 1, customerId: 1 },
                { comment: 'aldama gowy dal', productId: 1, customerId: 2 }
            ]).then(() => { console.log('Comments created') }).catch((err) => { console.log(err) })

            await Models.Addresses.bulkCreate([
                { address: 'Anew, 27-nji mekdep', customerId: 1, isDefault: false },
                { address: 'Kone polidin yany...', customerId: 1, isDefault: true }
            ]).then(() => { console.log('Addresses created') }).catch((err) => { console.log(err) })

            await Models.Coupons.bulkCreate([
                { tm_name: 'boss', ru_name: 'босс', en_name: 'boss', tm_desc: 'desc boss', ru_name: 'босс', en_name: 'desc boss', img: 'test1.jpg', conditions: 'on-register', limit: 10, start_date: new Date('2023-08-20'), end_date: new Date('2024-08-20'), isPublic: true, userId: 3 },
                { tm_name: 'al', ru_name: 'босс', en_name: 'al', tm_desc: 'desc al', ru_name: 'босс', en_name: 'desc al', img: 'test2.jpg', conditions: 'on-follow', limit: 10, start_date: new Date('2023-08-20'), end_date: new Date('2024-08-20'), isPublic: false, userId: 10 }
            ]).then(() => { console.log('Coupons created') }).catch((err) => { console.log(err) })

            await Models.Banners.bulkCreate([
                { tm_img: 'test1.jpg', url: 'http://1.1.1.1', type: 'ad', sort_order: 1, start_date: new Date('2023-08-20'), end_date: new Date('2024-08-20'), userId: 1 },
                { tm_img: 'test2.jpg', url: 'http://1.1.1.2', type: 'home', sort_order: 1, start_date: new Date('2023-08-20'), end_date: new Date('2024-08-20'), userId: 1 },
                { tm_img: 'test3.jpg', url: 'http://1.1.1.3', type: 'category', sort_order: 1, start_date: new Date('2023-08-20'), end_date: new Date('2024-08-20'), userId: 1 },
                { tm_img: 'test4.jpg', url: 'http://1.1.1.4', type: 'product', sort_order: 1, start_date: new Date('2023-08-20'), end_date: new Date('2024-08-20'), userId: 1 },
                { tm_img: 'test5.jpg', url: 'http://1.1.1.5', type: 'profile', sort_order: 1, start_date: new Date('2023-08-20'), end_date: new Date('2024-08-20'), userId: 3 },
            ]).then(() => { console.log('Banner created') }).catch((err) => { console.log(err) })

            await Models.Notifications.bulkCreate([
                { receivers: 'all', title: 'test1', desc: 'test desc', status: 'on-wait', userId: 1 },
                { receivers: 'all', title: 'test2', desc: 'test desc', status: 'on-wait', userId: 1 },
                { receivers: 'all', title: 'test3', desc: 'test desc', status: 'on-wait', userId: 1 },
            ]).then(() => { console.log('Notifications created') }).catch((err) => { console.log(err) })

            await Models.Followers.bulkCreate([
                { customerId: 1, sellerId: 1 },
                { customerId: 2, sellerId: 1 },
                { customerId: 1, sellerId: 2 },
                { customerId: 2, sellerId: 2 }
            ]).then(() => { console.log('Followers created') }).catch((err) => { console.log(err) })

            await Models.Videos.bulkCreate([
                { thumbnail: 'ff8fbd1f-46ae-40b6-b5c7-8937339a2f46-semseddin.png', video: '65b5711c-2f95-4e79-82d6-5e2e00bdfd9d-semseddin.mp4', desc: 'Shemseddin arabaya bin!', isActive: true, sellerId: 1 },
                { thumbnail: '7000845a-ef51-4f70-b46a-537b8b32facc-ronaldo.png', video: '7000845a-ef51-4f70-b46a-537b8b32facc-ronaldo.mp4', desc: 'Ronalda gaharjan yigit', isActive: true, sellerId: 2 },
                { thumbnail: '6fbfcd05-c272-462d-9500-b5c2291560e3-sakar.png', video: '6fbfcd05-c272-462d-9500-b5c2291560e3-sakar.mp4', desc: 'Ysnat ishgar', isActive: true, sellerId: 3 },
            ]).then(() => { console.log('Videos created') }).catch((err) => { console.log(err) })

            await Models.GroupPermissions.bulkCreate([
                // ADMIN ROUTERS
                { url: '/api/admin/add/group', method: 'POST', groupId: 1 },
                { url: '/api/admin/add/permission', method: 'POST', groupId: 1 },
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
                { url: '/api/admin/update/group', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/permission', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/subscription', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/brand', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/category', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/category', method: 'PUT', groupId: 2 },
                { url: '/api/admin/update/subcategory', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/subcategory', method: 'PUT', groupId: 2 },
                { url: '/api/admin/update/user', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/seller', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/product', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/product', method: 'PUT', groupId: 2 },
                { url: '/api/admin/update/comment', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/comment', method: 'PUT', groupId: 2 },
                { url: '/api/admin/update/feature', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/feature', method: 'PUT', groupId: 2 },
                { url: '/api/admin/update/feature/descriptions', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/feature/descriptions', method: 'PUT', groupId: 2 },
                { url: '/api/admin/update/subcategory/feature', method: 'PUT', groupId: 1 },
                { url: '/api/admin/update/subcategory/feature', method: 'PUT', groupId: 2 },
                { url: '/api/admin/delete/group', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/permission', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/subscription', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/brand', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/category', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/subcategory', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/user', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/customer', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/seller', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/feature', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/feature/desc', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/delete/subcategory/feature', method: 'DELETE', groupId: 1 },
                { url: '/api/admin/all/groups', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/permissions', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/subscriptions', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/subscriptions', method: 'GET', groupId: 2 },
                { url: '/api/admin/all/contacts', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/contacts', method: 'GET', groupId: 2 },
                { url: '/api/admin/all/features', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/features', method: 'GET', groupId: 2 },
                { url: '/api/admin/all/features', method: 'GET', groupId: 3 },
                { url: '/api/admin/feature/descriptions', method: 'GET', groupId: 1 },
                { url: '/api/admin/feature/descriptions', method: 'GET', groupId: 2 },
                { url: '/api/admin/feature/descriptions', method: 'GET', groupId: 3 },
                { url: '/api/admin/all/systems', method: 'GET', groupId: 1 },
                { url: '/api/admin/all/systems', method: 'GET', groupId: 2 },
                { url: '/api/admin/register/statistic', method: 'GET', groupId: 1 },
                { url: '/api/admin/register/statistic', method: 'GET', groupId: 2 },
                // USER ROUTERS
                { url: '/api/user/add/product/review', method: 'POST', groupId: 4 },
                { url: '/api/user/add/like', method: 'POST', groupId: 4 },
                { url: '/api/user/add/order', method: 'POST', groupId: 4 },
                { url: '/api/user/add/basket', method: 'POST', groupId: 4 },
                { url: '/api/user/add/follower', method: 'POST', groupId: 4 },
                { url: '/api/user/add/message', method: 'POST', groupId: 4 },
                { url: '/api/user/add/message', method: 'POST', groupId: 3 },
                { url: '/api/user/all', method: 'GET', groupId: 1 },
                { url: '/api/user/all', method: 'GET', groupId: 2 },
                { url: '/api/user/messages', method: 'GET', groupId: 3 },
                { url: '/api/user/messages', method: 'GET', groupId: 4 },
                { url: '/api/user/logout', method: 'GET', groupId: 4 },
                // SELLER ROUTERS
                { url: '/api/seller/register', method: 'POST', groupId: 4 },
                { url: '/api/seller/all', method: 'GET', groupId: 1 },
                { url: '/api/seller/all', method: 'GET', groupId: 2 },
                { url: '/api/seller/orders', method: 'GET', groupId: 1 },
                { url: '/api/seller/orders', method: 'GET', groupId: 2 },
                { url: '/api/seller/orders', method: 'GET', groupId: 3 },
                { url: '/api/seller/statistic', method: 'GET', groupId: 3 },
                { url: '/api/seller/videos', method: 'GET', groupId: 1 },
                { url: '/api/seller/videos', method: 'GET', groupId: 2 },
                { url: '/api/seller/videos', method: 'GET', groupId: 3 },
                { url: '/api/seller/videos', method: 'GET', groupId: 4 },
                { url: '/api/seller/update', method: 'PUT', groupId: 3 },
                { url: '/api/seller/delete', method: 'DELETE', groupId: 3 },
                // BANNER ROUTERS
                { url: '/api/banner/add', method: 'POST', groupId: 1 },
                { url: '/api/banner/add', method: 'POST', groupId: 2 },
                { url: '/api/banner/add', method: 'POST', groupId: 3 },
                { url: '/api/banner/all', method: 'GET', groupId: 1 },
                { url: '/api/banner/all', method: 'GET', groupId: 2 },
                { url: '/api/banner/all', method: 'GET', groupId: 3 },
                { url: '/api/banner', method: 'DELETE', groupId: 1 },
                // COMMENT ROUTERS
                { url: '/api/comment/add', method: 'POST', groupId: 4 },
                { url: '/api/comment', method: 'DELETE', groupId: 1 },
                { url: '/api/comment', method: 'DELETE', groupId: 4 },
                // NOTIFICATIONS
                { url: '/api/notification/add', method: 'POST', groupId: 1 },
                { url: '/api/notification/add', method: 'POST', groupId: 2 },
                { url: '/api/notification/add', method: 'POST', groupId: 3 },
                { url: '/api/notification/all', method: 'GET', groupId: 1 },
                { url: '/api/notification/update', method: 'PUT', groupId: 1 },
                { url: '/api/notification', method: 'DELETE', groupId: 1 },
                // PRODUCT ROUTERS
                { url: '/api/product/add', method: 'POST', groupId: 3 },
                { url: '/api/product/add/feature', method: 'POST', groupId: 3 },
                { url: '/api/product/add/review', method: 'POST', groupId: 4 },
                { url: '/api/product/add/coupon', method: 'POST', groupId: 3 },
                { url: '/api/product/add/offer', method: 'POST', groupId: 3 },
                { url: '/api/product/likes', method: 'GET', groupId: 1 },
                { url: '/api/product/likes', method: 'GET', groupId: 2 },
                { url: '/api/product/likes', method: 'GET', groupId: 3 },
                { url: '/api/product/search/history', method: 'GET', groupId: 4 },
                { url: '/api/product', method: 'DELETE', groupId: 1 },
                { url: '/api/product', method: 'DELETE', groupId: 3 },
                // ADDRESS ROUTER
                { url: '/api/address/add', method: 'POST', groupId: 4 },
                { url: '/api/address/all', method: 'GET', groupId: 4 },
                { url: '/api/address', method: 'PUT', groupId: 4 },
                { url: '/api/address', method: 'DELETE', groupId: 4 },
                // CUSTOMER ROUTER
                { url: '/api/customer/register', method: 'POST', groupId: 4 },
                { url: '/api/customer/all', method: 'GET', groupId: 1 },
                { url: '/api/customer/all', method: 'GET', groupId: 2 },
                { url: '/api/customer/favorite', method: 'GET', groupId: 1 },
                { url: '/api/customer/favorite', method: 'GET', groupId: 4 },
                { url: '/api/customer/basket', method: 'GET', groupId: 1 },
                { url: '/api/customer/basket', method: 'GET', groupId: 4 },
                { url: '/api/customer/followed', method: 'GET', groupId: 1 },
                { url: '/api/customer/followed', method: 'GET', groupId: 2 },
                { url: '/api/customer/followed', method: 'GET', groupId: 4 },
                { url: '/api/customer/orders', method: 'GET', groupId: 1 },
                { url: '/api/customer/orders', method: 'GET', groupId: 2 },
                { url: '/api/customer/orders', method: 'GET', groupId: 4 },
                { url: '/api/customer/profile', method: 'GET', groupId: 4 },
                { url: '/api/customer/edit', method: 'PUT', groupId: 4 },
                // VIDEO ROUTER
                { url: '/api/video/add', method: 'POST', groupId: 3 },
                { url: '/api/video', method: 'GET', groupId: 4 },
                { url: '/api/video', method: 'GET', groupId: 3 },
                { url: '/api/video', method: 'GET', groupId: 2 },
                { url: '/api/video', method: 'GET', groupId: 1 },
            ]).then(() => { console.log('Permissions created') }).catch((err) => { console.log(err) })

            return Response.Created('Default maglumatlar döredildi!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error, detail: [] }
        }
    }

}

module.exports = new AdminService()