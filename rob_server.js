const express = require(‘express’)
const morgan = require(‘morgan’)
const WebSocket = require(‘ws’)
const app = express()

app.use(morgan(‘combined’))


app.use(express.static(‘public’))

const server = app.listen(8080, err => {
 if (err) {
   console.error(“Failed to start server”)
   return
 }

 console.log(“Server listening on PORT 8080")
})


const wss = new WebSocket.Server({server})
wss.on(‘connection’, ws => {
 console.log(‘Client Connnected’)
 const helloMessage = {
   type: ‘message’,
   content: ‘Hello World!’
 }
 ws.send(JSON.stringify(helloMessage))

 ws.on(‘close’, () => {
   console.log(‘Client Disconnected’)
 })
})