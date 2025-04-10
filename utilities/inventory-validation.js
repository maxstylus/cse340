const { body, validationResult } = require("express-validator")
const utilities = require(".")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
            .trim()
            .isLength({ min: 1 })
            .withMessage("Please provide a classification name.")
            .matches(/^[a-zA-Z0-9]+$/)
            .withMessage("Classification name must contain only letters and numbers."),
    ]
}

validate.checkClassData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        res.render("inventory/add-classification", {
            errors,
            title: "Add New Classification",
            nav,
            classification_name,
        })
        return
    }
    next()
}

validate.inventoryRules = () => {
    return [
        body("classification_id")
            .trim()
            .isInt()
            .withMessage("Please select a valid classification"),

        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .matches(/^[a-zA-Z0-9-\s]{3,}$/)
            .withMessage("Please provide a valid vehicle make"),

        // Add other validation rules for each field...
    ]
}

validate.checkInventoryData = async (req, res, next) => {
    const { classification_id } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        let classList = await utilities.buildClassificationList(classification_id)
        res.render("inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationList: classList,
            ...req.body,
        })
        return
    }
    next()
}

module.exports = validate