const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")
const reviewValidate = require("../utilities/review-validation")

// Routes for logged-in users only
//router.use(utilities.checkAuth)
router.use(utilities.checkLogin)

// Get user's reviews
router.get("/user", reviewController.getUserReviews)

// Process review submission
router.post(
  "/add",
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  reviewController.addReview
)

// Process review update
router.post(
  "/update",
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  reviewController.updateReview
)

// Process review deletion
router.get("/delete/:review_id", reviewController.deleteReview)

module.exports = router