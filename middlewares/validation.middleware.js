module.exports = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property])
        const valid = error == null
        if (valid) {
            next();
        } else {
            res.status(404).json({
                status: 404,
                msg: error.details[0].message,
                msg_key: error.details[0].name,
                detail: []
            })
        }
    }
}