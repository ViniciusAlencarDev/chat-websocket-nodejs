const express = require('express')
const cors = require('cors')
const path = require('path')
const { Server } = require('socket.io')
const http = require('http')
const dotenv = require('dotenv')
dotenv.config()

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const portSocket = process.env.PORT_SOCKET ? Number(process.env.PORT_SOCKET) : 3030;

const app = express()
app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

const server = http.createServer(app)
const io = new Server(server, {
    // port: portSocket,
    cors: {}
})

let users = []
let messages = []

io.on('connection', socket => {
    console.log('Entrou ->', socket.id)
    socket.on('enter', nickname => {
        users.push({
            socketId: socket.id,
            nickname
        })
    })
    socket.on('before-messages', () => {
        io.to(socket.id).emit('get-before-messages', messages)
    })
    socket.on('send-message', message => {
        const newMessage = {
            fromSocketId: socket.id,
            fromNickname: users.filter(user => user.socketId === socket.id).at(-1 ).nickname,
            message: message
        }
        messages.push(newMessage)
        io.emit('get-message', newMessage)
    })
    socket.on('disconnect', () => {
        console.log('Saiu ->', socket.id)
        users = users.filter(user => user.socketId !== socket.id)
    })
})

server.listen(port, () => {
    console.log(`Server started in port ${port}`)
})
console.log(`WEBScoket started in port ${port}`)
