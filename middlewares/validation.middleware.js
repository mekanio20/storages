module.exports = (schema, property) => {
    return (req, res, next) => {
        let obj = JSON.parse(JSON.stringify(req[property]))
        const { error } = schema.validate(obj)
        const valid = error == null
        if (valid) {
            next();
        } else {
            return res.status(400).json({
                status: 400,
                type: 'error',
                msg: error.message,
                msg_key: error.name,
                detail: []
            })
        }
    }
}