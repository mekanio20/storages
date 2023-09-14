module.exports = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property])
        const valid = error == null
        if (valid) {
            next();
        } else {
            res.status(404).json({ 
                success: false, 
                code: 403,
                message: error.details[0].message 
            })
        }
    }
}