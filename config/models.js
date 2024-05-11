const { Sequelize, DataTypes } = require('sequelize')
const database = require('./database')

const Users = database.define('users', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(12), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(150), allowNull: false },
    ip: { type: DataTypes.STRING(15), allowNull: true },
    device: { type: DataTypes.STRING(25), allowNull: true },
    uuid: { type: DataTypes.UUID, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    isCustomer: { type: DataTypes.BOOLEAN, defaultValue: false },
    isSeller: { type: DataTypes.BOOLEAN, defaultValue: false },
    isStaff: { type: DataTypes.BOOLEAN, defaultValue: false },
    isSuperAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

const Customers = database.define('customers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    img: { type: DataTypes.STRING, defaultValue: 'profile.jpg' },
    fullname: { type: DataTypes.STRING(40), allowNull: false },
    gender: { type: DataTypes.ENUM({ values: ['male', 'fmale'] }), allowNull: false },
    email: { type: DataTypes.STRING(50), allowNull: false, validate: { isEmail: true } },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Addresses = database.define('addresses', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    address: { type: DataTypes.STRING(100), allowNull: false },
    isDefault: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Sellers = database.define('sellers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    store_number: { type: DataTypes.SMALLINT, allowNull: false },
    store_floor: { type: DataTypes.SMALLINT, allowNull: false },
    about: { type: DataTypes.STRING, allowNull: true },
    logo: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    bg_img: { type: DataTypes.STRING(100), defaultValue: 'bg.jpg' },
    seller_type: { type: DataTypes.ENUM({ values: ['in-opt', 'out-opt'] }), allowNull: false },
    sell_type: { type: DataTypes.ENUM({ values: ['wholesale', 'partial', 'both'] }), allowNull: false },
    instagram: { type: DataTypes.STRING(50), allowNull: true },
    tiktok: { type: DataTypes.STRING(50), allowNull: true },
    main_number: { type: DataTypes.STRING(12), allowNull: false },
    second_number: { type: DataTypes.STRING(12), allowNull: true },
    isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

const Orders = database.define('orders', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    fullname: { type: DataTypes.STRING(40), allowNull: false },
    phone: { type: DataTypes.STRING(12), allowNull: false },
    address: { type: DataTypes.STRING(50), allowNull: false },
    order_id: { type: DataTypes.STRING(30), allowNull: false },
    status: { type: DataTypes.ENUM({ values: ['new', 'ondelivery', 'completed', 'cancelled'] }), allowNull: false },
    payment: { type: DataTypes.ENUM({ values: ['online', 'cash', 'terminal'] }), allowNull: false },
    amount: { type: DataTypes.INTEGER, allowNull: false },
    time: { type: DataTypes.STRING(20), allowNull: false },
    note: { type: DataTypes.STRING, allowNull: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Subscriptions = database.define('subscriptions', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    price: { type: DataTypes.INTEGER, allowNull: false },
    order: { type: DataTypes.SMALLINT, allowNull: false },
    p_limit: { type: DataTypes.SMALLINT, allowNull: false }, // product limit
    p_img_limit: { type: DataTypes.SMALLINT, allowNull: false }, // product image limit
    seller_banner_limit: { type: DataTypes.SMALLINT, allowNull: false },
    main_banner_limit: { type: DataTypes.SMALLINT, allowNull: false },
    ntf_limit: { type: DataTypes.SMALLINT, allowNull: false },
    voucher_limit: { type: DataTypes.SMALLINT, allowNull: false },
    smm_support: { type: DataTypes.BOOLEAN, allowNull: false },
    tech_support: { type: DataTypes.BOOLEAN, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Chats = database.define('chats', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

const Messages = database.define('messages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    attachment: { type: DataTypes.STRING(100), allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    sender: { type: DataTypes.INTEGER, allowNull: false },
    accepted: { type: DataTypes.INTEGER, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

const Brands = database.define('brands', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    slug: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    img: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    desc: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

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
    img: { type: DataTypes.STRING(255), allowNull: false },
    order: { type: DataTypes.SMALLINT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const ProductReviews = database.define('product_reviews', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    star: { type: DataTypes.SMALLINT, allowNull: false },
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

const Notifications = database.define('notifications', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    receivers: { type: DataTypes.ENUM({ values: ['all', 'my-customers'] }), allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    desc: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM({ values: ['on-wait', 'sent'], allowNull: false }) },
    // send_date: { type: DataTypes.DATE, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Banners = database.define('banners', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_img: { type: DataTypes.STRING(100), allowNull: false },
    ru_img: { type: DataTypes.STRING(100), allowNull: true },
    en_img: { type: DataTypes.STRING(100), allowNull: true },
    url: { type: DataTypes.STRING(100), allowNull: false, validate: { isUrl: true } },
    type: { type: DataTypes.ENUM({ values: ['home', 'product', 'profile', 'ad', 'category', 'etc'] }), allowNull: false },
    sort_order: { type: DataTypes.SMALLINT, allowNull: false },
    start_date: { type: DataTypes.DATE, allowNull: false },
    end_date: { type: DataTypes.DATE, allowNull: false },
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
    min_amount: { type: DataTypes.SMALLINT, allowNull: true },
    limit: { type: DataTypes.SMALLINT, allowNull: false },
    start_date: { type: DataTypes.STRING, allowNull: false },
    end_date: { type: DataTypes.STRING, allowNull: false },
    isPublic: { type: DataTypes.BOOLEAN, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

const CouponItem = database.define('coupon_item', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    isUsed: { type: DataTypes.BOOLEAN, allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

// ----------------------------------------------------------------------------

const Categories = database.define('categories', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    tm_name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    ru_name: { type: DataTypes.STRING(100), allowNull: true },
    en_name: { type: DataTypes.STRING(100), allowNull: true },
    logo: { type: DataTypes.STRING(100), allowNull: false },
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
    logo: { type: DataTypes.STRING(50), allowNull: false },
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

const FeatureDescriptions = database.define('feature_descriptions', {
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

const Comments = database.define('comments', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    comment: { type: DataTypes.STRING, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
}, { paranoid: true })

const Baskets = database.define('baskets', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    quantity: { type: DataTypes.SMALLINT, allowNull: false },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Offers = database.define('offers', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    // promocode: { type: DataTypes.STRING(50), allowNull: true },
    discount: { type: DataTypes.FLOAT(2), allowNull: false },
    currency: { type: DataTypes.ENUM({ values: ['manat', 'goterim'] }), allowNull: false },
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

const ProductFeatures = database.define('product_features', {
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

const Videos = database.define('videos', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    thumbnail: { type: DataTypes.STRING(100), defaultValue: 'thumbnail.png' },
    video: { type: DataTypes.STRING(100), allowNull: false },
    desc: { type: DataTypes.STRING, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, defaultValue: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const Tags = database.define('tags', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

const VideoTags = database.define('video_tags', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false, unique: true },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    updatedAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }
})

// Videos -> SellerId

Sellers.hasMany(Videos)
Videos.belongsTo(Sellers)

// Users -> GroupId 

Groups.hasMany(Users)
Users.belongsTo(Groups)

// Customers -> UserId

Users.hasOne(Customers)
Customers.belongsTo(Users)

// Addresses -> CustomerId

Customers.hasMany(Addresses)
Addresses.belongsTo(Customers)

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

Chats.hasMany(Messages)
Messages.belongsTo(Chats)

// Folowers -> SellerId, CustomerId

Customers.hasMany(Followers)
Followers.belongsTo(Customers)
// ---
Sellers.hasMany(Followers)
Followers.belongsTo(Sellers)

// Products -> SubcategoryId,

Subcategories.hasMany(Products)
Products.belongsTo(Subcategories)

// Products -> BrandId,

Brands.hasMany(Products)
Products.belongsTo(Brands)

// Brands -> UserId

Users.hasMany(Brands)
Brands.belongsTo(Users)

// Products -> SellerId,

Sellers.hasMany(Products)
Products.belongsTo(Sellers)

// Products -> CouponId

Coupons.hasMany(Products)
Products.belongsTo(Coupons)

// ProductImages -> ProductId,

Products.hasMany(ProductImages)
ProductImages.belongsTo(Products)

// ProductReviews -> ProductId,

Products.hasMany(ProductReviews)
ProductReviews.belongsTo(Products)

// ProductReviews -> CustomerId,

Customers.hasMany(ProductReviews)
ProductReviews.belongsTo(Customers)

// ProductReviewImages -> CommentId,

Comments.hasMany(ProductReviewImages)
ProductReviewImages.belongsTo(Comments)

// ProductReviewImages -> CustomerId,

Customers.hasMany(ProductReviewImages)
ProductReviewImages.belongsTo(Customers)

// Notifications -> UserId

Users.hasMany(Notifications)
Notifications.belongsTo(Users)

// Banners -> UserId

Users.hasMany(Banners)
Banners.belongsTo(Users)

// Coupon -> UserId

Users.hasMany(Coupons, { onDelete: "cascade" })
Coupons.belongsTo(Users)

// CouponItems -> CouponId

Coupons.hasMany(CouponItem, { onDelete: "cascade" })
CouponItem.belongsTo(Coupons)

// CouponItems -> CustomerId

Customers.hasMany(CouponItem)
CouponItem.belongsTo(Customers)

// Categories -> UserId

Users.hasMany(Categories)
Categories.belongsTo(Users)

// Subcategories -> UserId

Users.hasMany(Subcategories)
Subcategories.belongsTo(Users)

// Subcategories -> CategoryId

Categories.hasMany(Subcategories, { onDelete: "cascade" })
Subcategories.belongsTo(Categories)

// SubcategoryFeatures -> UserId

Users.hasMany(SubcategoryFeatures)
SubcategoryFeatures.belongsTo(Users)

// SubcategoryFeatures -> SubcategoryId, FeatureId

Subcategories.hasMany(SubcategoryFeatures)
SubcategoryFeatures.belongsTo(Subcategories)
// -----
Features.hasMany(SubcategoryFeatures)
SubcategoryFeatures.belongsTo(Features)

// ProductFeatures -> ProductId, FeatureDescriptionId 

Products.belongsToMany(FeatureDescriptions, { through: ProductFeatures })
FeatureDescriptions.belongsToMany(Products, { through: ProductFeatures })

// Features -> UserId

Users.hasMany(Features)
Features.belongsTo(Users)

// FeatureDescriptions -> UserId

Users.hasMany(FeatureDescriptions)
FeatureDescriptions.belongsTo(Users)

// FeatureDescriptions -> FeatureId 

Features.hasMany(FeatureDescriptions)
FeatureDescriptions.belongsTo(Features)

// Likes -> CustomerId, ProductId

Likes.belongsTo(Products, { foreignKey: 'productId' })
Likes.belongsTo(Customers, { foreignKey: 'customerId' })

// Comments -> CustomerId

Customers.hasMany(Comments)
Comments.belongsTo(Customers)

// Comments -> ProductId

Products.hasMany(Comments)
Comments.belongsTo(Products)

// GroupPermissions -> GroupId 

Groups.hasMany(GroupPermissions, { onDelete: "cascade" })
GroupPermissions.belongsTo(Groups)

// Baskets -> ProductId 

Products.hasMany(Baskets, { onDelete: "cascade" })
Baskets.belongsTo(Products)

// Baskets -> CustomerId 

Customers.hasMany(Baskets, { onDelete: "cascade" })
Baskets.belongsTo(Customers)

// Offers -> ProductId

Products.hasOne(Offers, { onDelete: "cascade" })
Offers.belongsTo(Products)

// VideoTags -> VideoId

Videos.hasMany(VideoTags)
VideoTags.belongsTo(Videos)

// VideosTags -> TagsId

Tags.hasMany(VideoTags)
VideoTags.belongsTo(Tags)

module.exports = {
    Users, Customers, Addresses,
    Sellers, Orders, Subscriptions, Chats, Messages,
    Brands, Products, ProductImages, ProductReviews,
    ProductReviewImages, Notifications, Banners,
    Coupons, CouponItem, Categories, Subcategories,
    Features, FeatureDescriptions, Groups, GroupPermissions,
    Likes, Comments, Baskets, Offers, SubcategoryFeatures,
    ProductFeatures, Followers, Videos, Tags, VideoTags
}