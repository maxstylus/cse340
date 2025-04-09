// Account Controller

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function buildLogin(req, res, next) {
    try {
        const nav = await utilities.getNav()
        const login = await utilities.getLogin()
        
        console.log("Debug - nav:", nav)
        console.log("Debug - login:", login)
        
        res.render("account/login", {
          title: "Login",
          nav,
          login,
          errors: null,
        })
      } catch (error) {
        console.error("Error in buildLogin:", error)
        next(error)
      } 
}

/* ****************************************
*  Deliver Register view
* *************************************** */
accountController.buildRegister = async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    const register = await utilities.getRegister()
    res.render("account/register", {
        title: "Register",
        nav,
        register,
        message: null,
    })  
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // debug
    console.log("Registration data:", { 
        firstname: account_firstname, 
        lastname: account_lastname, 
        email: account_email 
      })
  
    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_password
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )

      const login = await utilities.getLogin()
      res.status(201).render("account/login", {
        title: "Login",
        nav,
        login,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      const register = await utilities.getRegister()
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        register,
        errors: null,
      })
    }
  }

module.exports = accountController


