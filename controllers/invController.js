const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}


/* ***************************
 *  Build inventory by detail view
 * ************************** */
/*
invCont.buildByInventoryId = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getInventoryById(inv_id)
    let nav = await utilities.getNav()
    const vehicleData = data[0]
    res.render("./inventory/detail", {
      title: vehicleData.inv_year + " " + vehicleData.inv_make + " " + vehicleData.inv_model,
      nav,
      message: null,
      vehicle: {
        make: vehicleData.inv_make,
        model: vehicleData.inv_model,
        year: vehicleData.inv_year,
        price: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(vehicleData.inv_price),
        description: vehicleData.inv_description,
        miles: new Intl.NumberFormat('en-US').format(vehicleData.inv_miles),
        image: vehicleData.inv_image
      }
    })
}
*/

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.buildByInventoryId = async function (req, res, next) {
    try {
      const inv_id = req.params.inventoryId
      const data = await invModel.getInventoryById(inv_id)
      const vehicle = data[0]
      const detail = await utilities.buildVehicleDetail(vehicle)
      let nav = await utilities.getNav()
      
      res.render("./inventory/detail", {
        title: vehicle.inv_make + " " + vehicle.inv_model,
        nav,
        detail,
        message: null,
      })
    } catch (error) {
      console.error("Error in buildByInventoryId:", error)
      next(error)
    }
  }



module.exports = invCont