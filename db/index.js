const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "35.200.150.26",
  database: "yesbroker_test",
  password: "123123",
  port: 5432,
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
