const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data)
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* **************************************
* Build the vehicle detail view HTML
* ************************************ */
Util.buildVehicleDetail = async function(vehicle){
  let detail = '<div id="vehicle-detail">'

  // Vehicle left panel
  detail += '<div class="left-panel">'
  
  // Vehicle image section
  detail += '<div class="vehicle-image">'
  detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}">`
  detail += '</div>'

  // End left panel
  detail += '</div>'

  // Right Panel
  detail += '<div class="right-panel">'
  
  // Additional vehicle information section
  detail += `<h2> ${vehicle.inv_make} ${vehicle.inv_model} Details</h2>`
  
  detail += '<div class="vehicle-info">'
  detail += `<p class="vehicle-price highlight-section"><span class="label">Price: $</span>${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
  detail += `<p class="regular-section"><span class="label">Description:</span> ${vehicle.inv_description}</p>`
  detail += `<p class="highlight-section"><span class="label">Color:</span> ${vehicle.inv_color}</p>`
  detail += `<p class="regular-section"><span class="label">Miles:</span> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)}</p>`

  detail += '</div>'
  
  detail += '</div>'
  
  // End left panel
  detail += '</div>'

  return detail
}

Util.getLogin = async function() {
  let login = '<div class="login-container">'
  login += '<div id="login-detail">'
  login += '<form id="loginForm" action="/account/login" method="post">'
  login += '<div class="form-group">'
  login += '<label for="email">Email:</label>'
  login += '<input type="email" id="email" name="client_email" required placeholder="Enter your email">'
  login += '</div>'

  login += '<div class="form-group">'
  login += '<label for="password">Password:</label>'
  login += '<input type="password" id="password" name="client_password" required '
  login += 'pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z]).{12,}$" '
  login += 'placeholder="Enter your password">'
  login += '</div>'

  login += '<div class="form-group">'
  login += '<button type="submit">Login</button>'
  login += '</div>'
  login += '</form>'
  login += '</div>' 
  login += '<p class="form-note">No account? <a href="/account/register">Sign-up</a></p>'
  login += '</div>' 

  return login
}

Util.getRegister = async function(data = {}) {
  let register = '<div class="login-container">'
  register += '<div id="registration-detail">'
  register += '<form id="registerForm" action="/account/register" method="post">'
  
  // First Name
  register += '<div class="form-group">'
  register += '<label for="firstName">First Name:</label>'
  register += `<input type="text" name="account_firstname" id="accountFirstname" required value="${data.account_firstname || ''}">`
  register += '</div>'

  // Last Name
  register += '<div class="form-group">'
  register += '<label for="lastName">Last Name:</label>'
  register += `<input type="text" name="account_lastname" id="accountLastname" required value="${data.account_lastname || ''}">`
  register += '</div>'
  
  // Email
  register += '<div class="form-group">'
  register += '<label for="email">Email:</label>'
  register += `<input type="email" name="account_email" id="accountEmail" required value="${data.account_email || ''}">`
  register += '</div>'
  
  // Password with toggle
  register += '<div class="form-group">'
  register += '<label for="password">Password:</label>'
  register += '<div class="password-input-group">'
  register += '<input type="password" id="password" name="account_password" required '
  register += 'pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z]).{12,}$" '
  register += 'placeholder="">' //Enter your password
  register += '<button type="button" id="showPassword" class="password-toggle">'
  register += '<span>Show</span>'
  register += '</button>'
  register += '</div>'
  register += '<div class="password-requirements">'
  register += 'Password must be at least 12 characters and include 1 capital letter, 1 number and 1 special character'
  register += '</div>'
  register += '</div>'

  // Submit Button
  register += '<div class="form-group">'
  register += '<button type="submit">Register</button>'
  register += '</div>'
  
  register += '</form>'
  register += '</div>'
  register += '<p class="form-note">Already have an account? <a href="/account/login">Login</a></p>'
  register += '</div>'

  // Password toggle script
  register += '<script>'
  register += 'document.getElementById("showPassword").addEventListener("click", function() {'
  register += 'const password = document.getElementById("password");'
  register += 'const toggleButton = this.querySelector("span");'
  register += 'if (password.type === "password") {'
  register += '  password.type = "text";'
  register += '  toggleButton.textContent = "Hide";'
  register += '} else {'
  register += '  password.type = "password";'
  register += '  toggleButton.textContent = "Show";'
  register += '}'
  register += '});'
  register += '</script>'

  return register
}

Util.buildClassificationList = async function(classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList = '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  
  data.rows.forEach((row) => {
      let selected = ""
      if (classification_id && row.classification_id == classification_id) {
          selected = " selected "
      }
      classificationList += `<option value="${row.classification_id}"${selected}>${row.classification_name}</option>`
  })
  
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
 * Unified Middleware to Check Login and Token Validity
 **************************************** */
/*
Util.checkAuth = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          console.log("JWT verification failed:", err.message); // Debug log
          req.flash("notice", "Please log in.");
          res.clearCookie("jwt");
          return res.redirect("/account/login");
        }
        // Token is valid, set user data and logged-in status
        res.locals.accountData = accountData;
        res.locals.loggedin = true;
        next();
      }
    );
  } else {
    console.log("No JWT token found."); // Debug log
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};*/





/* ****************************************
 * Handles Authorization
 * *************************************** */

Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }
  
  
 /*
  Util.checkLogin = (req, res, next) => {
    if (req.cookies.jwt) {
        return next()
    }
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
  */


/* ****************************************
* Middleware to check token validity
**************************************** */

Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("notice", "Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 /* **************************************
* Build the reviews HTML
* ************************************ */
Util.buildReviewsHTML = async function(reviews, vehicleUrl) {
  let reviewsHTML = '<div class="reviews-section">'
  
  // Add review form for logged-in users
  if (res.locals.loggedin) {
    reviewsHTML += `
      <h3>Leave a Review</h3>
      <form action="/reviews/add" method="post" class="review-form">
        <input type="hidden" name="inv_id" value="${vehicleUrl.split('/').pop()}">
        
        <label for="review_rating">Rating (1-5 stars):</label>
        <select name="review_rating" id="review_rating" required>
          <option value="5">5 - Excellent</option>
          <option value="4">4 - Very Good</option>
          <option value="3">3 - Good</option>
          <option value="2">2 - Fair</option>
          <option value="1">1 - Poor</option>
        </select>
        
        <label for="review_text">Your Review:</label>
        <textarea name="review_text" id="review_text" rows="4" required 
          placeholder="Share your experience with this vehicle..."></textarea>
        
        <button type="submit">Submit Review</button>
      </form>
    `
  } else {
    reviewsHTML += `
      <p><a href="/account/login">Log in</a> to leave a review.</p>
    `
  }
  // Display existing reviews
  reviewsHTML += '<h3>Customer Reviews</h3>'
  
  if (reviews.length === 0) {
    reviewsHTML += '<p>No reviews yet. Be the first to review this vehicle!</p>'
  } else {
    reviewsHTML += '<div class="review-list">'
    
    reviews.forEach(review => {
      const stars = '★'.repeat(review.review_rating) + '☆'.repeat(5 - review.review_rating)
      const date = new Date(review.review_date).toLocaleDateString()
      
      reviewsHTML += `
        <div class="review-item">
          <div class="review-header">
            <span class="review-stars">${stars}</span>
            <span class="review-author">by ${review.account_firstname} ${review.account_lastname.charAt(0)}.</span>
            <span class="review-date">${date}</span>
          </div>
          <div class="review-text">${review.review_text}</div>
        </div>
      `
    })
    
    reviewsHTML += '</div>'
  }
  
  reviewsHTML += '</div>'
  return reviewsHTML
}

 module.exports = Util