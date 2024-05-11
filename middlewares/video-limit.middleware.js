
const path = require('path')
const ffmpeg = require('fluent-ffmpeg')

module.exports = async (req, res, next) => {
    try {
        const videoPath = path.join(__dirname, `../public/videos/${req.file.filename}`)
        if (!videoPath) {
            return res.status(400).json({
                status: 400,
                type: 'error',
                msg: 'Video giriziň!',
                msg_key: 'bad request',
                detail: []
            })
        }
        ffmpeg.ffprobe(videoPath, (err, metadata) => {
            const durationInSeconds = metadata.format.duration
            console.log('Video wagty:', durationInSeconds, 'sekunt')
            const maxDuration = 120
            if (durationInSeconds > maxDuration) {
                return res.status(400).json({
                    status: 400,
                    type: 'error',
                    msg: 'Video max 2 minut bolmaly!',
                    msg_key: 'bad request',
                    detail: []
                })
            }
            next()
        })
    } catch (error) {
        return res.status(500).json({
            status: 500,
            type: 'error',
            msg: 'Ýalňyşlyk ýüze çykdy!',
            msg_key: 'bad request',
            detail: []
        })
    }
}