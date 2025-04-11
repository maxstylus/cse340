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

        // Make validation
        body("inv_make")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Make must be at least 3 characters")
            .matches(/^[a-zA-Z0-9-\s]+$/)
            .withMessage("Make can only contain letters, numbers, spaces and hyphens"),

        // Model validation
        body("inv_model")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Model must be at least 3 characters")
            .matches(/^[a-zA-Z0-9-\s]+$/)
            .withMessage("Model can only contain letters, numbers, spaces and hyphens"),

        // Year validation
        body("inv_year")
            .trim()
            .isInt({ min: 1900, max: 2024 })
            .withMessage("Year must be between 1900 and 2024"),

        // Description validation
        body("inv_description")
            .trim()
            .isLength({ min: 20 })
            .withMessage("Description must be at least 20 characters"),

        // Price validation
        body("inv_price")
            .trim()
            .isFloat({ min: 0 })
            .withMessage("Price must be a valid number greater than 0"),

        // Miles validation
        body("inv_miles")
            .trim()
            .isInt({ min: 0 })
            .withMessage("Miles must be a valid number greater than 0"),

        // Color validation
        body("inv_color")
            .trim()
            .isLength({ min: 3 })
            .withMessage("Color must be at least 3 characters")
            .matches(/^[a-zA-Z\s]+$/)
            .withMessage("Color can only contain letters and spaces"),
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