const { GroupPermissions } = require('../config/models')

module.exports = (params) => {
    return async (req, res, next) => {
        try {
            req.originalUrl = req.originalUrl.split('?')[0]
            if (params === true) {
                req.originalUrl = req.originalUrl.split('/')
                req.originalUrl.pop()
                req.originalUrl = req.originalUrl.join('/')
            }
            console.log(req.originalUrl);
            const permission = await GroupPermissions.findOne({
                where: {
                    method: req.method,
                    url: req.originalUrl,
                    groupId: req.user.group,
                    isActive: true
                },
                attributes: ['url', 'method']
            })
            console.log('PERMISSION --> ', JSON.stringify(permission, null, 2))
            if (!permission) {
                return res.status(403).json({
                    status: 403,
                    type: 'error',
                    msg: 'Rugsat edilmedi!',
                    msg_key: 'forbidden',
                    detail: []
                })
            }
            return next() 
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