const pool = require("../database")

const reviewModel = {}

/* ***************************
 * Get all reviews for a vehicle
 * ************************** */
reviewModel.getReviewsByVehicleId = async function (inv_id) {
  try {
    const sql = `
      SELECT r.*, a.account_firstname, a.account_lastname 
      FROM public.reviews AS r
      JOIN public.account AS a ON r.account_id = a.account_id
      WHERE r.inv_id = $1
      ORDER BY r.review_date DESC
    `
    const result = await pool.query(sql, [inv_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByVehicleId error: " + error)
    return new Error("No reviews found")
  }
}

/* ***************************
 * Get reviews by account
 * ************************** */
reviewModel.getReviewsByAccountId = async function (account_id) {
  try {
    const sql = `
      SELECT r.*, i.inv_make, i.inv_model
      FROM public.reviews AS r
      JOIN public.inventory AS i ON r.inv_id = i.inv_id
      WHERE r.account_id = $1
      ORDER BY r.review_date DESC
    `
    const result = await pool.query(sql, [account_id])
    return result.rows
  } catch (error) {
    console.error("getReviewsByAccountId error: " + error)
    return new Error("No reviews found")
  }
}

/* ***************************
 * Add new review
 * ************************** */
reviewModel.addReview = async function (review_text, review_rating, inv_id, account_id) {
  try {
    const sql = `
      INSERT INTO public.reviews (review_text, review_rating, inv_id, account_id)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const result = await pool.query(sql, [review_text, review_rating, inv_id, account_id])
    return result.rows[0]
  } catch (error) {
    console.error("addReview error: " + error)
    return new Error("Failed to add review")
  }
}

/* ***************************
 * Update a review
 * ************************** */
reviewModel.updateReview = async function (review_id, review_text, review_rating) {
  try {
    const sql = `
      UPDATE public.reviews
      SET review_text = $1, review_rating = $2
      WHERE review_id = $3
      RETURNING *
    `
    const result = await pool.query(sql, [review_text, review_rating, review_id])
    return result.rows[0]
  } catch (error) {
    console.error("updateReview error: " + error)
    return new Error("Failed to update review")
  }
}

/* ***************************
 * Delete a review
 * ************************** */
reviewModel.deleteReview = async function (review_id) {
  try {
    const sql = "DELETE FROM public.reviews WHERE review_id = $1"
    const result = await pool.query(sql, [review_id])
    return result.rowCount
  } catch (error) {
    console.error("deleteReview error: " + error)
    return new Error("Failed to delete review")
  }
}

module.exports = reviewModel