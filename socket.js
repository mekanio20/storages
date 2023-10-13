module.exports = {
    start: (io) => {
        console.log('...............consumer start function')
        io.on('connection', (socket) => {
            socket.emit("greeting", "Hello client!, Your personal id ==> ", socket.id)
            console.log(socket.id)
            socket.on('message', (message) => {
                socket.emit('ditConsumer', message.value);
                console.log('from console', message.value);
            })

            socket.on("otp", (dto) => {
                console.log(dto)
                console.log('..........otp chanel')
            })
        })

        io.on('disconnect', () => {
            console.log('...........disconnection')
            console.log(socket.id)
        })
    }
}