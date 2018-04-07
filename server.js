const express = require("express");
const WebSocket = require("ws");
const SocketServer = WebSocket.Server;
const PORT = process.env.PORT || 3000;
const uuid = require("uuid-v4");

const server = express()
  .use(express.static("dist"))
  .use("/", (req, res) => res.sendFile(__dirname + "/dist/index.html"))
  .listen(PORT, () =>
    console.log(`WebSocket server listening on port: ${PORT}`)
  );

const wss = new SocketServer({ server });
const links = [];

const handleDesktopMessage = (ws, message) => {
  const id = uuid();
  links.push({
    id,
    code: message.code,
    desktopSocket: ws
  });
  ws.id = id;
};

const handleMobileMessage = (ws, message) => {
  let link;

  switch (message.subject) {
    case "connect":
      link = links.find(l => l.code === message.code);
      if (link) {
        link.mobileSocket = ws;
        ws.id = link.id;
        ws.send();
      } else {
        console.log("No link found for requesting mobile device");
      }
      break;
    case "push":
      link = links.find(l => l.id === ws.id);
      link.desktopSocket.send(
        JSON.stringify({
          velocity: message.velocity
        })
      );
      break;
  }
};

wss.on("connection", ws => {
  console.log("Client connected");

  ws.on("message", data_string => {
    const message = JSON.parse(data_string);
    // console.log("MESSAGE:", message);

    switch (message.device) {
      case "desktop":
        handleDesktopMessage(ws, message);
        break;
      case "mobile":
        handleMobileMessage(ws, message);
        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
