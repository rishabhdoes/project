const queries = {
  create_table: `CREATE TABLE users (
                id serial PRIMARY KEY,
                username VARCHAR ( 255 ) UNIQUE NOT NULL,
                password_hash VARCHAR ( 255 ) NOT NULL,
                email VARCHAR ( 255 ) UNIQUE NOT NULL,
                phone_number NUMERIC(10, 0) CHECK (id >= 1000000000 AND id < 10000000000 AND id = TRUNC(id)),
                is_user_admin BOOLEAN DEFAULT FALSE NOT NULL,
                count_property_listed NUMERIC(1000,0) DEFAULT 0,
                shortlisted_count NUMERIC DEFAULT 0,
                contacted_count NUMERIC DEFAULT 0,
                created_at DATE DEFAULT CURRENT_DATE,
                last_login TIMESTAMP );
    `,
};

module.exports = queries;
