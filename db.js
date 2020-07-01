/** Database setup for SoccerPlayer. */

const { Client } = require("pg");

const client = new Client({
  connectionString: "postgresql:///epl"
});

client.connect();


module.exports = client;