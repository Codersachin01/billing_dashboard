
// here its for invoice controller

const client = require("../config/db");

const createInvoice = async (req, res) => {
  const { customer_id, items } = req.body;
  try {

    //  here it get   customer to check 
    // so that gst is registered or not

    const custResult = await client.query(
      "SELECT * FROM customers WHERE id = $1",
      [customer_id]
    );
    const customer = custResult.rows[0];
    if (!customer) return res.status(404).send("Customer not found");

       //    here it calculate subtotal from 
       //  selected items

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

    // here applyingGST rules in this code:
    //                     here if customer has GST number then GST registered then NO GST charges apply
    //                     here if customer has no GST number then NOT registered then 18% GST charges apply
    
    const gst_applied = !customer.gst;
    const total_amount = gst_applied
      ? parseFloat((subtotal * 1.18).toFixed(2))
      : parseFloat(subtotal.toFixed(2));

    // here it auto generate invoice ID (INVC + 6 digits = 10 characters)
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const invoice_id = "INVC" + randomNum;

    // here it save invoice data
    const invoiceResult = await client.query(
  "INSERT INTO invoices (invoice_id, customer_id, subtotal, total_amount, gst_applied) VALUES ($1,$2,$3,$4,$5) RETURNING *",
[invoice_id, customer_id, subtotal, total_amount, gst_applied]
    );
    const invoice = invoiceResult.rows[0];

    // here it save each item into invoice_items
    for (const item of items) {
      await client.query(
        "INSERT INTO invoice_items (invoice_id, item_id, quantity) VALUES ($1,$2,$3)",
        [invoice.id, item.item_id, item.quantity]
      );
    }

    res.json({ invoice_id, subtotal, gst_applied, total_amount, message: "Invoice created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating invoice");
  }
};

const getInvoices = async (req, res) => {
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
};

const getInvoicesByCustomer = async (req, res) => {
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
};

const searchInvoice = async (req, res) => {
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
};

module.exports = { createInvoice, getInvoices, getInvoicesByCustomer, searchInvoice };