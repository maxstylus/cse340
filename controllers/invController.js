const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    

    if (!data || !data[0]) {
      req.flash("notice", "No vehicles found for this classification")
      let nav = await utilities.getNav()
      res.render("./inventory/classification", {
        title: "Vehicles",
        nav,
        grid: null,
        errors: null,
        message: null // "No vehicles found for this classification"
      })
      return
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    })
  } catch (error) {
    console.error("Error in buildByClassificationId:", error)
    next(error)
  }
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


  /* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      res.render("./inventory/management", {
          title: "Vehicle Management",
          nav,
          errors: null,
      })
  } catch (error) {
      console.error("Error in buildManagement:", error)
      next(error)
  }
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      res.render("./inventory/add-classification", {
          title: "Add New Classification",
          nav,
          errors: null,
      })
  } catch (error) {
      console.error("Error in buildAddClassification:", error)
      next(error)
  }
}

invCont.addClassification = async function (req, res, next) {
  try {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)

    if (result) {
      req.flash(
        "notice",
        `Classification ${classification_name} was successfully added.`
      )
      let nav = await utilities.getNav()
      res.status(201).render("inventory/management", {
        title: "Vehicle Management",
        nav,
        errors: null,
      })
    } else {
      req.flash("notice", "Sorry, adding the classification failed.")
      res.status(501).render("inventory/add-classification", {
        title: "Add New Classification",
        nav,
        errors: null,
      })
    }
  } catch (error) {
    console.error("Error in addClassification:", error)
    next(error)
  }
}

/* ***************************
 *  Build add inventory view
 * ************************** */
invCont.buildAddInventory = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      let classList = await utilities.buildClassificationList()
      res.render("./inventory/add-inventory", {
          title: "Add New Vehicle",
          nav,
          classificationList: classList,
          errors: null,
      })
  } catch (error) {
      console.error("buildAddInventory error: ", error)
      next(error)
  }
}

/* ***************************
*  Process Add Inventory
* ************************** */
invCont.addInventory = async function (req, res, next) {
  try {
      const { 
          classification_id, 
          inv_make, 
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color
      } = req.body

      const result = await invModel.addInventory({
          classification_id,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color
      })

      if (result) {
          req.flash("notice", `The ${inv_make} ${inv_model} was successfully added.`)
          res.redirect("/inv")
      } else {
          req.flash("notice", "Sorry, the addition failed.")
          res.status(501).redirect("/inv/add-inventory")
      }
  } catch (error) {
      console.error("addInventory error: ", error)
      next(error)
  }
}



module.exports = invCont