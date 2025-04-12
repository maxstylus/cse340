// Account Controller

const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const accountController = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
    try {
        let nav = await utilities.getNav()
        const register = await utilities.getRegister()
        console.log("Debug - register content:", register) // Add debug logging

        res.render("account/register", {
            title: "Register",
            nav,
            errors: null,
            register,
        })
    } catch (error) {
        console.error("Error in buildRegister:", error)
        next(error)
    } 
}

/* ****************************************
*  Process Registration
* *************************************** */
accountController.registerAccount = async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", 'Sorry, there was an error processing the registration.')
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
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
        errors: null
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

  /* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
}

/* ****************************************
*  Deliver account management view
* *************************************** */
accountController.buildAccountManagement = async function(req, res, next) {
  try {
      let nav = await utilities.getNav()
      res.render("account/management", {
          title: "Account Management",
          nav,
          errors: null,
      })
  } catch (error) {
      console.error("Error building account management view:", error)
      next(error)
  }
}

module.exports = accountController


