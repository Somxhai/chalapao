export const CREATE_USER_INFO_TABLE = `CREATE TABLE IF NOT EXISTS
  "user_info" (
    id UUID DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
    birth_date DATE NOT NULL,
    citizen_id VARCHAR UNIQUE NOT NULL,
    phone_number VARCHAR UNIQUE NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
  );`;

export const CREATE_ADDRESS_TABLE = `
CREATE TABLE IF NOT EXISTS
  "address" (
    id UUID DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    primary_flag INT NOT NULL,
    delivary_flag INT NOT NULL,
    residence_info TEXT NOT NULL,
    subdistrict VARCHAR NOT NULL,
    district VARCHAR NOT NULL,
    province VARCHAR NOT NULL,
    postal_code VARCHAR NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT has FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;
