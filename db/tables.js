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

  properties: `
      CREATE TABLE properties (
       propertyId serial PRIMARY KEY,
       ownerId INT  NOT NULL,
       FOREIGN KEY (ownerId) REFERENCES users(id),
       title VARCHAR ( 255 ) UNIQUE NOT NULL,
       description VARCHAR (1000 )  NOT NULL,
       address VARCHAR ( 255 ) UNIQUE NOT NULL,
       city VARCHAR ( 50 )  NOT NULL,
       state VARCHAR ( 50 )  NOT NULL,
       country VARCHAR ( 50 )  NOT NULL,
       zip_code VARCHAR ( 20 )  NOT NULL,
       price NUMERIC(10,2) CHECK (price>0),
       bedrooms INTEGER NOT NULL,
       bathrooms INT NOT NULL,
       property_type VARCHAR ( 255 ) UNIQUE NOT NULL,
       preferred_tenants VARCHAR[],
       images_array VARCHAR[],
       area_sq_ft  NUMERIC(5,2),
       facilities  VARCHAR[],
       restrictions VARCHAR[],
       available_from TIMESTAMP,
       created_at TIMESTAMP,
       updated_at TIMESTAMP,
       Rank VARCHAR,
       deposit NUMERIC,
       max_capacity NUMERIC
       );
      `,

  favorites: `
      CREATE TABLE favorites(
        id serial PRIMARY KEY,
        userId INT  NOT NULL,
        FOREIGN KEY(userId) REFERENCES users(id),
        propertyId INT NOT NULL,
        FOREIGN KEY (propertyId) REFERENCES properties(propertyId),
        propertyStatus VARCHAR ( 50 )  NOT NULL,
        brokerAssigned Boolean
      )
      `,
  pgTable: `
      CREATE TABLE pgTable(
      id serial PRIMARY KEY,
      propertyId INT NOT NULL,
      FOREIGN KEY(propertyId) REFERENCES properties(propertyId),
      deposit NUMERIC NOT NULL,
      capacity INT NOT NULL,
      pricePerBed NUMERIC NOT NULL
      )
      `,
  propertiesContactedTable: `
      CREATE TABLE propertiesContactedTable(
      id serial PRIMARY KEY,
      userId INT  NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      propertyId INT NOT NULL,
      FOREIGN KEY (propertyId) REFERENCES properties(propertyId)
      )
      `,
  propertyMediaTable: `
      CREATE TABLE propertyMediaTable(
      mediaId serial PRIMARY KEY,
      userId INT  NOT NULL,
      FOREIGN KEY(userId) REFERENCES users(id),
      propertyId INT NOT NULL,
      FOREIGN KEY (propertyId) REFERENCES properties(propertyId),
      mediaUrl VARCHAR ( 250 )  NOT NULL
      )
      `,
};

module.exports = queries;
