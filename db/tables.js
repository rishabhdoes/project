const queries = {
  users: `
        CREATE TABLE users (
        id UUID DEFAULT uuid_generate_v4(),
        name VARCHAR ( 255 ),
        house_shortlists VARCHAR[] DEFAULT '{}'::VARCHAR[],
        pg_shortlists VARCHAR[] DEFAULT '{}'::VARCHAR[],
        password_hash VARCHAR ( 255 ) NOT NULL,
        email VARCHAR ( 255 ) UNIQUE NOT NULL,
        phone_number VARCHAR(15),
        is_user_admin BOOLEAN DEFAULT FALSE NOT NULL,
        verified BOOLEAN DEFAULT FALSE NOT NULL,
        count_property_listed NUMERIC DEFAULT 0 CHECK (count_property_listed >= 0),
        forgot_password_hash VARCHAR (255),
        count_shortlists NUMERIC DEFAULT 0 CHECK (shortlisted_count >= 0), 
        count_owner_contacted NUMERIC DEFAULT 0,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id)
        );
    `,

  otpTokens: `
      CREATE TABLE otpTokens (
      id UUID DEFAULT uuid_generate_v4(),
      otptoken_hash VARCHAR ( 255 ) NOT NULL,
      user_id UUID NOT NULL,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
      );
    `,

  houses: `
      CREATE TABLE houses (
       id UUID DEFAULT uuid_generate_v4(),
       owner_id UUID NOT NULL,
       title VARCHAR ( 255 ),
       description VARCHAR (10000),
       is_apartment BOOLEAN DEFAULT FALSE NOT NULL,
       apartment_type VARCHAR (255),
       apartment_name VARCHAR (255),
       bhk_type VARCHAR (255),
       builtup_area VARCHAR (255),
       property_age VARCHAR (255),
       facing VARCHAR (255),
       block VARCHAR (255),
       floor NUMERIC DEFAULT 0 CHECK (floor >= 0),
       total_floors NUMERIC DEFAULT 0 CHECK (floor >= 0),
       street VARCHAR (255),
       locality VARCHAR (255) NOT NULL,
       colony VARCHAR (255),
       address VARCHAR ( 255 ),
       city VARCHAR ( 255 ),
       state VARCHAR ( 255 ),
       country VARCHAR ( 255 ),
       zip_code VARCHAR (255),
       rent NUMERIC(12,0) CHECK (rent > 0),
       deposit NUMERIC(12,0) CHECK (deposit > 0),
       rent_negotiable BOOLEAN DEFAULT FALSE NOT NULL,
       bedrooms NUMERIC DEFAULT 0 CHECK (bedrooms >= 0),
       bathrooms NUMERIC DEFAULT 0 CHECK (bathrooms >= 0),
       property_type VARCHAR ( 255 ) DEFAULT 'independent' NOT NULL,
       preferred_tenants VARCHAR (255) DEFAULT 'any' NOT NULL,
       available_from TIMESTAMP,
       furnishing_type VARCHAR(255) DEFAULT 'none' NOT NULL,
       lockin_period VARCHAR (255),
       rank NUMERIC DEFAULT 0,
       secondary_number VARCHAR(15),
       created_at timestamp DEFAULT CURRENT_TIMESTAMP,
       updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
       PRIMARY KEY(id),
       FOREIGN KEY (owner_id) REFERENCES users(id)
       );
    `,

  houseFacilities: `
      CREATE TABLE houseFacilities (
        id UUID DEFAULT uuid_generate_v4(),
        house_id UUID NOT NULL,
        ac_count NUMERIC DEFAULT 0 CHECK(ac_count >= 0),
        tv_count NUMERIC DEFAULT 0 CHECK(tv_count >= 0), 
        bedrooms_count NUMERIC DEFAULT 0 CHECK(bedrooms_count >= 0),
        bathrooms_count NUMERIC DEFAULT 0 CHECK(bathrooms_count >= 0),
        cupboard_count NUMERIC DEFAULT 0 CHECK(cupboard_count >= 0), 
        fridge BOOLEAN DEFAULT FALSE NOT NULL, 
        water_filter BOOLEAN DEFAULT FALSE NOT NULL,
        washing_machine BOOLEAN DEFAULT FALSE NOT NULL,
        microwave BOOLEAN DEFAULT FALSE NOT NULL,
        geyser BOOLEAN DEFAULT FALSE NOT NULL ,
        gym BOOLEAN DEFAULT FALSE NOT NULL,
        two_wheeler_parking BOOLEAN DEFAULT FALSE NOT NULL,
        four_wheeler_parking BOOLEAN DEFAULT FALSE NOT NULL,
        lift BOOLEAN DEFAULT FALSE NOT NULL,
        cctv BOOLEAN DEFAULT FALSE NOT NULL,
        swimming_pool BOOLEAN DEFAULT FALSE NOT NULL,
        power_backup BOOLEAN DEFAULT FALSE NOT NULL,
        water_supply BOOLEAN DEFAULT FALSE NOT NULL,
        gas_pipeline BOOLEAN DEFAULT FALSE NOT NULL,
        gated_security BOOLEAN DEFAULT FALSE NOT NULL, 
        park BOOLEAN DEFAULT FALSE NOT NULL, 
        wifi BOOLEAN DEFAULT FALSE NOT NULL,
        visitor_parking BOOLEAN DEFAULT FALSE NOT NULL, 
        shopping_center BOOLEAN DEFAULT FALSE NOT NULL, 
        fire_safety BOOLEAN DEFAULT FALSE NOT NULL, 
        club_house BOOLEAN DEFAULT FALSE NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY (house_id) REFERENCES houses(id)
        );
    `,

  pgs: `
  CREATE TABLE pgs(
    id UUID DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL,
    pg_name VARCHAR (255),
    description VARCHAR (255),
    block VARCHAR (255),
    street VARCHAR (255),
    locality VARCHAR (255) NOT NULL,
    colony VARCHAR (255),
    city VARCHAR (255),
    state VARCHAR (255),
    country VARCHAR (255),
    zip_code VARCHAR (255),
    single_room BOOLEAN DEFAULT FALSE NOT NULL,
    single_room_rent NUMERIC DEFAULT 0 CHECK(single_room_rent >= 0),
    single_room_deposit NUMERIC DEFAULT 0 CHECK(single_room_deposit >= 0),
    
    double_room BOOLEAN DEFAULT FALSE NOT NULL,
    double_room_rent NUMERIC DEFAULT 0 CHECK(double_room_rent >= 0),
    double_room_deposit NUMERIC DEFAULT 0 CHECK(double_room_deposit >= 0),
    
    triple_room BOOLEAN DEFAULT FALSE NOT NULL,
    triple_room_rent NUMERIC DEFAULT 0 CHECK(triple_room_rent >= 0),
    triple_room_deposit NUMERIC DEFAULT 0 CHECK(triple_room_deposit >= 0),
    
    four_room BOOLEAN DEFAULT FALSE NOT NULL,
    four_room_rent NUMERIC DEFAULT 0 CHECK(four_room_rent >= 0),
    four_room_deposit NUMERIC DEFAULT 0 CHECK(four_room_deposit >= 0),

    lockin_period VARCHAR (255),
    preferred_tenants VARCHAR (255),
    gender VARCHAR (255) DEFAULT 'any' NOT NULL,
    food BOOLEAN DEFAULT FALSE NOT NULL,
    rank INTEGER DEFAULT 0,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (owner_id) REFERENCES users(id)
  );
        `,

  pgFacilities: `
  CREATE TABLE pgFacilities (
    id UUID DEFAULT uuid_generate_v4(),
    pg_id UUID NOT NULL,
    ac BOOLEAN DEFAULT FALSE NOT NULL, 
    attached_bathroom BOOLEAN DEFAULT FALSE NOT NULL,
    breakfast BOOLEAN DEFAULT FALSE NOT NULL, 
    lunch BOOLEAN DEFAULT FALSE NOT NULL, 
    dinner BOOLEAN  DEFAULT FALSE NOT NULL,
    fridge BOOLEAN  DEFAULT FALSE NOT NULL,
    water_filter BOOLEAN DEFAULT FALSE NOT NULL,
    washing_machine BOOLEAN  DEFAULT FALSE NOT NULL,
    tv BOOLEAN  DEFAULT FALSE NOT NULL,
    cupboard BOOLEAN  DEFAULT FALSE NOT NULL,
    geyser BOOLEAN  DEFAULT FALSE NOT NULL,
    gym BOOLEAN DEFAULT FALSE NOT NULL,
    two_wheeler_parking BOOLEAN DEFAULT FALSE NOT NULL,
    four_wheeler_parking BOOLEAN  DEFAULT FALSE NOT NULL,
    lift BOOLEAN DEFAULT FALSE NOT NULL,
    cctv BOOLEAN DEFAULT FALSE NOT NULL,
    power_backup BOOLEAN DEFAULT FALSE NOT NULL,
    water_supply BOOLEAN  DEFAULT FALSE NOT NULL,
    gated_security BOOLEAN  DEFAULT FALSE NOT NULL,
    wifi BOOLEAN DEFAULT FALSE NOT NULL,
    cooking_followed BOOLEAN DEFAULT FALSE NOT NULL,
    fire_safety BOOLEAN  DEFAULT FALSE NOT NULL,
    club_house BOOLEAN DEFAULT FALSE NOT NULL,
    smoking BOOLEAN  DEFAULT FALSE NOT NULL,
    guardians_allowed BOOLEAN DEFAULT FALSE NOT NULL, 
    opposite_gender BOOLEAN  DEFAULT FALSE NOT NULL, 
    drinking BOOLEAN  DEFAULT FALSE NOT NULL, 
    nonveg BOOLEAN  DEFAULT FALSE NOT NULL, 
    music_party BOOLEAN DEFAULT FALSE NOT NULL,
    laundry BOOLEAN  DEFAULT FALSE NOT NULL,
    room_cleaning BOOLEAN  DEFAULT FALSE NOT NULL,
    biometric_security BOOLEAN DEFAULT FALSE NOT NULL,
    tt_table BOOLEAN DEFAULT FALSE NOT NULL,
    warden_facilities BOOLEAN DEFAULT FALSE NOT NULL,
    created_at timestamp DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(id),
    FOREIGN KEY (pg_id) REFERENCES pgs(id)
  );
    `,

  propertiesContactedTable: `
      CREATE TABLE propertiesContactedTable(
      id UUID DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL,
      house_id UUID,
      pg_id UUID,
      created_at timestamp DEFAULT CURRENT_TIMESTAMP,
      updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(id),
      FOREIGN KEY(user_id) REFERENCES users(id),
      FOREIGN KEY (house_id) REFERENCES houses(id),
      FOREIGN KEY (pg_id) REFERENCES pgs(id)
      );
    `,

  propertyMediaTable: `
        CREATE TABLE propertyMediaTable(
        id UUID DEFAULT uuid_generate_v4(),
        user_id UUID NOT NULL,
        house_id UUID,
        pg_id UUID,
        mediaUrl VARCHAR ( 255 )  NOT NULL,
        created_at timestamp DEFAULT CURRENT_TIMESTAMP,
        updated_at timestamp DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY(id),
        FOREIGN KEY(user_id) REFERENCES users(id),
        FOREIGN KEY (house_id) REFERENCES houses(id),
        FOREIGN KEY (pg_id) REFERENCES pgs(id)
      );
    `,

  triggerFunction: `
      CREATE OR REPLACE FUNCTION update_updated_at()
      RETURNS TRIGGER AS $$
      BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `,
};

module.exports = queries;
