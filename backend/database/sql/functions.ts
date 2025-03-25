// Item Functions
export const getItems = (limit: number = 30) => {
    return `
      SELECT * FROM "item" 
      LIMIT ${limit};
    `;
};

export const getItemsByCategory = (categoryId: string, limit: number = 30) => {
  return `
    SELECT * FROM "item"
    WHERE category_id = '${categoryId}' 
    LIMIT ${limit};
  `; 
};

export const getItemsByUserId = (userId: string) => {
  return `
    SELECT * FROM "item"
    WHERE owner_id = '${userId}';
  `;
};

export const getItemById = (itemId: string) => {
  return `
    SELECT * FROM "item"
    WHERE id = '${itemId}';
  `;
};

export const createItem = (ownerId: string, itemName: string, description: string, rentalTerms: string, penaltyTerms: string, itemStatus: string, pricePerDay: number, categoryId: string) => {
  return `
    INSERT INTO "item" (owner_id, item_name, description, rental_terms, penalty_terms, item_status, price_per_day, category_id)
    VALUES ('${ownerId}', '${itemName}', '${description}', '${rentalTerms}', '${penaltyTerms}', '${itemStatus}', ${pricePerDay}, '${categoryId}')
    RETURNING id;
  `;
};

export const updateItem = (itemId: string, itemName: string, description: string, rentalTerms: string, penaltyTerms: string, itemStatus: string, pricePerDay: number, categoryId: string) => {
  return `
    UPDATE "item"
    SET 
      item_name = '${itemName}', 
      description = '${description}', 
      rental_terms = '${rentalTerms}', 
      penalty_terms = '${penaltyTerms}', 
      item_status = '${itemStatus}', 
      price_per_day = ${pricePerDay}, 
      category_id = '${categoryId}', 
      updated_at = CURRENT_TIMESTAMP
    WHERE id = '${itemId}';
  `;
};

export const deleteItemById = (itemId: string) => {
  return `
    DELETE FROM "item"
    WHERE id = '${itemId}';
  `;
};

export const addImageToItem = (itemId: string, imageUrl: string) => {
  return `
    INSERT INTO "item_image" (item_id, image_url)
    VALUES ('${itemId}', '${imageUrl}');
  `;
};

// Review Functions
export const createReviewToUser = (reviewerId: string, userId: string, rating: number, comment: string) => {
  return `
    INSERT INTO "review_user" (reviewer_id, user_id, rating, comment)
    VALUES ('${reviewerId}', '${userId}', ${rating}, '${comment}');
  `;
};

export const createReviewToItem = (reviewerId: string, itemId: string, rating: number, comment: string) => {
  return `
    INSERT INTO "review_item" (reviewer_id, item_id, rating, comment)
    VALUES ('${reviewerId}', '${itemId}', ${rating}, '${comment}');
  `;
};

export const getAllRatingByUserId = (userId: string) => {
  return `
    SELECT * FROM "review_user"
    WHERE user_id = '${userId}';
  `;
};
/*
export const getAllReviewsForUser = (userId: string) => {
  return `

  `;
};

export const getAllReviewsForItem = (itemId: string) => {
  return `

  `;
};

export const deleteReviewById = (reviewId: string) => {
    return `
    
    `;
};
*/

export const addImageToReview = (reviewId: string, imageUrl: string) => {
  return `
    INSERT INTO "review_image" (id, image_url)
    VALUES ('${reviewId}', '${imageUrl}');
  `;
};

// User Info Functions
export const getUserInfoByUserId = (userId: string) => {
  return `
    SELECT * FROM "user_info"
    WHERE id = (SELECT user_info_id FROM "user" WHERE id = '${userId}');
  `;
};
/*
export const createUserInfoByUserId = () => {
  return `

  `;
};
*/
export const updateUserInfoByUserId = (userId: string, fullName: string, gender: string, birthDate: string, citizenId: string, phoneNumber: string) => {
  return `
    UPDATE "user_info"
    SET 
      full_name = '${fullName}', 
      gender = '${gender}', 
      birth_date = '${birthDate}', 
      citizen_id = '${citizenId}', 
      phone_number = '${phoneNumber}', 
      updated_at = CURRENT_TIMESTAMP
    WHERE id = (SELECT user_info_id FROM "user" WHERE id = '${userId}');
  `;
};

// Category Functions
export const createCategory = (categoryName: string) => {
  return `
    INSERT INTO "category" (name)
    VALUES ('${categoryName}')
    RETURNING id;
  `;
};

export const updateCategory = (categoryId: string, categoryName: string) => {
  return `
    UPDATE "category"
    SET name = '${categoryName}', updated_at = CURRENT_TIMESTAMP
    WHERE id = '${categoryId}';
  `;
};

export const deleteCategory = (categoryId: string) => {
  return `
    DELETE FROM "category"
    WHERE id = '${categoryId}';
  `;
};

// Keyword Functions
export const createKeywordByItemId = (itemId: string, keyword: string) => {
  return `
    INSERT INTO "keyword" (item_id, keyword)
    VALUES ('${itemId}', '${keyword}');
  `;
};

export const deleteKeywordByKeyword = (itemId: string, keyword: string) => {
  return `
    DELETE FROM "keyword"
    WHERE item_id = '${itemId}' AND keyword = '${keyword}';
  `;
};

// Rental Functions
export const createRental = (renterId: string, itemId: string, deliveryAddress: string, paymentId: string, status: string, startDate: string, endDate: string) => {
  return `
    INSERT INTO "rental" (renter_id, item_id, delivery_address, payment_id, status, start_date, end_date)
    VALUES ('${renterId}', '${itemId}', '${deliveryAddress}', '${paymentId}', '${status}', '${startDate}', '${endDate}')
    RETURNING id;
  `;
};

export const updateRentalStatus = (rentalId: string, status: string) => {
  return `
    UPDATE "rental"
    SET status = '${status}', updated_at = CURRENT_TIMESTAMP
    WHERE id = '${rentalId}';
  `;
};

export const deleteRental = (rentalId: string) => {
  return `
    DELETE FROM "rental"
    WHERE id = '${rentalId}' AND status = 'canceled';
  `;
};
