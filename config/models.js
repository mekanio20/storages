const { Sequelize, DataTypes } = require('sequelize')
const database = require('./database')

const Users = database.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(25), allowNull: false },
    last_ip: { type: DataTypes.STRING(15), allowNull: true }, // should be updated
    device_type: { type: DataTypes.STRING(100), allowNull: true }, // should be updated
    uuid: { type: DataTypes.UUID, allowNull: false, unique: true }, // should be updated
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isCustomer: { type: DataTypes.BOOLEAN, defaultValue: true },
    isSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
    isStaff: { type: DataTypes.BOOLEAN, defaultValue: false },
    isSuperAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const OTPS = database.define('otps', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    code: { type: DataTypes.STRING(6), allowNull: false },
    star_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    end_date: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    phone: { type: DataTypes.STRING(12), allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { updatedAt: false } )

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
    address: { type: DataTypes.STRING(100), allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Favorites = database.define('favorites', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
}, { updatedAt: false })

const Sellers = database.define('sellers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    store_number: { type: DataTypes.SMALLINT, allowNull: false },
    store_floor: { type: DataTypes.SMALLINT, allowNull: false },
    about: { type: DataTypes.STRING, allowNull: true },
    logo: { type: DataTypes.STRING(100), allowNull: false },
    bg_img: { type: DataTypes.STRING(100), defaultValue: 'bg.jpg' },
    color: { type: DataTypes.STRING(10), allowNull: false },
    seller_type: { type: DataTypes.ENUM({ values: ['in-opt', 'out-opt'] }), allowNull: false },
    sell_type: { type: DataTypes.ENUM({ values: ['wholesale', 'partial', 'both'] }), allowNull: false },
    instagram: { type: DataTypes.STRING(50), allowNull: true },
    tiktok: { type: DataTypes.STRING(50), allowNull: true },
    main_number: { type: DataTypes.STRING(12), allowNull: false },
    second_number: { type: DataTypes.STRING(12), allowNull: true },
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
    payment: { type: DataTypes.ENUM({ values: ['online', 'cash', 'terminal']} ), allowNull: false },
    amount: { type: DataTypes.FLOAT(2), allowNull: false },
    delivery: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } },
    note: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Subscriptions = database.define('subscriptions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    order: { type: DataTypes.SMALLINT, allowNull: false },
    p_limit: { type: DataTypes.SMALLINT, allowNull: false }, // product limit
    p_img_limit: { type: DataTypes.SMALLINT, allowNull: false }, // product image limit
    seller_banner_limit: { type: DataTypes.SMALLINT, allowNull: false },
    main_banner_limit: { type: DataTypes.SMALLINT, allowNull: false },
    ntf_limit: { type: DataTypes.SMALLINT, allowNull: false },
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
    attachment: { type: DataTypes.STRING(100), allowNull: true },
    time: { type: DataTypes.DATE, allowNull: false, validate: { isDate: true } }
}, { timestamps: false })

