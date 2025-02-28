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
    role TEXT NOT NULL DEFAULT 'renter' CHECK (role IN ('renter', 'lessor')),
    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_email_unique UNIQUE (email)
  );
CREATE INDEX IF NOT EXISTS user_email_idx ON "user"(email);
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
CREATE INDEX IF NOT EXISTS verification_identifier_idx ON verification(identifier);
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
CREATE INDEX IF NOT EXISTS session_user_idx ON "session"(user_id);
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
CREATE INDEX IF NOT EXISTS account_user_idx ON "account"(user_id);
`;
