const Redis = require('ioredis')
const redis = new Redis({
    host: "localhost",
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASS,
})

redis.on('ready', () => { console.log('Redis connected...') })

module.exports = redis