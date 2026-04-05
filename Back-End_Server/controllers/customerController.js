
// here its for customer controller


const client = require("../config/db");

// here add customer
const addCustomer = async (req, res) => {
  const { cust_id, name, address, pan, gst, is_active } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO customers (cust_id, name, address, pan, gst, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
      [cust_id, name, address, pan, gst, is_active]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding customer");
  }
};

// here get all customers
const getCustomers = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching customers");
  }
};

module.exports = { addCustomer, getCustomers };