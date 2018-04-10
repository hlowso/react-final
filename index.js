require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;
const MONGODB_URI = `mongodb://hlowso:buster21@ds241019.mlab.com:41019/mission-6ix`;

// `mongo://${process.env.MONGODB_USERNAME}:${
//  process.env.MONGODB_PASSWORD
//}@ds241019.mlab.com:41019/mission-6ix`;

MongoClient.connect(MONGODB_URI, (err, mongoDb) => {
  if (err) {
    console.log(`Failed to connect: ${MONGODB_URI}`);
    throw err;
  }
  console.log(`Connected to mongodb: ${MONGODB_URI}`);
  require("./server.js")(mongoDb);
});
