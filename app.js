const cors = require('cors')
const morgan = require('morgan')
const express = require('express')
const session = require('express-session')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const socketIo = require('socket.io')
const helmet = require('helmet')
const path = require('path')
const http = require('http')
const fs = require('fs')

require('./ioredis')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001

const server = http.createServer(app)
var io = require('socket.io')(server)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
})

io.on('connection', (socket) => {
  console.log(`new client connected with id ==> ${socket.id}`)
  socket.emit("test", "Salam!")
})

require('./config/models')
const database = require('./config/database')
const router = require('./routers/index.router')

app.disable('x-powered-by')
app.use(cors({ origin: true }))
app.use(helmet())

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('common', { stream: accessLogStream }))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 }
}))

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Library API",
            version: "1.0.0",
            description: "Swagger JavaScript document"
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ["./routers/documents.js"]
}
const specs = swaggerJsDoc(options)

app.use('/api', router)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.all('*', (req, res) => { return res.status(404).sendFile(`${path.join(__dirname + '/public/404.html')}`) })

server.listen(port, async () => {
    try {
        await database.authenticate()
        await database.sync({})
        console.log('Database connected...')
        console.log(`Server is running: http://localhost:${port}`)
    } catch (error) {
        throw error
    }
})