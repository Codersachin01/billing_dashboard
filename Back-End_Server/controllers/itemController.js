
// here its for item controller

const client = require("../config/db");

const addItem = async (req, res) => {
  const { item_code, name, price, is_active } = req.body;
  try {
    const result = await client.query(
      "INSERT INTO items (item_code, name, price, is_active) VALUES ($1,$2,$3,$4) RETURNING *",
      [item_code, name, price, is_active]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
};

const getItems = async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching items");
  }
};

module.exports = { addItem, getItems };