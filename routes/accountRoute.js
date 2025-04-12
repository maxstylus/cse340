// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')
const utilities = require("../utilities")

// Account management route
router.get("/", utilities.checkLogin, accountController.buildAccountManagement)

// Route to build login view
router.get("/login", accountController.buildLogin)

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  accountController.accountLogin
)

// Route to build registration view
router.get("/register", accountController.buildRegister)

// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    accountController.registerAccount
  )


module.exports = router