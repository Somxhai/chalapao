export const CREATE_PAYMENT_TABLE = `
CREATE TABLE IF NOT EXISTS
  "payment" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    renter_id VARCHAR NOT NULL,
    status TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT make FOREIGN KEY (renter_id) REFERENCES "user"(id) ON DELETE CASCADE,
  );
`;

export const CREATE_RENTAL_TABLE = `
CREATE TABLE IF NOT EXISTS
  "rental" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    renter_id VARCHAR NOT NULL,
    item_id VARCHAR NOT NULL,
    delivery_address VARCHAR NOT NULL,
    payment_id VARCHAR NOT NULL,
    status TEXT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rents FOREIGN KEY (renter_id) REFERENCES "user"(id) ON DELETE CASCADE
    CONSTRAINT delivery FOREIGN KEY (delivery_address) REFERENCES "address"(id) ON DELETE CASCADE
    CONSTRAINT for FOREIGN KEY (payment_id) REFERENCES "payment"(id) ON DELETE CASCADE
    CONSTRAINT involves FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE

  );
`;

export const CREATE_ITEM_TABLE = `
CREATE TABLE IF NOT EXISTS
  "item" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id VARCHAR NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    rental_terms TEXT NOT NULL,
    penalty_terms TEXT NOT NULL,
    item_status TEXT NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    category_id UUID NOT NULL,
    item_rating FLOAT DEFAULT 0 CHECK (item_rating BETWEEN 0 & 5),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT owns FOREIGN KEY (owner_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT in FOREIGN KEY (category_id) REFERENCES "category"(id) ON DELETE CASCADE
  );
`;

export const CREATE_CATEGORY_TABLE = `
CREATE TABLE IF NOT EXISTS
  "category" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
  );
`;

export const CREATE_REVIEW_TABLE = `
CREATE TABLE IF NOT EXISTS
  "review" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    target_id VARCHAR,
    item_id UUID,
    user_id VARCHAR NOT NULL,
    rating FLOAT CHECK (rating BETWEEN 0 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_item FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE,
    CONSTRAINT review_user FOREIGN KEY (target_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT by FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_REVIEW_IMAGE = `
CREATE TABLE IF NOT EXISTS
  "review_image" (
    item_review_image VARCHAR NOT NULL PRIMARY KEY,
    id UUID DEFAULT gen_random_uuid(),
    CONSTRAINT for FOREIGN KEY (id) REFERENCES "review"(id) ON DELETE CASCADE,
  );
`;

export const CREATE_KEYWORD_TABLE = `
CREATE TABLE IF NOT EXISTS
  "keyword"(
  keyword TEXT NOT NULL PRIMATY KEY,
  item_id UUID NOT NULL,
  CONSTRAINT for FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE
  )
`
export const CREATE_ITEM_IMAGE_TABLE = `
CREATE TABLE IF NOT EXISTS
  "item_image"(
  item_image VARCHAR NOT NULL PRIMATY KEY,
  item_id UUID NOT NULL,
  CONSTRAINT for FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE
  )
`