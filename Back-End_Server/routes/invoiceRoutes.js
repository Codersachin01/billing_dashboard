
// here its for invoice routes

const express = require("express");
const router = express.Router();
const { createInvoice, getInvoices, getInvoicesByCustomer, searchInvoice } = require("../controllers/invoiceController");

router.post("/", createInvoice);
router.get("/", getInvoices);
router.get("/customer/:customer_id", getInvoicesByCustomer);
router.get("/search/:invoice_id", searchInvoice);

module.exports = router;