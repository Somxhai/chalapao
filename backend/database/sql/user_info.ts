export const CREATE_USER_INFO_TABLE = `CREATE TABLE IF NOT EXISTS
  "user_info" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    gender VARCHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    birth_date DATE NOT NULL,
    citizen_id VARCHAR(13) UNIQUE NOT NULL,
    phone_number VARCHAR(10) UNIQUE NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
  );`;

export const CREATE_ADDRESS_TABLE = `
CREATE TABLE IF NOT EXISTS
  "address" (
    id UUID DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    residence_info TEXT NOT NULL,
    sub_district TEXT NOT NULL,
    district TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT has FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;
