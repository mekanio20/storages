const Redis = require('ioredis')
const redis = new Redis({
    host: "localhost",
    port: 6379,
    password: "storages_redis6379",
})

redis.on('ready', () => { console.log('Redis connected...') })

module.exports = redis