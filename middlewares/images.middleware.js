const multer = require('multer')

module.exports = (dest) => {
    
    const multerFilter = (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true)
        } else {
            cb(new Error('The file is not an image!'))
        }    
    }

    return multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, dest)
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname}`)
            }
        }),
        fileFilter: multerFilter
    })
}