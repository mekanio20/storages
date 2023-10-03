const Response = require('../services/response.service')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const { Op } = require('sequelize')
const { Users, Groups, Storages, Categories, Subcategories, Brands, Customers, OTPS, Sellers, Contacts, Subscriptions, Products } = require('../config/models')

const generateJwt = (id, group) => {
    return jwt.sign({ id, group }, process.env.PRIVATE_KEY, { expiresIn: '30d' })
}
const generateOTP = () => {
    return Math.floor(Math.random() * 10000)
}

class UserService {

    async isExists(phone) {
        try {
            return Users.findAll({
                where: {
                    [Op.or]: {
                        phone: phone
                    }
                },
                attributes: ['id', 'password', 'phone', 'groupId']
            })
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

    async userLoginService(phone, password) { // should be updated
        try {
            const user = await this.isExists(phone)
            if (user.length === 0) {
                return Response.Unauthorized('Ulanyjy tapylmady!', [])
            }
            const hash = await bcrypt.compare(password, user[0].password)
            if (hash) {
                const token = generateJwt(user.id, user.groupId)
                let response = Response.Success('Üstünlikli!', user)
                response.token = token
                return response
            }
            return Response.Unauthorized('Parol nädogry!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async forgotPasswordService(phone, orgPass, verifPass) { // should be updated
        try {
            if (orgPass !== verifPass) {
                return Response.BadRequest('Parol nädogry!', [])
            }
            const user = await this.isExists(phone)
            if (user.length === 0) {
                return Response.Unauthorized('Ulanyjy tapylmady!', [])
            }
            return {}
            // send otp
            // -------------
            // -------------
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userRegisterService(oby, ip) { // should be updated
        try {
            const user = await this.isExists(oby.phone)
            if (user.length > 0) {
                return Response.Forbidden('Ulanyjy hasaba alynan!', [])
            }
            const hash = await bcrypt.hash(oby.password, 5)
            const groupId = await this.getGroupId('USERS')
            const _user = await Users.create({
                phone: oby.phone,
                password: hash,
                ip: ip,
                device: oby.device,
                uuid: uuid.v4(),
                groupId: groupId
            })
            const token = generateJwt(_user.id, groupId)
            let response = await Response.Created('Ulanyjy hasaba alyndy!', _user)
            response.token = token
            return response
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async customerRegisterService(oby, userId) {
        try {
            const { fullname, gender, email } = oby
            const customer = await Customers.findOne({ where: { email: email } })
            if (customer.length > 0) {
                return Response.Forbidden('Ulanyjy hasaba bolan!', [])
            }
            const _customer = await Customers.create({
                fullname: fullname,
                gender: gender,
                email: email,
                userId: userId
            })
            await Users.update({ isCustomer: true }, { where: { id: userId } })
            return Response.Created('Ulanyjy hasaba alyndy!', _customer)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userProfileService(id) {
        try {
            const user = await Customers.findOne({
                where: { userId: id },
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: {
                    model: Users,
                    attributes: ['id', 'phone']
                }
            })
            if (!user) { return Response.NotFound('Ulanyjy tapylmady!', []) }
            return Response.Success('Üstünlikli!', user)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sendOtpService(phone) { // should be updated
        try {
            const _phone = phone
            const _otp = generateOTP()
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allStorageListService() {
        try {
            const storages = await Storages.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { isActive: true },
                include: {
                    model: Categories,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    where: { isActive: true },
                    include: {
                        model: Subcategories,
                        attributes: { exclude: ['createdAt', 'updatedAt'] },
                        where: { isActive: true }
                    }
                },
                order: [['id', 'DESC']]
            })
            if (storages.length > 0) {
                return Response.Success('Üstünlikli!', storages)
            }
            return Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allCategoryService() {
        try {
            const categories = await Categories.findAll({
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                where: { isActive: true },
                include: {
                    model: Subcategories,
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                    where: { isActive: true }
                },
                order: [['id', 'DESC']]
            })
            if (categories.length > 0) {
                return Response.Success('Üstünlikli!', categories)
            }
            return Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allBrandListService() {
        try {
            const brands = await Brands.findAll({
                attributes: { exclude: ['desc', 'createdAt', 'updatedAt'] },
                where: { isActive: true },
                order: [['id', 'DESC']]
            })
            if (brands.length > 0) {
                return Response.Success('Üstünlikli!', brands)
            }
            return Response.NotFound('Maglumat tapylmady!', [])
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async addContactService(oby) {
        try {
            const contact = await Contacts.create({
                phone: oby.phone,
                email: oby.email,
                fullname: oby.fullname,
                message: oby.message,
                userId: oby.userId || null
            })
            return Response.Created('Maglumat ugradyldy!', contact)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async productSearchService(search) {
        try {
            let page = search.page || 1
            let limit = search.limit || 10
            let offset = page * limit - limit
            if (search.name) {
                search = [
                    { tm_name: { [Op.iLike]: `%${search.name}%` } },
                    { ru_name: { [Op.iLike]: `%${search.name}%` } },
                    { en_name: { [Op.iLike]: `%${search.name}%` } },
                    { tm_desc: { [Op.iLike]: `%${search.name}%` } },
                    { ru_desc: { [Op.iLike]: `%${search.name}%` } },
                    { en_desc: { [Op.iLike]: `%${search.name}%` } }
                ]
            } else { search = [] }
            const product = await Products.findAll({
                where: {
                    isActive: true,
                    [Op.or]: search
                },
                attributes: { exclude: ['gender', 'isActive', 'createdAt', 'updatedAt'] },
                limit: Number(limit),
                offset: Number(offset),
                order: [['id', 'DESC']]
            })
            return Response.Success('Gozleg netijesi...', product)
        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async defaultCreateService() {
        try {
            await Groups.bulkCreate([
                { name: 'USERS' },
                { name: 'SELLERS' },
                { name: 'STAFF' },
                { name: 'SUPERADMIN' }
            ]).then(() => { console.log('Groups created') }).catch((err) => { console.log(err) })

            await Users.bulkCreate([
                { phone: '+99361111111', password: 'user1', last_ip: '127.0.0.1', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111112', password: 'user2', last_ip: '127.0.0.2', device_type: 'mobile', uuid: uuid.v4(), groupId: 2 },
                { phone: '+99361111113', password: 'user3', last_ip: '127.0.0.3', device_type: 'mobile', uuid: uuid.v4(), groupId: 3 },
                { phone: '+99361111114', password: 'user4', last_ip: '127.0.0.4', device_type: 'mobile', uuid: uuid.v4(), groupId: 4 },
                { phone: '+99361111115', password: 'user5', last_ip: '127.0.0.5', device_type: 'mobile', uuid: uuid.v4(), groupId: 2 },
                { phone: '+99361111116', password: 'user6', last_ip: '127.0.0.6', device_type: 'mobile', uuid: uuid.v4(), groupId: 2 },
                { phone: '+99361111117', password: 'user7', last_ip: '127.0.0.7', device_type: 'mobile', uuid: uuid.v4(), groupId: 2 },
                { phone: '+99361111118', password: 'user8', last_ip: '127.0.0.8', device_type: 'mobile', uuid: uuid.v4(), groupId: 2 },
                { phone: '+99361111119', password: 'user9', last_ip: '127.0.0.9', device_type: 'mobile', uuid: uuid.v4(), groupId: 2 },
                { phone: '+99361111121', password: 'user10', last_ip: '127.0.0.10', device_type: 'mobile', uuid: uuid.v4(), groupId: 2 }
            ]).then(() => { console.log('Users created') }).catch((err) => { console.log(err) })

            await Brands.bulkCreate([
                { name: 'addidas', slug: 'addidas', img: 'test1.jpg', desc: 'abcdefg', userId: 1 },
                { name: 'pumma', slug: 'pumma', img: 'test2.jpg', desc: 'abcdefg', userId: 2 }
            ]).then(() => { console.log('Brands created') }).catch((err) => { console.log(err) })

            await Storages.bulkCreate([
                { tm_name: 'Elektronika', ru_name: 'Электроника', en_name: 'Electronics', slug: 'elektronika' },
                { tm_name: 'Supermarket', ru_name: 'Супермаркет', en_name: 'Supermarket', slug: 'supermarket' },
                { tm_name: 'Aýakgap & Sumka', ru_name: 'Сумка & Обувь', en_name: 'Shoes & Bag', slug: 'aýakgap-&-sumka' },
                { tm_name: 'Egin-Eşikler', ru_name: 'Одежда', en_name: 'Clothes', slug: 'egin-eşikler' },
                { tm_name: 'Sport Geýimler', ru_name: 'Спортивная Одежда', en_name: 'Sportswear', slug: 'sport-geýimler' },
                { tm_name: 'Kosmetika önümleri', ru_name: 'Косметическая Продукция', en_name: 'Cosmetic Products', slug: 'kosmetika-önümleri' }
            ]).then(() => { console.log('Storages created') }).catch((err) => { console.log(err) })

            await Categories.bulkCreate([
                { tm_name: 'Gök we bakja önümleri', ru_name: 'Овощи и садовая продукция', en_name: 'Vegetables and garden products', slug: 'gök-we-bakja-önümleri', storageId: 2 },
                { tm_name: 'Süýt önümleri', ru_name: 'Молочные продукты', en_name: 'Dairy products', slug: 'süýt-önümleri', storageId: 2 },
                { tm_name: 'Telefon', ru_name: 'Телефон', en_name: 'Phone', slug: 'telefon', storageId: 1 },
                { tm_name: 'Telewizor', ru_name: 'Телевидение', en_name: 'Television', slug: 'telewizor', storageId: 1 },
                { tm_name: 'Oglan aýakgap', ru_name: 'Мужская обувь', en_name: 'Men shoes', slug: 'oglan-aýakgap', storageId: 3 },
                { tm_name: 'Gyz aýakgap', ru_name: 'Женская обувь', en_name: 'Women shoes', slug: 'gyz-aýakgap', storageId: 3 },
                { tm_name: 'Kostýum', ru_name: 'Костюм', en_name: 'Costume', slug: 'kostýum', storageId: 4 }
            ]).then(() => { console.log('Categories created') }).catch((err) => { console.log(err) })

            await Subcategories.bulkCreate([
                { tm_name: 'Miweler', ru_name: 'Фрукты', en_name: 'Fruits', slug: 'miweler', categoryId: 1 },
                { tm_name: 'Gök önümler', ru_name: 'Овощи', en_name: 'Vegetables', slug: 'gök-önümler', categoryId: 1 },
                { tm_name: 'Ýumurtga', ru_name: 'Яйцо', en_name: 'An egg', slug: 'ýumurtga', categoryId: 2 },
                { tm_name: 'Peýnir', ru_name: 'Сыр', en_name: 'Cheese', slug: 'peýnir', categoryId: 2 },
                { tm_name: 'Öýjükli telefon', ru_name: 'Мобильный телефон', en_name: 'Mobile phone', slug: 'öýjükli-telefon', categoryId: 3 },
                { tm_name: 'Smart TV', ru_name: 'Смарт ТВ', en_name: 'Smart TV', slug: 'smart-tv', categoryId: 4 }
            ]).then(() => { console.log('Subcategories created') }).catch((err) => { console.log(err) })

            await Subscriptions.bulkCreate([
                { name: 'simple', order: 1, p_limit: 100, p_img_limit: 100, seller_banner_limit: 10, main_banner_limit: 1, ntf_limit: 10, smm_support: false, tech_support: false, voucher_limit: 10 },
                { name: 'middle', order: 2, p_limit: 200, p_img_limit: 200, seller_banner_limit: 20, main_banner_limit: 2, ntf_limit: 20, smm_support: false, tech_support: false, voucher_limit: 20 },
                { name: 'big', order: 3, p_limit: 300, p_img_limit: 300, seller_banner_limit: 30, main_banner_limit: 3, ntf_limit: 30, smm_support: false, tech_support: false, voucher_limit: 30 },
            ]).then(() => { console.log('Subscriptions created') }).catch((err) => { console.log(err) })

            await Sellers.bulkCreate([
                { name: 'Mekan dukan1', store_number: 1, store_floor: 1, about: 'hosh geldiniz!', logo: 'test1.jpg', bg_img: 'bg.jpg', color: '#111', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '+99363755727', second_number: '+99363755728', userId: 2, categoryId: 1, subscriptionId: 1 },
                { name: 'Mekan dukan2', store_number: 2, store_floor: 1, about: 'hosh geldiniz!', logo: 'test2.jpg', bg_img: 'bg.jpg', color: '#111', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '+99363755729', second_number: '+99363755730', userId: 5, categoryId: 2, subscriptionId: 2 },
                { name: 'Mekan dukan3', store_number: 3, store_floor: 1, about: 'hosh geldiniz!', logo: 'test3.jpg', bg_img: 'bg.jpg', color: '#111', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '+99363755731', second_number: '+99363755732', userId: 6, categoryId: 3, subscriptionId: 2 },
                { name: 'Mekan dukan4', store_number: 4, store_floor: 1, about: 'hosh geldiniz!', logo: 'test4.jpg', bg_img: 'bg.jpg', color: '#111', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '+99363755733', second_number: '+99363755734', userId: 7, categoryId: 4, subscriptionId: 2 },
                { name: 'Mekan dukan5', store_number: 5, store_floor: 1, about: 'hosh geldiniz!', logo: 'test5.jpg', bg_img: 'bg.jpg', color: '#111', seller_type: 'in-opt', sell_type: 'partial', instagram: 'https://instagram.com/mekan', tiktok: 'https://tiktok.com/mekan', main_number: '+99363755735', second_number: '+99363755736', userId: 8, categoryId: 5, subscriptionId: 3 }
            ]).then(() => { console.log('Sellers created') }).catch((err) => { console.log(err) })

            await Products.bulkCreate([
                { tm_name: 'alma', ru_name: 'яблоко', en_name: 'apple', tm_desc: 'alma1', ru_desc: 'яблоко1', en_desc: 'apple1', slug: 'alma', barcode: 11111, stock_code: 'aaaaaa', quantity: 10, org_price: 20, sale_price: 19.90, subcategoryId: 1, brandId: 1, sellerId: 1 },
                { tm_name: 'apelsin', ru_name: 'апельсин', en_name: 'orange', tm_desc: 'apelsin1', ru_desc: 'апельсин1', en_desc: 'orange1', slug: 'apelsin', barcode: 22222, stock_code: 'bbbbb', quantity: 10, org_price: 20, sale_price: 19.90, subcategoryId: 1, brandId: 1, sellerId: 1 },
                { tm_name: 'banan', ru_name: 'банан', en_name: 'banana', tm_desc: 'banan1', ru_desc: 'банан1', en_desc: 'banana1', slug: 'banan', barcode: 33333, stock_code: 'ccccc', quantity: 10, org_price: 20, sale_price: 19.90, subcategoryId: 1, brandId: 1, sellerId: 1 }
            ]).then(() => { console.log('Products created') }).catch((err) => { console.log(err) })

            return Response.Created('Default maglumatlar döredildi!', [])

        } catch (error) {
            throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new UserService()