const { Pool } = require("pg");
const queries = require("./tables");
const { DB_PASSWORD } = require("../config");

const pool = new Pool({
  user: "homewale",
  host: "homewale.c3bmqez4che8.ap-south-1.rds.amazonaws.com",
  database: "homewale",
  password: DB_PASSWORD,
  port: 5432,
});

async function connectToPostgres() {
  let client;
  try {
    client = await pool.connect();
    console.log("Connected to PostgreSQL");

    const tables = [
      "users",
      "otpTokens",
      "houses",
      "houseFacilities",
      "pgs",
      "pgFacilities",
      "propertyMediaTable",
      "propertiesContactedTable",
    ];

    // // DROP ALL TABLES
    // tables.map(async (curTable) => {
    //   await client.query(`DROP TABLE IF EXISTS ${curTable} CASCADE`);
    // });

    // // CREATE ALL TABLES
    // await client.query(queries.users);
    // await client.query(queries.otpTokens);
    // await client.query(queries.houses);
    // await client.query(queries.houseFacilities);
    // await client.query(queries.pgs);
    // await client.query(queries.pgFacilities);
    // await client.query(queries.propertiesContactedTable);
    // await client.query(queries.propertyMediaTable);

    // // TRIGGER FUNCTION FOR AUTO updated_at
    // await client.query(queries.triggerFunction);

    // // Run
    // tables.map(async (curTable) => {
    //   await client.query(`CREATE TRIGGER trigger_update_updated_at
    //   BEFORE UPDATE ON ${curTable}
    //   FOR EACH ROW
    //   EXECUTE FUNCTION update_updated_at();`);
    // });
  } catch (error) {
    throw new Error("can't connect to the database" + error);
  } finally {
    if (client) client.release();
  }
}

connectToPostgres();

module.exports = {
  query: (text, params) => pool.query(text, params),
};
