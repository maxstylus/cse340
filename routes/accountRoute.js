// Needed Resources
const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
//const utilities = require("../utilities")

// Route to build login view
router.get("/login", accountController.buildLogin)

// Route to build the register view
router.get("/register", accountController.buildRegister)
router.post("/register", accountController.registerAccount)


module.exports = router