const express = require("express");
const PORT = process.env.PORT || 3000;

module.exports = mongoDb => {
  const server = express()
    .use(express.static("dist"))
    .use("/", (req, res) => res.sendFile(__dirname + "/dist/index.html"))
    .listen(PORT, () =>
      console.log(`Express server listening on port ${PORT}`)
    );

  require("./websocket-server.js")(server);
};
