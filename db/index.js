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
    // await client.query("DROP TABLE IF EXISTS users CASCADE"),
    //   await client.query("DROP TABLE IF EXISTS otpTokens CASCADE"),
    //   await client.query("DROP TABLE IF EXISTS houses CASCADE"),
    //   await client.query("DROP TABLE IF EXISTS houseFacilities CASCADE"),
    //   await client.query("DROP TABLE IF EXISTS pgs CASCADE"),
    //   await client.query("DROP TABLE IF EXISTS pgFacilities CASCADE"),
    //   await client.query("DROP TABLE IF EXISTS favorites CASCADE"),
    //   await client.query(
    //     "DROP TABLE IF EXISTS propertiesContactedTable CASCADE"
    //   ),
    //   await client.query("DROP TABLE IF EXISTS propertyMediaTable CASCADE"),
    //   await client.query(queries.users);
    // await client.query(queries.otpTokens);
    // await client.query(queries.houses);
    // await client.query(queries.houseFacilities);
    // await client.query(queries.pgs);
    // await client.query(queries.pgFacilities);
    // await client.query(queries.favorites);
    // await client.query(queries.propertiesContactedTable);
    // await client.query(queries.propertyMediaTable);
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
