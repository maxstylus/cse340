const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
      const data = await pool.query(
        `SELECT * FROM public.inventory AS i 
        JOIN public.classification AS c 
        ON i.classification_id = c.classification_id 
        WHERE i.classification_id = $1`,
        [classification_id]
      )
      return data.rows
    } catch (error) {
      console.error("getclassificationsbyid error " + error)
    }
  }

async function getInventoryById(inv_id) {
  try {
    const data = await pool.query(
      "SELECT * FROM inventory WHERE inv_id = $1",
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getInventoryById error: " + error)
    throw error
  }
}

/* ***************************
 *  Add new classification
 * ************************** */
async function addClassification(classification_name) {
  try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
      return await pool.query(sql, [classification_name])
  } catch (error) {
      console.error("addClassification error: " + error)
      throw error
  }
}

/* ***************************
 *  Add new inventory item
 * ************************** */
async function addInventory(inv_data) {
  try {
      const sql = `
          INSERT INTO inventory (
              classification_id,
              inv_make,
              inv_model,
              inv_description,
              inv_image,
              inv_thumbnail,
              inv_price,
              inv_year,
              inv_miles,
              inv_color
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *
      `
      const data = await pool.query(sql, [
          inv_data.classification_id,
          inv_data.inv_make,
          inv_data.inv_model,
          inv_data.inv_description,
          inv_data.inv_image,
          inv_data.inv_thumbnail,
          inv_data.inv_price,
          inv_data.inv_year,
          inv_data.inv_miles,
          inv_data.inv_color
      ])
      return data.rowCount
  } catch (error) {
      console.error("addInventory error: " + error)
      throw error
  }
}

module.exports = {
  getClassifications, 
  getInventoryByClassificationId, 
  getInventoryById,
  addClassification,
  addInventory
} 
