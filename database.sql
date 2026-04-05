CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  cust_id VARCHAR(10) UNIQUE,
  name VARCHAR(150) NOT NULL,
  address TEXT,
  pan VARCHAR(10),
  gst VARCHAR(15),
  is_gst_registered BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE items (
  id SERIAL PRIMARY KEY,
  item_code VARCHAR(10) UNIQUE,
  name VARCHAR(100) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_id VARCHAR(10) UNIQUE NOT NULL,  
  customer_id INT REFERENCES customers(id),
  subtotal NUMERIC(10,2),
  gst_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2),
  gst_applied BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT REFERENCES invoices(id),
  item_id INT REFERENCES items(id),
  quantity INT NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,   
  line_total NUMERIC(10,2) NOT NULL
);
