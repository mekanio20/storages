const { createClient } = require('redis')
let client = {}

async function start() {
    client = await createClient()
        .on('error', err => console.log('Redis client error', err))
        .on('connect', () => console.log('Redis connected...') )
}
start()

module.exports = client