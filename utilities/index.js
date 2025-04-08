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
  login += '<form id="loginForm" action="/clients/login" method="post">'
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
  login += '<p class="form-note">No account? <a href="/clients/register">Sign-up</a></p>'
  login += '</div>' 

  return login
}

module.exports = Util