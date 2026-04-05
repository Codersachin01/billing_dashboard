const express = require("express");
const cors = require("cors");
const { Client } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "billing_db",
  password: "rememberit",
  port: 5432,
});

client.connect();


app.get("/", (req, res) => {
  res.send("Server running");
});



// Customer 

app.post("/customers", async (req, res) => {
  const { cust_id, name, address, pan, gst, is_active } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO customers (cust_id, name, address, pan, gst, is_active) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [cust_id, name, address, pan, gst, is_active]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding customer");
  }
});


app.get("/customers", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching customers");
  }
});



// items

app.post("/items", async (req, res) => {
  const { item_code, name, price, is_active } = req.body;

  try {
    const result = await client.query(
      "INSERT INTO items (item_code, name, price, is_active) VALUES ($1, $2, $3, $4) RETURNING *",
      [item_code, name, price, is_active]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding item");
  }
});


app.get("/items", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM items");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching items");
  }
});


//invoice

app.post("/invoices", async (req, res) => {
  const { customer_id, items } = req.body;

  try { 
    // get customer to check if gst is register or not
    const custResult = await client.query(
      "SELECT * FROM customers WHERE id = $1",
      [customer_id]
    );
    const customer = custResult.rows[0];
    if (!customer) return res.status(404).send("Customer not found");

    // Calculate subtotal from selected items
    let subtotal = 0;
    for (const item of items) {
      const itemResult = await client.query(
        "SELECT * FROM items WHERE id = $1",
        [item.item_id]
      );
      const dbItem = itemResult.rows[0];
      if (!dbItem) return res.status(404).send(`Item ${item.item_id} not found`);
      subtotal += parseFloat(dbItem.price) * item.quantity;
    }

    // GST rule:
    //    if customer has GST number then GST registered then NO GST charges apply
    //    if customer has no GST number then NOT registered then 18% GST apply
    const gst_applied = !customer.gst;
    const total_amount = gst_applied
      ? parseFloat((subtotal * 1.18).toFixed(2))
      : parseFloat(subtotal.toFixed(2));

    // Auto generate invoice ID - "INVC" + 6 digits = 10 characters
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const invoice_id = "INVC" + randomNum;

    // Save invoice
    const invoiceResult = await client.query(
      "INSERT INTO invoices (invoice_id, customer_id, total_amount, gst_applied) VALUES ($1,$2,$3,$4) RETURNING *",
      [invoice_id, customer_id, total_amount, gst_applied]
    );
    const invoice = invoiceResult.rows[0];

    // Save each item into invoice_items
    for (const item of items) {
      await client.query(
        "INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES ($1,$2,$3)",
        [invoice.id, item.item_id, item.quantity]
      );
    }

    res.json({
      invoice_id,
      subtotal,
      gst_applied,
      total_amount,
      message: "Invoice created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating invoice");
  }
});

// GET all invoices (with customer name joined)
app.get("/invoices", async (req, res) => {
  try {
    const result = await client.query(
      `SELECT invoices.*, customers.name AS customer_name
       FROM invoices
       JOIN customers ON invoices.customer_id = customers.id
       ORDER BY invoices.id DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching invoices");
  }
});

// GET invoices for a specific customer
app.get("/invoices/customer/:customer_id", async (req, res) => {
  try {
    const { customer_id } = req.params;
    const result = await client.query(
      `SELECT invoices.*, customers.name AS customer_name
       FROM invoices
       JOIN customers ON invoices.customer_id = customers.id
       WHERE invoices.customer_id = $1
       ORDER BY invoices.id DESC`,
      [customer_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching customer invoices");
  }
});

// SEARCH invoice by invoice_id string
app.get("/invoices/search/:invoice_id", async (req, res) => {
  try {
    const { invoice_id } = req.params;
    const result = await client.query(
      `SELECT invoices.*, customers.name AS customer_name
       FROM invoices
       JOIN customers ON invoices.customer_id = customers.id
       WHERE invoices.invoice_id = $1`,
      [invoice_id]
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Invoice not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error searching invoice");
  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});