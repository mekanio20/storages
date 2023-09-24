const multer = require('multer')
const uuid = require('uuid')
const path = require('path')

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

            destination: (req, file, cb) => { cb(null, path.resolve(__dirname, '..', 'public', dest)) },
            filename: (req, file, cb) => {
                cb(null, `${uuid.v4()}-${file.originalname}`)
            }
        }),
        fileFilter: multerFilter
    })
}