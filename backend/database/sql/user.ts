export const CREATE_USER_TABLE = `
CREATE TABLE IF NOT EXISTS
  "user" (
    id TEXT NOT NULL,
    user_info_id UUID DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    email_verified BOOLEAN NULL DEFAULT false,
    user_image TEXT,
    created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    user_type TEXT NOT NULL DEFAULT 'renter' CHECK (user_type IN ('renter', 'lessor')),

    CONSTRAINT user_pkey PRIMARY KEY (id),
    CONSTRAINT user_email_unique UNIQUE (email),
    CONSTRAINT has FOREIGN KEY (user_info_id) REFERENCES "user_info"(id) ON DELETE CASCADE
  );
`;

export const CREATE_VERIFICATION_TABLE = `
CREATE TABLE IF NOT EXISTS
  verification (
    id TEXT NOT NULL,
    identifier TEXT NOT NULL,
    value TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT verification_pkey PRIMARY KEY (id)
  );
`;

export const CREATE_SESSION_TABLE = `
CREATE TABLE IF NOT EXISTS
  "session" (
    id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    token TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    ip_address TEXT NULL,
    user_agent TEXT NULL,
    created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT session_pkey PRIMARY KEY (id),
    CONSTRAINT session_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_ACCOUNT_TABLE = `
CREATE TABLE IF NOT EXISTS
  "account" (
    id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    account_id TEXT NOT NULL,
    provider_id TEXT NOT NULL,
    access_token TEXT NULL,
    refresh_token TEXT NULL,
    access_token_expires_at TIMESTAMPZ,
    refresh_token_expires_at TIMESTAMPZ,
    scope TEXT NULL,
    id_token TEXT NULL,
    password TEXT NULL,
    created_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT account_pkey PRIMARY KEY (id),
    CONSTRAINT account_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;
