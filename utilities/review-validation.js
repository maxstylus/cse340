const { body, validationResult } = require("express-validator")
const utilities = require(".")

const validate = {}

/*  **********************************
 *  Review Data Validation Rules
 * ********************************* */
validate.reviewRules = () => {
    return [
      // review_text must be present and have at least 10 characters
      body("review_text")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Review must be at least 10 characters long."),
        
      // review_rating must be present and between 1 and 5
      body("review_rating")
        .isInt({ min: 1, max: 5 })
        .withMessage("Rating must be between 1 and 5."),
        
      // inv_id must be present and a positive integer
      body("inv_id")
        .isInt({ min: 1 })
        .withMessage("Invalid vehicle ID.")
    ]
  }
  
  /* ******************************
   * Check data and return errors
   * ***************************** */
  validate.checkReviewData = async (req, res, next) => {
    const { review_text, review_rating, inv_id } = req.body
    let errors = validationResult(req)
    
    if (!errors.isEmpty()) {
      // If validation errors exist
      let nav = await utilities.getNav()
      req.flash("notice", errors.array()[0].msg)
      
      // Redirect back to the vehicle detail page
      return res.redirect(`/inv/detail/${inv_id}`)
    }
    
    next()
  }
  
module.exports = validate
  