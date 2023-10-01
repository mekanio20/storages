const { GroupPermissions } = require('../config/models')

module.exports = (params) => {
    return async (req, res, next) => {
        try {
            if (params) {
                req.originalUrl = req.originalUrl.split('/')
                req.originalUrl.pop()
                req.originalUrl = req.originalUrl.join('/')
            }
            const permission = await GroupPermissions.findOne({
                where: {
                    method: req.method,
                    url: req.originalUrl,
                    groupId: req.user.group
                },
                attributes: ['url', 'method']
            })
            if (permission) { return next() }
            return res.status(403).json({
                status: 403,
                type: 'error',
                msg: 'Rugsat edilmedi!',
                msg_key: 'forbidden',
                detail: []
            })
        } catch (error) {
            return res.status(500).json({
                status: 500,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
}