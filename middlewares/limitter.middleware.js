
const rateLimit = require('express-rate-limit')

module.exports = (windowMs, max) => rateLimit({
    windowMs: windowMs || 120000,
    max: max || 10,
    message: JSON.stringify({
        status: 400,
        type: 'error',
        msg: 'Birnäçe wagtdan täzeden synanyşyp görüň!',
        msg_key: 'bad request',
        detail: []
    })
})