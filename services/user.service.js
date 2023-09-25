const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const uuid = require('uuid')
const { Op } = require('sequelize')
const { Users, Groups, Storages, Categories, Subcategories, Brands, Customers } = require('../config/models')

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
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userLoginService(password, phone) {
        try {
            const user = await this.isExists(phone)
            if (user.length === 0) {
                return {
                    status: 401,
                    msg: 'user nod found',
                    msg_key: 'unauthorized',
                    detail: []
                }
            }
            const hash = await bcrypt.compare(password, user[0].password)
            if (hash) {
                const token = generateJwt(user[0].id, user.groupId)
                return {
                    status: 200,
                    msg: 'token matched',
                    msg_key: 'password is correct',
                    detail: user,
                    token: token
                }
            }
            return {
                status: 401,
                msg: 'token did not match',
                msg_key: 'password is incorrect',
                detail: []
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userRegisterService(oby, ip) {
        try {
            const user = await this.isExists(oby.phone)
            if (user.length > 0) {
                return {
                    status: 403,
                    msg: 'user found',
                    msg_key: 'already exist',
                    detail: []
                }
            }
            const hash = await bcrypt.hash(oby.password, 5)
            // let group_id = await Groups.findOne({ where: { name: 'USERS' }, attributes: ['id'] })
            // group_id = JSON.stringify(group_id)
            // group_id = Number(JSON.parse(group_id).id)
            const _user = await Users.create({
                phone: oby.phone,
                password: hash,
                last_ip: ip,
                device: oby.device
            })
            const token = generateJwt(_user.id, group_id)
            return {
                status: 201,
                msg: 'user registered',
                msg_key: 'created',
                detail: _user,
                token: token
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async customerRegisterService(oby) {
        try {
            const { fullname, gender, email, userId } = oby
            const customer = await Customers.create({
                fullname: fullname,
                gender: gender,
                email: email,
                userId: userId
            })
            return {
                status: 201,
                msg: 'customer registered',
                msg_key: 'created',
                detail: customer
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async userProfileService(id) {
        try {
            const user = await Users.findOne({ where: { id: id }, attributes: ['id', 'phone'] })
            if (!user) {
                return {
                    status: 403,
                    msg: 'user nod found',
                    msg_key: 'unauthorized',
                    detail: []
                }
            }
            return {
                status: 200,
                msg: 'user found',
                msg_key: 'authorized',
                detail: user
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async sendOtpService(phone) {
        try {
            const _phone = phone
            const _otp = generateOTP()
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
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
                }
            })
            if (storages.length > 0) {
                return {
                    status: 200,
                    msg: 'storages were sent',
                    msg_key: 'success',
                    detail: storages
                }
            }
            return {
                status: 404,
                msg: 'storages nod found',
                msg_key: 'unsuccess',
                detail: storages
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
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
                }
            })
            if (categories.length > 0) {
                return {
                    status: 200,
                    msg: 'categories were sent',
                    msg_key: 'success',
                    detail: categories
                }
            }
            return {
                status: 404,
                msg: 'categories nod found',
                msg_key: 'unsuccess',
                detail: categories
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async allBrandListService() {
        try {
            const brands = await Brands.findAll({ attributes: { exclude: ['desc', 'createdAt', 'updatedAt'] }, where: { isActive: true } })
            if (brands.length > 0) {
                return {
                    status: 200,
                    msg: 'brands were sent',
                    msg_key: 'success',
                    detail: brands
                }
            }
            return {
                status: 404,
                msg: 'brands nod found',
                msg_key: 'unsuccess',
                detail: brands
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

    async defaultCreateService() {
        try {
            await Groups.bulkCreate([
                { name: 'USERS' },
                { name: 'SELLERS' },
                { name: 'STAFF' },
                { name: 'ADMINS' },
                { name: 'SUPERADMINS' }
            ]).then(() => { console.log('Groups created') }).catch((err) => { console.log(err) })

            await Users.bulkCreate([
                { phone: '+99361111111', password: 'user1', last_ip: '127.0.0.1', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111112', password: 'user2', last_ip: '127.0.0.2', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111113', password: 'user3', last_ip: '127.0.0.3', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111114', password: 'user4', last_ip: '127.0.0.4', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111115', password: 'user5', last_ip: '127.0.0.5', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111116', password: 'user6', last_ip: '127.0.0.6', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111117', password: 'user7', last_ip: '127.0.0.7', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111118', password: 'user8', last_ip: '127.0.0.8', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111119', password: 'user9', last_ip: '127.0.0.9', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 },
                { phone: '+99361111121', password: 'user10', last_ip: '127.0.0.10', device_type: 'mobile', uuid: uuid.v4(), groupId: 1 }
            ]).then(() => { console.log('Users created') }).catch((err) => { console.log(err) })

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

            return {
                status: 201,
                msg: 'all registered',
                msg_key: 'created',
                detail: []
            }
        } catch (error) {
            throw { status: 500, msg: error.message, msg_key: error.name, detail: [] }
        }
    }

}

module.exports = new UserService()