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
        title: vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model,
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