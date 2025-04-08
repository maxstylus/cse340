const invModel = require("../models/inventory-model")
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
  login += 'pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" '
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

Util.getRegister = async function() {
  let register = '<div class="login-container">'
  register += '<div id="registration-detail">'
  register += '<form id="registerForm" action="/account/register" method="post">'
  
  // First Name
  register += '<div class="form-group">'
  register += '<label for="firstName">First Name:</label>'
  register += '<input type="text" id="firstName" name="client_firstname" required placeholder="Enter your first name">'
  register += '</div>'
  
  // Last Name
  register += '<div class="form-group">'
  register += '<label for="lastName">Last Name:</label>'
  register += '<input type="text" id="lastName" name="client_lastname" required placeholder="Enter your last name">'
  register += '</div>'
  
  // Email
  register += '<div class="form-group">'
  register += '<label for="email">Email:</label>'
  register += '<input type="email" id="email" name="client_email" required placeholder="Enter your email">'
  register += '</div>'
  
  // Password with toggle
  register += '<div class="form-group">'
  register += '<label for="password">Password:</label>'
  register += '<div class="password-input-group">'
  register += '<input type="password" id="password" name="client_password" required '
  register += 'pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$" '
  register += 'placeholder="Enter your password">'
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

module.exports = Util