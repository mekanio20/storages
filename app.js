const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const swaggerJsDoc = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const helmet = require('helmet')
const path = require('path')
const fs = require('fs')

require('dotenv').config()
const app = express()
const port = process.env.PORT || 5001

require('./config/models')
const database = require('./config/database')
const router = require('./routers/index.router')

app.disable('x-powered-by')
app.use(cors({ origin: true }))
app.use(helmet())

let accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
app.use(morgan('common', { stream: accessLogStream }))

app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
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
            description: "Swagger Javascript document"
        },
        servers: [
            {
                url: `http://localhost:${port}`
            }
        ]
    },
    apis: ["./routers/*.js"]
}

const specs = swaggerJsDoc(options)

app.use('/api', router)
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs))
app.all('*', (req, res) => { return res.status(404).sendFile(`${path.join(__dirname + '/public/404.html')}`) })

app.listen(port, async () => {
    try {
        await database.authenticate()
        await database.sync({})
        console.log('Database connected...')
        console.log(`Server is running: http://localhost:${port}`)
    } catch (error) {
        throw error
    }
})