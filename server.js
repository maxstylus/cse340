/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const baseController = require("./controllers/baseController")
//const pool = require("./database") // Add database connection
const utilities = require("./utilities")
const session = require("express-session")
const accountRoute = require("./routes/accountRoute")
//const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const jwtAuth = require('./utilities/jwt-auth')


/* ***********************
 * Middleware
 * ************************/

app.use(express.static("public"))
app.use(express.json())
//app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(utilities.checkJWTToken)

// Simple session configuration for flash messages only
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'flashSession',
  cookie: { 
    maxAge: 60000 // 1 minute
  }
}))


// Session middleware - keep this minimal for flash messages only

/*
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
  cookie: {
    maxAge: 1000 * 60 * 5 // 5 minutes
  }
}))
  */

/*
app.use(session({
    store: new (require('connect-pg-simple')(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    name: 'sessionId',
  })) */

// Flash message Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Process Registration Form Data
//app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

// JWT verification middleware
//app.use(jwtAuth.verifyToken) 


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")

/* ***********************
 * Routes
 *************************/
app.use(static)

// Index route
app.get("/", baseController.buildHome)

// Inventory routes
app.use("/inv", inventoryRoute)

// Account route
app.use("/account", accountRoute)

// Add this route before your 404 handler
// Deliberately throw an error to test the error handler from "error link'
app.get("/trigger-error", (req, res, next) => {
    // Deliberately throw an error
    throw new Error('500 Error Test');
  });

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
    next({status: 404, message: 'Sorry, we appear to have lost that page.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
    let nav = await utilities.getNav()
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
    res.render("errors/error", {
      title: err.status || 'Server Error',
      message: err.message,
      nav
    })
  })

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || '0.0.0.0'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, host, () => {
  console.log(`app listening on ${host}:${port}`)
})