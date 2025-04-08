// Account Controller

const utilities = require("../utilities")
const accountController = {}

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const login = await utilities.getLogin()
    res.render("clients/login", {
        title: "Login",
        nav,
        login,
        message: null,
    })  
}

module.exports = accountController


