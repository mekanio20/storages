const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    try {
        const bearer = req.headers.authorization.split(' ')[0]
        const token = req.headers.authorization.split(' ')[1]
        if (bearer.toLowerCase() !== 'bearer' || !token)
            return next()
        const decoded = jwt.verify(token, process.env.PRIVATE_KEY)
        console.log(decoded)
        req.user = decoded
        return next()
    } catch (error) {
        return res.json({ 
            status: 500,
            type: 'error',
            msg: error.message,
            msg_key: error.name,
            detail: []
        })
    }
}