const { Pool } = require("pg");
const queries = require("./tables");

const pool = new Pool({
  user: "postgres",
  host: "35.200.150.26",
  database: "yesbroker_test",
  password: "123123",
  port: 5432,
});

async function connectToPostgres() {
  let client;
  try {
    client = await pool.connect();
    console.log("Connected to PostgreSQL");
    await client.query(queries.user);
    await client.query(queries.otpToken);
  } catch (error) {
    console.error("Error connecting to PostgreSQL:", error);
  } finally {
    if (client) client.release();
  }
}

connectToPostgres();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
