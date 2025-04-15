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
    let nav = await utilities.getNav()

    if (!data || !data[0]) {
      res.render("./inventory/classification", {
        title: "Vehicles",
        nav,
        grid: null,
        errors: null,
        message: "No vehicles found for this category"  // Direct message to view
      })
      return
    }

    const grid = await utilities.buildClassificationGrid(data)
    const className = data[0].classification_name
    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      message: null  // No message when vehicles exist
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
 *  Return Inventory by Classification As JSON
 * ************************** */


invCont.getInventoryJSON = async (req, res, next) => {
  try {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    
    // Check if invData exists and has items
    if (invData && invData.length > 0) {
      return res.json(invData)
    } else {
      return res.json({ 
        message: "No inventory for this classification",
        data: [] 
      })
    }
  } catch (error) {
    console.error("Error in getInventoryJSON:", error)
    next(error)
  }
  /*
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)

  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }   */
}

  /* ***************************
 *  Build management view
 * ************************** */
invCont.buildManagement = async function (req, res, next) {
  try {
      let nav = await utilities.getNav()
      const classificationSelect = await utilities.buildClassificationList()
      res.render("./inventory/management", {
          title: "Vehicle Management",
          nav,
          errors: null,
          classificationSelect,
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inventoryId)
    let nav = await utilities.getNav()
    //const itemData = await invModel.getInventoryById(inv_id)
    const data = await invModel.getInventoryById(inv_id)
    const itemData = data[0] 

    // Check if itemData exists and has properties
    if (!itemData) {
      req.flash("notice", "Vehicle not found.")
      res.redirect("/inv")
      return
    }

    const classificationList = await utilities.buildClassificationList(itemData.classification_id)
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`


    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id
    })
    } catch (error) {
      console.error("buildEditInventory error:", error)
      next(error)
    }    
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationList = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

module.exports = invCont