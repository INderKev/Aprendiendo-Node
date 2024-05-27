import express from "express"
import logger from 'morgan'
import { Server } from 'socket.io'
import { createServer } from "node:http";

const PORT = process.env.PORT ?? 3000

const app = express()

//creación del server para tener todas las funcionalidades

const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {}
})

io.on('connection', (socket) => {
  console.log('a user has connected!!')

  socket.on('disconnect', () =>{
    console.log('user disconnected!')
  })

  socket.on('chat message', (msg) =>{
    //realizar un broadcast
    io.emit('chat message', msg)
  })
})

app.use(logger('dev'))

app.get('/',  (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html')
})

server.listen(PORT, () => {
  console.log(`Server running on port localhost:${PORT}`)
})