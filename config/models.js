const { Sequelize, DataTypes, DATE } = require('sequelize')
const database = require('./database')

const Users = database.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(20), allowNull: false },
    last_ip: { type: DataTypes.STRING(15), allowNull: false },
    device_type: { type: DataTypes.STRING, allowNull: false },
    uuid: { type: DataTypes.UUID, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isCustomer: { type: DataTypes.BOOLEAN, defaultValue: true },
    isSeller: { type: DataTypes.BOOLEAN, defaultValue: true },
    isStaff: { type: DataTypes.BOOLEAN, defaultValue: true },
    isSuperAdmin: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Customers = database.define('customers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    fullname: { type: DataTypes.STRING(40), allowNull: false },
    gender: { type: DataTypes.ENUM({ values: ['male', 'fmale'] }), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true, validate: { isEmail: true } },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Addresses = database.define('adresses', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Favorites = database.define('favorites', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { updatedAt: false })

const Sellers = database.define('sellers', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    store_number: { type: DataTypes.SMALLINT, allowNull: false },
    store_floor: { type: DataTypes.TINYINT, allowNull: false },
    about: { type: DataTypes.STRING, allowNull: true },
    logo: { type: DataTypes.STRING(100), allowNull: false },
    background_image: { type: DataTypes.STRING(100), allowNull: true },
    color: { type: DataTypes.STRING(10), allowNull: false },
    seller_type: { type: DataTypes.ENUM({ values: ['inOPT', 'outOPT'] }), allowNull: false },
    sell_type: { type: DataTypes.ENUM({ values: ['wholesale', 'partial', 'both'] }), allowNull: false },
    instagram_account: { type: DataTypes.STRING(50), allowNull: true },
    tiktok_account: { type: DataTypes.STRING(50), allowNull: true },
    phone_number_main: { type: DataTypes.STRING(12), allowNull: true },
    phone_number_secondary: { type: DataTypes.STRING(12), allowNull: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Orders = database.define('orders', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    fullname: { type: DataTypes.STRING(40), allowNull: false },
    phone: { type: DataTypes.STRING(12), allowNull: false },
    address: { type: DataTypes.STRING(50), allowNull: false },
    order_id: { type: DataTypes.STRING(20), allowNull: false },
    status: { type: DataTypes.ENUM({ values: ['new', 'inprocess', 'ondelivery', 'completed', 'cancelled'] }), allowNull: false },
    payment_type: { type: DataTypes.ENUM({ values: ['online', 'cash', 'terminal']} ), allowNull: false },
    total_amount: { type: DataTypes.FLOAT(2), allowNull: false },
    delivery_time: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    note: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})


const Subscriptions = database.define('subscriptions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    order: { type: DataTypes.SMALLINT, allowNull: false },
    product_limit: { type: DataTypes.SMALLINT, allowNull: false },
    product_image_limit: { type: DataTypes.SMALLINT, allowNull: false },
    seller_banner_limit: { type: DataTypes.SMALLINT, allowNull: false },
    main_banner_limit: { type: DataTypes.SMALLINT, allowNull: false },
    notification_limit: { type: DataTypes.SMALLINT, allowNull: false },
    smm_support: { type: DataTypes.BOOLEAN, allowNull: false },
    tech_support: { type: DataTypes.BOOLEAN, allowNull: false },
    voucher_limit: { type: DataTypes.BOOLEAN, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Chats = database.define('chats', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    chat_id: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    last_message: { type: DataTypes.DATE, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Messages = database.define('messages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    content: { type: DataTypes.STRING, allowNull: false },
    time: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    attachment: { type: DataTypes.STRING(100), allowNull: false }
}, { timestamps: false })

const Brands = database.define('brands', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    image: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Products = database.define('products', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100), allowNull: true },
    en_name: { type: DataTypes.STRING(100), allowNull: true },
    tm_description: { type: DataTypes.STRING, allowNull: true },
    ru_description: { type: DataTypes.STRING, allowNull: true },
    en_description: { type: DataTypes.STRING, allowNull: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    barcode: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    stock_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    quantity: { type: DataTypes.SMALLINT, defaultValue: 0 },
    original_price: { type: DataTypes.FLOAT(2), allowNull: false },
    sale_price: { type: DataTypes.FLOAT(2), allowNull: false },
    gender: { type: DataTypes.ENUM({ values: ['male', 'fmale', 'male-child', 'fmale-child', 'non-gender'] }), defaultValue: 'non-gender' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductImages = database.define('product_images', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: true },
    order: { type: DataTypes.TINYINT, allowNull: false },
    image: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductReviews = database.define('product_reviews', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    star: { type: DataTypes.ENUM({ values: [1, 2, 3, 4, 5] }), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductReviewImages = database.define('product_review_images', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    image: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Contacts = database.define('contacts', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    email: { type: DataTypes.STRING(50), allowNull: false, unique: true, validate: { isEmail: true } },
    fullname: { type: DataTypes.STRING(40), allowNull: false },
    message: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM({ values: ['new', 'ignored', 'spam', 'replied'], allowNull: false }) },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Notifications = database.define('notifications', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    receivers: { type: DataTypes.ENUM({ values: ['all', 'my-customers'] }), allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    description: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM({ values: ['new', 'on-wait', 'scheduled', 'sent'], allowNull: false }) },
    send_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Banners = database.define('banners', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_image: { type: DataTypes.STRING(100) },
    ru_image: { type: DataTypes.STRING(100) },
    en_image: { type: DataTypes.STRING(100) },
    url: { type: DataTypes.STRING(100), allowNull: false, validate: { isUrl: true } },
    type: { type: DataTypes.ENUM({ values: ['home', 'product', 'profile', 'ad', 'category', 'etc'] }), allowNull: false },
    sort_order: { type: DataTypes.TINYINT, allowNull: false },
    star_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    end_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Coupons = database.define('coupons', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100), allowNull: true },
    en_name: { type: DataTypes.STRING(100), allowNull: true },
    tm_description: { type: DataTypes.STRING, allowNull: false },
    ru_description: { type: DataTypes.STRING, allowNull: true },
    en_description: { type: DataTypes.STRING, allowNull: true },
    image: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    conditions: { type: DataTypes.ENUM({ values: ['on-register', 'on-follow', 'on-minimum-buy-amount'] }), allowNull: false },
    // minimum buy amount (example 200 tmt gecse)
    amount: { type: DataTypes.SMALLINT, allowNull: false },
    limit: { type: DataTypes.SMALLINT, allowNull: false },
    star_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    end_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const CouponItem = database.define('coupon_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    isUsed: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

































// ----------------------------------------------------------------------------

const Storages = database.define('storages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100) },
    en_name: { type: DataTypes.STRING(100) },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Categories = database.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100), unique: true },
    en_name: { type: DataTypes.STRING(100), unique: true },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Subcategories = database.define('subcategories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100) },
    en_name: { type: DataTypes.STRING(100) },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Features = database.define('features', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100), allowNull: true },
    en_name: { type: DataTypes.STRING(100), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const FeatureDescriptions = database.define('featur_descriptions', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

// const Products = database.define('products', {
//     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
//     tm_name: { type: DataTypes.STRING(100), allowNull: false },
//     ru_name: { type: DataTypes.STRING(100) },
//     en_name: { type: DataTypes.STRING(100) },
//     tm_description: { type: DataTypes.TEXT },
//     ru_description: { type: DataTypes.TEXT },
//     en_description: { type: DataTypes.TEXT },
//     slug: { type: DataTypes.STRING, allowNull: false, unique: true },
//     barcode: { type: DataTypes.STRING, allowNull: false, unique: true },
//     promocode: { type: DataTypes.STRING, allowNull: true, unique: true },
//     quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
//     original_price: { type: DataTypes.REAL, allowNull: false },
//     sale_price: { type: DataTypes.REAL, allowNull: false },
//     gender: { type: DataTypes.ENUM({ values: ['male', 'fmale', 'child', 'all'] }), defaultValue: 'all' },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
//     updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// })

// const ProductImages = database.define('product_images', {
//     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
//     image: { type: DataTypes.STRING, allowNull: false, unique: true },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
//     updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// })

const Shops = database.define('shops', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    shop_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    seller_name: { type: DataTypes.STRING(50), allowNull: false },
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    image: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    type: { type: DataTypes.ENUM({ values: ['wholesaler', 'retail'] }), defaultValue: 'retail' },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    order: { type: DataTypes.BOOLEAN, defaultValue: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ShopCards = database.define('shop_cards', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING, allowNull: false },
    ru_name: { type: DataTypes.STRING },
    en_name: { type: DataTypes.STRING },
    tm_description: { type: DataTypes.TEXT, allowNull: false },
    ru_description: { type: DataTypes.TEXT },
    en_description: { type: DataTypes.TEXT },
    price: { type: DataTypes.REAL, allowNull: false },
    discount: { type: DataTypes.REAL, allowNull: true },
    product_limit: { type: DataTypes.INTEGER },
    banner_limit: { type: DataTypes.INTEGER },
    notification_limit: { type: DataTypes.INTEGER },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

// const Brands = database.define('brands', {
//     id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
//     name: { type: DataTypes.STRING, allowNull: false },
//     image: { type: DataTypes.STRING, allowNull: false, unique: true },
//     description: { type: DataTypes.STRING, allowNull: true },
//     slug: { type: DataTypes.STRING, allowNull: false, unique: true },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
//     updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// })

const Roles = database.define('roles', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    role: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Groups = database.define('groups', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const GroupPermissions = database.define('group_permissions', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    url: { type: DataTypes.STRING, allowNull: false },
    method: { type: DataTypes.ENUM({ values: ['GET', 'POST', 'PUT', 'DELETE'] }), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Likes = database.define('likes', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Reviews = database.define('reviews', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    comment: { type: DataTypes.TEXT, allowNull: false },
    star: { type: DataTypes.REAL, allowNull: true },
    image: { type: DataTypes.STRING, allowNull: true, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Baskets = database.define('baskets', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

// const Orders = database.define('orders', {
//     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
//     name: { type: DataTypes.STRING, allowNull: false },
//     phone: { type: DataTypes.STRING, allowNull: false },
//     address: { type: DataTypes.STRING, allowNull: false },
//     detail: { type: DataTypes.TEXT, allowNull: true },
//     quantity: { type: DataTypes.INTEGER, allowNull: false },
//     suma: { type: DataTypes.INTEGER, allowNull: false },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
//     updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// })

// const Banners = database.define('banners', {
//     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
//     image: { type: DataTypes.STRING, allowNull: false, unique: true },
//     banner_url: { type: DataTypes.STRING, allowNull: false, validate: { isUrl: true } },
//     banner_type: { type: DataTypes.ENUM({ values: ['inner', 'public'] }), allowNull: false },
//     sort_order: { type: DataTypes.INTEGER, allowNull: false },
//     star_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
//     end_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
//     updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// })

// const Notifications = database.define('notifications', {
//     id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
//     tm_name: { type: DataTypes.STRING, allowNull: false },
//     ru_name: { type: DataTypes.STRING },
//     en_name: { type: DataTypes.STRING },
//     tm_description: { type: DataTypes.TEXT, allowNull: false },
//     ru_description: { type: DataTypes.TEXT },
//     en_description: { type: DataTypes.TEXT },
//     image: { type: DataTypes.STRING, unique: true },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
//     updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// })

const Offers = database.define('offers', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    promocode: { type: DataTypes.STRING, allowNull: true },
    discount_price: { type: DataTypes.REAL, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Vouchers = database.define('vouchers', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING, allowNull: false },
    ru_name: { type: DataTypes.STRING },
    en_name: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING, allowNull: false, validate: { isUrl: true } },
    tmt: { type: DataTypes.INTEGER, allowNull: false },
    start_time: { type: DataTypes.DATE, allowNull: false },
    end_time: { type: DataTypes.DATE, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

// const Messages = database.define('messages', {
//     id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique: true },
//     message: { type: DataTypes.TEXT, allowNull: false },
//     isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
//     createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
//     updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
// })

const VoucherItems = database.define('voucher_items', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const SubcategoryFeatures = database.define('subcategory_features', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductsFeatures = database.define('product_features', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const UserRoles = database.define('user_roles', {
    id: { type: DataTypes.INTEGER, allowNull: false, primaryKey: true, autoIncrement: true, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Followers = database.define('followers', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

Storages.hasMany(Categories)
Categories.belongsTo(Storages)

Categories.hasMany(Subcategories)
Subcategories.belongsTo(Categories)

Subcategories.belongsToMany(Features, { through: SubcategoryFeatures })
Features.belongsToMany(Subcategories, { through: SubcategoryFeatures })

Subcategories.hasMany(Products)
Products.belongsTo(Subcategories)

Brands.hasMany(Products)
Products.belongsTo(Brands)

Shops.hasMany(Products)
Products.belongsTo(Shops)

Products.belongsToMany(FeatureDescriptions, { through: ProductsFeatures })
FeatureDescriptions.belongsToMany(Products, { through: ProductsFeatures })

Features.hasMany(FeatureDescriptions)
FeatureDescriptions.belongsTo(Features)

Categories.hasMany(Shops)
Shops.belongsTo(Categories)

Products.hasMany(ProductImages)
ProductImages.belongsTo(Products)

ShopCards.hasMany(Shops)
Shops.belongsTo(ShopCards)

Products.hasMany(Reviews)
Reviews.belongsTo(Products)

Users.hasMany(Reviews)
Reviews.belongsTo(Users)

Products.hasMany(Likes)
Likes.belongsTo(Products)

Users.hasMany(Likes)
Likes.belongsTo(Users)

Users.belongsToMany(Roles, { through: UserRoles })
Roles.belongsToMany(Users, { through: UserRoles })

Groups.hasMany(Users)
Users.belongsTo(Groups)

Groups.hasMany(GroupPermissions)
GroupPermissions.belongsTo(Groups)

Products.hasMany(Baskets)
Baskets.belongsTo(Products)

Users.hasMany(Baskets)
Baskets.belongsTo(Users)

Products.hasMany(Orders)
Orders.belongsTo(Products)

Users.hasMany(Orders)
Orders.belongsTo(Users)

Products.hasMany(Offers)
Offers.belongsTo(Products)

Groups.hasMany(Banners)
Banners.belongsTo(Groups)

Groups.hasMany(Notifications)
Notifications.belongsTo(Groups)

Users.belongsToMany(Shops, { through: Followers })
Shops.belongsToMany(Users, { through: Followers })

Users.belongsToMany(Vouchers, { through: VoucherItems })
Vouchers.belongsToMany(Users, { through: VoucherItems })

Users.hasMany(Messages)
Messages.belongsTo(Users)

module.exports = {
    Storages, Categories, Subcategories,
    Features, FeatureDescriptions, Products,
    ProductImages, Shops, ShopCards, Brands,
    Users, Roles, Groups, GroupPermissions, Likes, Reviews,
    Baskets, Orders, Banners, Notifications,
    Offers, Vouchers, VoucherItems, Messages,
    SubcategoryFeatures, ProductsFeatures, UserRoles, Followers
}