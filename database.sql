CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  cust_id VARCHAR(10),
  name VARCHAR(150),
  address TEXT,
  pan VARCHAR(10),
  gst VARCHAR(15),
  is_active BOOLEAN
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  item_code VARCHAR(10),
  name VARCHAR(100),
  price NUMERIC,
  is_active BOOLEAN
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_id VARCHAR(20),
  customer_id INT,
  total_amount NUMERIC,
  gst_applied BOOLEAN
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT,
  item_id INT,
  quantity INT
);