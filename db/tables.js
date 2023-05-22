const queries = {
  user: `CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username VARCHAR ( 255 ) UNIQUE NOT NULL,
                password_hash VARCHAR ( 255 ) NOT NULL,
                email VARCHAR ( 255 ) UNIQUE NOT NULL,
                phone_number NUMERIC(10, 0) CHECK (phone_number >= 1000000000 AND phone_number < 10000000000 AND phone_number = TRUNC(phone_number)),
                is_user_admin BOOLEAN DEFAULT FALSE NOT NULL,
                count_property_listed NUMERIC(1000,0) DEFAULT 0,
                verified BOOLEAN DEFAULT FALSE NOT NULL,
                shortlisted_count NUMERIC DEFAULT 0,
                contacted_count NUMERIC DEFAULT 0,
                created_at DATE DEFAULT CURRENT_DATE,
                last_login TIMESTAMP );
    `,

  otpToken: `CREATE TABLE otpTokens (
      id SERIAL PRIMARY KEY,
      otptoken_hash VARCHAR ( 255 ) NOT NULL,
      userId INT  NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      created_at DATE DEFAULT CURRENT_DATE);`,
};

module.exports = queries;
