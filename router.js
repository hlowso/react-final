require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

module.exports = db => {
  const router = express.Router();
  router.use(bodyParser.json());

  const userScoresCollection = db.collection("userScores");
  const teamScoresCollection = db.collection("teamScores");

  router.get("/", (request, response) =>
    response.sendFile(__dirname + "/dist/index.html")
  );

  router.get("/user-scores", (request, response) => {
    userScoresCollection.find().sort({ "killcount": -1 }).limit(50).toArray((err, scores) => {
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
    teamScoresCollection.find().sort({ "score": -1 }).limit(50).toArray((err, scores) => {
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

  router.post("/reviews", (request, response) => {
    const { comment, rating } = request.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "mission.6ix@gmail.com",
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: "mission.6ix@gmail.com",
      to: process.env.MAILING_LIST,
      subject: "Review",
      text: `Rating: ${rating}\nComment: ${comment}`
    };

    transporter.sendMail(mailOptions, function(err, info) {
      if (err) {
        console.log("There was an error sending an email");
        response.status(500);
      } else {
        response.send(info.response);
      }
    });
  });

  return router;
};
