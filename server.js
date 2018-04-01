const express       = require('express');
const WebSocket     = require('ws');
const SocketServer  = WebSocket.Server;
const PORT          = process.env.PORT || 3000;

const server        = express()
  .use(express.static('public'))
  .use('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))
  .listen(PORT, () => console.log(`WebSocket server listening on port: ${PORT}`));

const wss           = new SocketServer({ server })  

wss.on('connection', ws => {
  console.log('Client connected');
  ws.on('close', () => {
    console.log('Client disconnected');
  });
  ws.on('message', data_string => {
    const message = JSON.parse(data_string);
    console.log(message);
  });

  //TODO communicate acv to desktop browser

});
