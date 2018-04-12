// TODO change type of bodyParser to JSON

const express = require("express");
const bodyParser = require("body-parser");

module.exports = db => {
  const router = express.Router();
  router.use(bodyParser.urlencoded({ extended: false }));

  const userScoresCollection = db.collection("userScores");
  const teamScoresCollection = db.collection("teamScores");

  router.get("/", (request, response) =>
    response.sendFile(__dirname + "/dist/index.html")
  );

  router.get("/user-scores", (request, response) => {
    userScoresCollection.find().toArray((err, scores) => {
      if (err) {
        console.log("There was an error retrieving user scores");
        response.status(500);
      }
      scores.sort((a, b) => b.killCount - a.killCount);
      response.send(scores);
    });
  });

  router.post("/user-scores", (request, response) => {
    const { username, killCount } = request.body;
    userScoresCollection.insertOne(
      {
        username,
        killCount
      },
      (err, result) => {
        if (err) {
          console.log("There was an error adding a user score");
          response.status(500);
        }
        response.send(result);
      }
    );
  });

  router.get("/team-scores", (request, response) => {
    teamScoresCollection.find().toArray((err, scores) => {
      if (err) {
        console.log("There was an error retrieving team scores");
        response.status(500);
      }
      scores.sort((a, b) => b.score - a.score);
      response.send(scores);
    });
  });

  router.post("/team-scores", (request, response) => {
    const { teamname, score, totalKills } = request.body;
    teamScoresCollection.insertOne(
      {
        teamname,
        score,
        totalKills
      },
      (err, result) => {
        if (err) {
          console.log("There was an error adding a team score");
          response.status(500);
        }
        response.send(result);
      }
    );
  });

  return router;
};