const Brands = database.define('brands', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    img: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Products = database.define('products', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100), allowNull: true },
    en_name: { type: DataTypes.STRING(100), allowNull: true },
    tm_desc: { type: DataTypes.STRING, allowNull: true },
    ru_desc: { type: DataTypes.STRING, allowNull: true },
    en_desc: { type: DataTypes.STRING, allowNull: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    barcode: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    stock_code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    quantity: { type: DataTypes.SMALLINT, defaultValue: 0 },
    org_price: { type: DataTypes.FLOAT(2), allowNull: false },
    sale_price: { type: DataTypes.FLOAT(2), allowNull: false },
    gender: { type: DataTypes.ENUM({ values: ['male', 'fmale', 'male-child', 'fmale-child', 'non-gender'] }), defaultValue: 'non-gender' },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductImages = database.define('product_images', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: true },
    order: { type: DataTypes.SMALLINT, allowNull: false },
    image: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductReviews = database.define('product_reviews', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    star: { type: DataTypes.ENUM({ values: ['1', '2', '3', '4', '5'] }), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductReviewImages = database.define('product_review_images', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    img: { type: DataTypes.STRING(100), allowNull: false, unique: true },
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
    desc: { type: DataTypes.STRING, allowNull: false },
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
    sort_order: { type: DataTypes.SMALLINT, allowNull: false },
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
    tm_desc: { type: DataTypes.STRING, allowNull: false },
    ru_desc: { type: DataTypes.STRING, allowNull: true },
    en_desc: { type: DataTypes.STRING, allowNull: true },
    img: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    conditions: { type: DataTypes.ENUM({ values: ['on-register', 'on-follow', 'min-buy'] }), allowNull: false },
    min_amount: { type: DataTypes.SMALLINT, allowNull: false },
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
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Categories = database.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100), unique: true },
    en_name: { type: DataTypes.STRING(100), unique: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Subcategories = database.define('subcategories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100) },
    en_name: { type: DataTypes.STRING(100) },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Features = database.define('features', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false },
    ru_name: { type: DataTypes.STRING(100), allowNull: true },
    en_name: { type: DataTypes.STRING(100), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const FeatureDescriptions = database.define('featur_descriptions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    desc: { type: DataTypes.STRING(50), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Groups = database.define('groups', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(20), allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const GroupPermissions = database.define('group_permissions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    url: { type: DataTypes.STRING(200), allowNull: false },
    method: { type: DataTypes.ENUM({ values: ['GET', 'POST', 'PUT', 'DELETE'] }), allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Likes = database.define('likes', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Comments = database.define('reviews', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    comment: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Baskets = database.define('baskets', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    quantity: { type: DataTypes.SMALLINT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Offers = database.define('offers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    promocode: { type: DataTypes.STRING(50), allowNull: true },
    discount: { type: DataTypes.FLOAT(2), allowNull: false },
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

const Followers = database.define('followers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

// Users -> GroupId 

Groups.hasMany(Users)
Users.belongsTo(Groups)

// OTPS -> UserId

Users.hasMany(OTPS)
OTPS.belongsTo(Users)

// Customers -> UserId

Users.hasMany(Customers)
Customers.belongsTo(Users)

// Addresses -> CustomerId

Customers.hasMany(Addresses)
Addresses.belongsTo(Customers)

// Favorites -> CustomerId, CategoryId

Customers.belongsToMany(Categories, { through: Favorites })
Categories.belongsToMany(Customers, { through: Favorites })

// Seller -> UserId

Users.hasMany(Sellers)
Sellers.belongsTo(Users)

// Seller -> CategoryId

Categories.hasMany(Sellers)
Sellers.belongsTo(Categories)

// Seller -> SubscriptionId

Subscriptions.hasMany(Sellers)
Sellers.belongsTo(Subscriptions)

// Orders -> CustomerId

Customers.hasMany(Orders)
Orders.belongsTo(Customers)

// Orders -> ProductId

Products.hasMany(Orders)
Orders.belongsTo(Products)

// Chats -> SellerId, CustomerId

Sellers.belongsToMany(Customers, { through: Chats })
Customers.belongsToMany(Sellers, { through: Chats })

// Messages -> ChatId

Chats.hasMany(Messages),
Messages.belongsTo(Chats)

// Products -> SubctegoryId,

Subcategories.hasMany(Products)
Products.belongsTo(Subcategories)

// Products -> BrandId,

Brands.hasMany(Products)
Products.belongsTo(Brands)

// Products -> SellerId,

Sellers.hasMany(Products)
Products.belongsTo(Sellers)

// ProductImages -> ProductId,

Products.hasMany(ProductImages)
ProductImages.belongsTo(Products)

// ProductReviews -> ProductId,

Products.hasMany(ProductReviews)
ProductReviews.belongsTo(Products)

// ProductReviews -> CustomerId,

Customers.hasMany(ProductReviews)
ProductReviews.belongsTo(Customers)

// ProductReviewImages -> ProductId,

Products.hasMany(ProductReviewImages)
ProductReviewImages.belongsTo(Products)

// ProductReviewImages -> CustomerId,

Customers.hasMany(ProductReviewImages)
ProductReviewImages.belongsTo(Customers)

// Contacts -> UserId

Users.hasMany(Contacts)
Contacts.belongsTo(Users)

// Notifications -> UserId

Users.hasMany(Notifications)
Notifications.belongsTo(Users)

// Banners -> UserId

Users.hasMany(Banners)
Banners.belongsTo(Users)

// Coupon -> SellerId

Sellers.hasMany(Coupons)
Coupons.belongsTo(Sellers)

// CouponItems -> CouponId

Coupons.hasMany(CouponItem)
CouponItem.belongsTo(Coupons)

// CouponItems -> CustomerId

Customers.hasMany(CouponItem)
CouponItem.belongsTo(Customers)

// Categories -> StorageId

Storages.hasMany(Categories)
Categories.belongsTo(Storages)

// Subcategories -> CategoryId

Categories.hasMany(Subcategories)
Subcategories.belongsTo(Categories)

// SubcategoryFeatures -> SubcategoryId, FeatureId 

Subcategories.belongsToMany(Features, { through: SubcategoryFeatures })
Features.belongsToMany(Subcategories, { through: SubcategoryFeatures })

// ProductsFeatures -> ProductId, FeatureDescriptionId 

Products.belongsToMany(FeatureDescriptions, { through: ProductsFeatures })
FeatureDescriptions.belongsToMany(Products, { through: ProductsFeatures })

// FeatureDescriptions -> FeatureId 

Features.hasMany(FeatureDescriptions)
FeatureDescriptions.belongsTo(Features)

// Likes -> ProductId 

Products.hasMany(Likes)
Likes.belongsTo(Products)

// Likes -> UserId 

Users.hasMany(Likes)
Likes.belongsTo(Users)

// GroupPermissions -> GroupId 

Groups.hasMany(GroupPermissions)
GroupPermissions.belongsTo(Groups)

// Baskets -> ProductId 

Products.hasMany(Baskets)
Baskets.belongsTo(Products)

// Baskets -> CustomerId 

Customers.hasMany(Baskets)
Baskets.belongsTo(Customers)

// Offers -> ProductId 

Products.hasMany(Offers)
Offers.belongsTo(Products)

module.exports = {
    Users, OTPS, Customers, Addresses, Favorites,
    Sellers, Orders, Subscriptions, Chats, Messages,
    Brands, Products, ProductImages, ProductReviews,
    ProductReviewImages, Contacts, Notifications, Banners,
    Coupons, CouponItem, Storages, Categories, Subcategories,
    Features, FeatureDescriptions, Groups, GroupPermissions,
    Likes, Comments, Baskets, Offers, SubcategoryFeatures,
    ProductsFeatures, Followers
}