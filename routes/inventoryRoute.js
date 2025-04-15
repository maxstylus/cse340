// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const invValidate = require("../utilities/inventory-validation")


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Route to build inventory by detail view
router.get("/detail/:inventoryId", invController.buildByInventoryId);

// Route to build edit inventory view 
router.get("/edit/:inventoryId", invController.buildEditInventory)

router.post("/update/", 
    invValidate.inventoryRules(), 
    invValidate.checkUpdateData,  
    invController.updateInventory
)

// Base route for inventory management
router.get("/", invController.buildManagement)

router.get("/getInventory/:classification_id", invController.getInventoryJSON);

// Route to build add classification view
router.get("/add-classification", invController.buildAddClassification)

// Process the add classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassData,
    invController.addClassification
)

// Route to build add inventory view
router.get("/add-inventory", invController.buildAddInventory)

// Process the add inventory data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    invController.addInventory
)


module.exports = router;