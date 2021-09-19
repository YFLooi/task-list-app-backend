const _ = require("lodash");

let mongoCredentialsFromKeyFile = { username: "", password: "" };
try {
  mongoCredentialsFromKeyFile = require("../../keys/mongo.json");
} catch (err) {
  console.error("could not read mongo key file");
}

// * Get Database Connection
function constructMongoConnection(
  dbUserName = mongoCredentialsFromKeyFile.username,
  dbPassword = mongoCredentialsFromKeyFile.password,
  dbName = "task-list-app"
) {
  return `mongodb+srv://${dbUserName}:${dbPassword}@sandbox.9xeet.mongodb.net/${dbName}?retryWrites=true&w=majority`;
}

function getBackendBaseUrl() {
  return "http://localhost:3000";
}

function getWebBaseUrl(env) {
  return "http://localhost:3500";
}

module.exports = { constructMongoConnection, getBackendBaseUrl, getWebBaseUrl };
