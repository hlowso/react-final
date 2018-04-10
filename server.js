const express = require("express");
const PORT = process.env.PORT || 3000;

module.exports = db => {
  const router = express.Router();
  router.get("/", (req, res) => res.sendFile(__dirname + "/dist/index.html"));
  router.get("/leaderboard", (req, res) => {
    // TODO

    console.log("will do stuff to satisfy this get request");
    res.send();
  });
  router.put("/leaderboard", (req, res) => {
    // TODO

    console.log("will do stuff to satisfy this put request");
  });

  const server = express()
    .use(express.static("dist"))
    .use("/", router)
    .listen(PORT, () =>
      console.log(`Express server listening on port ${PORT}`)
    );

  require("./websocket-server.js")(server);
};
