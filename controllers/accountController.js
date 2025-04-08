// Account Controller

const utilities = require("../utilities")
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const login = await utilities.getLogin()
    res.render("account/login", {
        title: "Login",
        nav,
        login,
        message: null,
    })  
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

module.exports = accountController


