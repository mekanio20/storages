const express = require('express')
const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server)
const helmet = require('helmet')

require('./ioredis')
require('dotenv').config()
const port = process.env.PORT || 3001

const vhost = (hostname) => (req, res, next) => {
  const host = req.headers.host.split(':')[0]
  if (host == hostname) { next() } 
  else { return res.status(401).send('Invalid host') }
}

let clients = []

app.use(express.json())
app.disable('x-powered-by')
app.use(vhost('localhost'))

app.use(helmet())
app.use(helmet.hidePoweredBy())
app.use(helmet({ crossOriginOpenerPolicy: true }))
app.use(helmet.contentSecurityPolicy({ useDefaults: true, directives: { 'script-src': ['self', 'securecoding.com'], 'style-src': null }}))
app.use(helmet.expectCt({ maxAge: 96400, enforce: true, reportUri: 'https://google.com' }))
app.use(helmet.dnsPrefetchControl({ allow: true }))
app.use(helmet.frameguard({ action: 'deny' }))
app.use(helmet.hsts({ maxAge: 123456, includeSubDomains: false }))
app.use(helmet.ieNoOpen())
app.use(helmet.noSniff())
app.use(helmet.referrerPolicy({ policy: ['origin', 'unsafe-url'] }))
app.use(helmet.xssFilter())

const start = async () => {
  server.listen(port, () => console.log(`Server is running: http://localhost:${port}`))

  app.use((req, res, next) => {
    req.io = io 
    next()
  })
  
  io.on('connect', onConnect)

  async function onConnect (socket) {
    console.log('new client ==> ', socket.id)
    
    socket.on('otpsender', async (data) => {
      console.log('new opt sender ==> ', data)
    })

    socket.on('message', (data)=>{
      console.log('message data ==> ', data)
    })

    ///// sms sended
    socket.on('sended', async (data) => {
      console.log('sended chanel ==> ', socket.id)
      const index = clients.findIndex(x => x.id === socket.id)
      clients[index].busy = false
    })
    
    //// on disconnect
    socket.on('disconnect', async function() {
      console.log('disconnect ==> ', socket.id)
      let arr = clients.filter((c) => c.id !== socket.id)
      clients = arr
      clients = clients.filter((c) => c.id !== socket.id)
    })
  }
}

start()

// SEND OTP PASSWORD //
app.post('/otp', async function (req, res) {
  try {
    console.log('1. Otp route --> ', req.body)
    const random= Math.random().toFixed(4).substring(2)
    const _phone= req.body.phone
    console.log('2. Phone, Random --> ', _phone, random)
    req.io.emit('otp', { phone: `+993${_phone}`, pass: `OPTOVOY: ${random}` })
    console.log('3. Otp emit io...')
    let data = { phone: _phone, pass: random }
    return res.json(data)
  } catch (error) {
    throw { status: 500, type: 'error', msg: error.message, msg_key: error.name, detail: [] }
  }  
})