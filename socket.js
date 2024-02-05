module.exports = {
    start: (io) => {
        io.on('connection', (socket) => {
            socket.emit("greeting", "Hello client!, Your personal id ==> ", socket.id)
            console.log(socket.id)
            socket.on('joinRoom', (roomName) => {
                socket.join(roomName)
                console.log('room name ----> ', roomName)
            })
            socket.on('sendMessage', (data) => {
                io.to(data.roomName).emit('newMessage', data.message)
                console.log('message data ........ ', data)
            })
            socket.on('disconnect', () => {
                console.log('...........disconnection socket', socket.id)
            })
        })

        io.on('disconnect', () => {
            console.log('...........disconnection io')
            console.log(socket.id)
        })
    }
}