const { GroupPermissions } = require('../config/models')

module.exports = (params) => {
    return async (req, res, next) => {
        try {
            if (params) {
                req.originalUrl = req.originalUrl.split('/')
                req.originalUrl.pop()
                req.originalUrl = req.originalUrl.join('/')
            }

            const permission = await
                GroupPermissions.findOne({
                    where: {
                        method: req.method,
                        url: req.originalUrl,
                        groupId: req.user.group
                    },
                    attributes: ['url', 'method']
                })
                
            if (permission)
                return next()

            return res.status(403).json({
                success: false,
                code: 403,
                message: 'forbidden',
                data: []
            })

        } catch (error) {
            return res.status(500).json({
                success: false,
                code: 500,
                message: error.message
            })
        }
    }
}