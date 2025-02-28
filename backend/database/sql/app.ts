export const CREATE_PAYMENT_TABLE = `
CREATE TABLE IF NOT EXISTS
  "payment" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    status TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    rental_id UUID UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT payment_rental_fk FOREIGN KEY (rental_id) REFERENCES "rental"(id) ON DELETE CASCADE
  );
`;

export const CREATE_RENTAL_TABLE = `
CREATE TABLE IF NOT EXISTS
  "rental" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    status TEXT NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rental_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_ITEM_TABLE = `
CREATE TABLE IF NOT EXISTS
  "item" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL,
    price_per_day DECIMAL(10,2) NOT NULL,
    category_id VARCHAR NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT item_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT item_category_fk FOREIGN KEY (category_id) REFERENCES "category"(id) ON DELETE CASCADE,
  );
`;

export const CREATE_CATEGORY_TABLE = `
CREATE TABLE IF NOT EXISTS
  "category" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY
    category_name TEXT NOT NULL UNIQUE,
  );
`;

export const CREATE_REVIEW_TABLE = `
CREATE TABLE IF NOT EXISTS
  "review" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL,
    user_id VARCHAR NOT NULL,
    rating FLOAT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT review_item_fk FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE,
    CONSTRAINT review_user_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
  );
`;
