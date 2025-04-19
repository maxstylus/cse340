const reviewModel = require("../models/review-model")
const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const reviewController = {}

/* ***************************
 * Build reviews section for vehicle detail view
 * ************************** */
reviewController.buildReviewSection = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  
  try {
    // Fetch reviews for this vehicle
    const reviews = await reviewModel.getReviewsByVehicleId(inv_id)
    
    // Build HTML for the reviews section
    let reviewsHTML = await utilities.buildReviewsHTML(reviews, req.path)
    
    // Add the reviewsHTML to res.locals so it can be accessed in the view
    res.locals.reviewsHTML = reviewsHTML
    next()
  } catch (error) {
    console.error("Error building review section:", error)
    req.flash("notice", "Error building review section.")
    next()
  }
}

/* ***************************
 * Process new review submission
 * ************************** */
reviewController.addReview = async function (req, res) {
  const { review_text, review_rating, inv_id } = req.body
  const account_id = res.locals.accountData.account_id
  
  try {
    // Add the review to the database
    const result = await reviewModel.addReview(
      review_text, 
      review_rating, 
      inv_id, 
      account_id
    )
    
    if (result.review_id) {
      req.flash("notice", "Review added successfully!")
    } else {
      req.flash("notice", "Failed to add review.")
    }
    
    // Redirect back to the vehicle detail page
    return res.redirect(`/inv/detail/${inv_id}`)
  } catch (error) {
    console.error("Error adding review:", error)
    req.flash("notice", "Error adding review.")
    return res.redirect(`/inv/detail/${inv_id}`)
  }
}

/* ***************************
 * Build user's reviews view
 * ************************** */
reviewController.getUserReviews = async function (req, res) {
  const account_id = res.locals.accountData.account_id
  
  try {
    // Get navigation and user's reviews
    const nav = await utilities.getNav()
    const reviews = await reviewModel.getReviewsByAccountId(account_id)
    
    // Build the view
    res.render("reviews/user-reviews", {
      title: "Your Reviews",
      nav,
      reviews,
      errors: null,
    })
  } catch (error) {
    console.error("Error getting user reviews:", error)
    req.flash("notice", "Error retrieving reviews.")
    return res.redirect("/account/")
  }
}

/* ***************************
 * Process review update
 * ************************** */
reviewController.updateReview = async function (req, res) {
  const { review_id, review_text, review_rating, inv_id } = req.body
  //const account_id = res.locals.accountData.account_id
  
  try {
    // Update the review
    const result = await reviewModel.updateReview(
      review_id,
      review_text,
      review_rating
    )
    
    if (result) {
      req.flash("notice", "Review updated successfully!")
    } else {
      req.flash("notice", "Failed to update review.")
    }
    
    // Redirect back to user's reviews
    return res.redirect("/reviews/user")
  } catch (error) {
    console.error("Error updating review:", error)
    req.flash("notice", "Error updating review.")
    return res.redirect("/reviews/user")
  }
}

/* ***************************
 * Process review deletion
 * ************************** */
reviewController.deleteReview = async function (req, res) {
  const review_id = parseInt(req.params.review_id)
  
  try {
    // Delete the review
    const result = await reviewModel.deleteReview(review_id)
    
    if (result === 1) {
      req.flash("notice", "Review deleted successfully!")
    } else {
      req.flash("notice", "Failed to delete review.")
    }
    
    // Redirect back to user's reviews
    return res.redirect("/reviews/user")
  } catch (error) {
    console.error("Error deleting review:", error)
    req.flash("notice", "Error deleting review.")
    return res.redirect("/reviews/user")
  }
}

module.exports = reviewController