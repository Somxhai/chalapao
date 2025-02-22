export const CREATE_USER_TABLE = `
CREATE TABLE IF NOT EXISTS
  "user" (
    id VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    email_verified BOOLEAN NULL DEFAULT false,
    phone_number VARCHAR UNIQUE NULL,
    created_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_email_unique UNIQUE (email)
  );
`;

export const CREATE_VERIFICATION_TABLE = `
CREATE TABLE IF NOT EXISTS
  verification (
    id VARCHAR NOT NULL,
    identifier VARCHAR NOT NULL,
    value VARCHAR NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT verification_pkey PRIMARY KEY (id)
  );
`;

export const CREATE_SESSION_TABLE = `
CREATE TABLE IF NOT EXISTS
  "session" (
    id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    token VARCHAR NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address VARCHAR NULL,
    user_agent VARCHAR NULL,
    created_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT session_pkey PRIMARY KEY (id),
    CONSTRAINT session_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_ACCOUNT_TABLE = `
CREATE TABLE IF NOT EXISTS
  "account" (
    id VARCHAR NOT NULL,
    user_id VARCHAR NOT NULL,
    account_id VARCHAR NOT NULL,
    provider_id VARCHAR NOT NULL,
    access_token VARCHAR NULL,
    refresh_token VARCHAR NULL,
    access_token_expires_at TIMESTAMPTZ NULL,
    refresh_token_expires_at TIMESTAMPTZ NULL,
    scope VARCHAR NULL,
    id_token VARCHAR NULL,
    password VARCHAR NULL,
    created_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT account_pkey PRIMARY KEY (id),
    CONSTRAINT account_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_ADDRESS_TABLE = `
CREATE TABLE IF NOT EXISTS
  "address" (
    address_id UUID DEFAULT gen_random_uuid(),
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

export const CREATE_PAYMENT_TABLE = `
CREATE TABLE IF NOT EXISTS
  "payment" (
    payment_id UUID DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    status TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    rental_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (payment_id),
    CONSTRAINT payment_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT payment_rental_fk FOREIGN KEY (rental_id) REFERENCES "rental"(rental_id) ON DELETE CASCADE
  );
`;

export const CREATE_RENTAL_TABLE = `
CREATE TABLE IF NOT EXISTS
  "rental" (
    rental_id UUID DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    status TEXT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (rental_id),
    CONSTRAINT rental_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_ITEM_TABLE = `
CREATE TABLE IF NOT EXISTS
  "item" (
    item_id UUID DEFAULT gen_random_uuid(),
    user_id VARCHAR NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    category_id UUID NOT NULL,
    rental_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (item_id),
    CONSTRAINT item_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT item_category_fk FOREIGN KEY (category_id) REFERENCES "category"(category_id) ON DELETE CASCADE,
    CONSTRAINT item_rental_fk FOREIGN KEY (rental_id) REFERENCES "rental"(rental_id) ON DELETE CASCADE
  );
`;

export const CREATE_CATEGORY_TABLE = `
CREATE TABLE IF NOT EXISTS
  "category" (
    category_id UUID DEFAULT gen_random_uuid(),
    category_name TEXT NOT NULL UNIQUE,
    PRIMARY KEY (category_id)
  );
`;

export const CREATE_REVIEW_TABLE = `
CREATE TABLE IF NOT EXISTS
  "review" (
    review_id UUID DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL,
    user_id VARCHAR NOT NULL,
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (review_id),
    CONSTRAINT review_item_fk FOREIGN KEY (item_id) REFERENCES "item"(item_id) ON DELETE CASCADE,
    CONSTRAINT review_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_item_review UNIQUE (user_id, item_id)
  );
`;
