export const CREATE_USER_INFO_TABLE = `CREATE TABLE IF NOT EXISTS
  "user_info" (
    id UUID DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    full_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    birth_date DATE NOT NULL,
    citizen_id VARCHAR UNIQUE NOT NULL,
    phone_number VARCHAR UNIQUE NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_info_id),
    CONSTRAINT user_info_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );`;

export const CREATE_ADDRESS_TABLE = `
CREATE TABLE IF NOT EXISTS
  "address" (
    id UUID DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    postal_code VARCHAR NOT NULL,
    residence_info TEXT NOT NULL,
    district VARCHAR NOT NULL,
    subdistrict VARCHAR NOT NULL,
    province VARCHAR NOT NULL,
    PRIMARY KEY (address_id),
    CONSTRAINT address_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;
