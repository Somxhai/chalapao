export const CREATE_PAYMENT_TABLE = `
CREATE TABLE IF NOT EXISTS
  "payment" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    renter_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    total_price NUMERIC NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT make FOREIGN KEY (renter_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_RENTAL_TABLE = `
CREATE TABLE IF NOT EXISTS rental (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    renter_id UUID NOT NULL,
    item_id UUID NOT NULL,

    delivery_address UUID NOT NULL,
    return_address UUID NOT NULL,

    payment_id UUID NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'cancel')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT rents FOREIGN KEY (renter_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT delivery FOREIGN KEY (delivery_address) REFERENCES "rental_address"(id) ON DELETE CASCADE,
    CONSTRAINT return FOREIGN KEY (return_address) REFERENCES "rental_address"(id) ON DELETE CASCADE,
    CONSTRAINT payment_by FOREIGN KEY (payment_id) REFERENCES "payment"(id) ON DELETE CASCADE,
    CONSTRAINT involves FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE

  );
`;

export const CREATE_RENTAL_ADDRESS_TABLE = `
CREATE TABLE IF NOT EXISTS
  "rental_address" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    residence_info TEXT NOT NULL,
    sub_district TEXT NOT NULL,
    district TEXT NOT NULL,
    province TEXT NOT NULL,
    postal_code VARCHAR(10) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP

  );
`;

export const CREATE_ITEM_TABLE = `
CREATE TABLE IF NOT EXISTS
  "item" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_id UUID NOT NULL,
    item_name TEXT NOT NULL,
    description TEXT,
    rental_terms TEXT NOT NULL,
    penalty_terms TEXT NOT NULL,
    item_status TEXT NOT NULL CHECK (item_status IN ('available', 'rented', 'unavailable')),
    price_per_day NUMERIC NOT NULL,
    category_id UUID,
    item_rating INT DEFAULT 0 CHECK (item_rating BETWEEN 0 AND 5),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT owns FOREIGN KEY (owner_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT in_category FOREIGN KEY (category_id) REFERENCES "category"(id) ON DELETE CASCADE
  );
`;

export const CREATE_CATEGORY_TABLE = `
CREATE TABLE IF NOT EXISTS
  "category" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NULL DEFAULT CURRENT_TIMESTAMP
  );
`;

export const CREATE_REVIEW_ITEM_TABLE = `
CREATE TABLE IF NOT EXISTS
  "review_item" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_id UUID NOT NULL,
    item_id UUID NOT NULL,
    rating INT CHECK (rating BETWEEN 0 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT target_item_review FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE,
    CONSTRAINT review_by FOREIGN KEY (reviewer_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_REVIEW_USER_TABLE = `
CREATE TABLE IF NOT EXISTS
  "review_user" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    reviewer_id UUID NOT NULL,
    user_id UUID NOT NULL,
    rating INT CHECK (rating BETWEEN 0 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT target_user_review FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE,
    CONSTRAINT review_by FOREIGN KEY (reviewer_id) REFERENCES "user"(id) ON DELETE CASCADE
  );
`;

export const CREATE_KEYWORD_TABLE = `
CREATE TABLE IF NOT EXISTS "keyword"(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL,
    keyword TEXT NOT NULL,
    CONSTRAINT keyword_for FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE
  )
`;
export const CREATE_ITEM_IMAGE_TABLE = `
CREATE TABLE IF NOT EXISTS
  "item_image"(
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    item_id UUID NOT NULL,
    path TEXT NOT NULL,
    CONSTRAINT image_for FOREIGN KEY (item_id) REFERENCES "item"(id) ON DELETE CASCADE
  )
`;

export const CREATE_REVIEW_IMAGE_TABLE = `
CREATE TABLE IF NOT EXISTS
  "review_item_image" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL,
    path TEXT NOT NULL,
    CONSTRAINT image_for FOREIGN KEY (review_id) REFERENCES "review_item"(id) ON DELETE CASCADE
  );
`;

export const CREATE_REVIEW_USER_IMAGE_TABLE = `
    CREATE TABLE IF NOT EXISTS "review_user_image" (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL,
    path TEXT NOT NULL,
    CONSTRAINT image_for FOREIGN KEY (review_id) REFERENCES "review_user"(id) ON DELETE CASCADE
)
`;
