import { useState, useEffect } from "react";
import axios from "axios";
import API from "../config";

function Billing() {
  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    axios.get(`${API}/customers`).then((res) => {
      setCustomers(res.data.filter((c) => c.is_active));
    });
    axios.get(`${API}/items`).then((res) => {
      setItems(res.data.filter((i) => i.is_active));
    });
  }, []);

  // Here add item to selected list
  const addItem = () => {
    setSelectedItems([...selectedItems, { item_id: "", quantity: 1 }]);
  };

  // It removes item from selected list
  const removeItem = (index) => {
    const updated = selectedItems.filter((_, i) => i !== index);
    setSelectedItems(updated);
  };

  // It handles selection change of item
  const handleItemChange = (index, field, value) => {
    const updated = [...selectedItems];
    updated[index][field] = value;
    setSelectedItems(updated);
  };

  // It calculates the preview total
  const calculatePreview = () => {
    let subtotal = 0;
    selectedItems.forEach((si) => {
      const item = items.find((i) => i.id === parseInt(si.item_id));
      if (item) subtotal += parseFloat(item.price) * si.quantity;
    });
    const customer = customers.find((c) => c.id === parseInt(selectedCustomer));
    const gst_applied = customer && !customer.gst;
    const total = gst_applied ? subtotal * 1.18 : subtotal;
    return { subtotal, gst_applied, total };
  };

  // Here submit invoice
  const handleSubmit = () => {
    if (!selectedCustomer) return alert("Please select a customer");
    if (selectedItems.length === 0) return alert("Please add at least one item");

    const payload = {
      customer_id: parseInt(selectedCustomer),
      items: selectedItems.map((si) => ({
        item_id: parseInt(si.item_id),
        quantity: parseInt(si.quantity),
      })),
    };

    axios.post(`${API}/invoices`, payload).then((res) => {
      setInvoice(res.data);
      setSelectedCustomer("");
      setSelectedItems([]);
    });
  };

  const preview = calculatePreview();

  return (
    <div style={{ padding: "30px" }}>
      <h2>Create Invoice</h2>

      {/* SELECT CUSTOMER */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold" }}>Select Customer:</label>
        <br />
        <select
          value={selectedCustomer}
          onChange={(e) => setSelectedCustomer(e.target.value)}
          style={{ ...inputStyle, width: "400px", marginTop: "8px" }}
        >
          <option value="">-- Select Customer --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cust_id} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* SELECT ITEMS */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontWeight: "bold" }}>Select Items:</label>
        <br />
        {selectedItems.map((si, index) => (
          <div key={index} style={{ display: "flex", gap: "10px", marginTop: "8px", alignItems: "center" }}>
            <select
              value={si.item_id}
              onChange={(e) => handleItemChange(index, "item_id", e.target.value)}
              style={{ ...inputStyle, width: "250px" }}
            >
              <option value="">-- Select Item --</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_code} — {item.name} (₹{item.price})
                </option>
              ))}
            </select>
            <input
              type="number"
              min="1"
              value={si.quantity}
              onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
              style={{ ...inputStyle, width: "80px" }}
            />
            <button onClick={() => removeItem(index)} style={{ ...btnStyle, background: "#e94560" }}>
              Remove
            </button>
          </div>
        ))}
        <button onClick={addItem} style={{ ...btnStyle, marginTop: "10px", background: "#0f3460" }}>
          + Add Item
        </button>
      </div>

      {/* PREVIEW TOTAL */}
      {selectedCustomer && selectedItems.length > 0 && (
        <div style={{ background: "#f5f5f5", padding: "15px", borderRadius: "8px", maxWidth: "400px", marginBottom: "20px" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>Invoice Preview</h4>
          <p>Subtotal: ₹{preview.subtotal.toFixed(2)}</p>
          <p>GST (18%): {preview.gst_applied ? `₹${(preview.subtotal * 0.18).toFixed(2)}` : "Not Applied (GST Registered)"}</p>
          <p style={{ fontWeight: "bold" }}>Total: ₹{preview.total.toFixed(2)}</p>
        </div>
      )}

      {/* GENERATE INVOICE BUTTON */}
      <button onClick={handleSubmit} style={{ ...btnStyle, padding: "12px 30px", fontSize: "16px", background: "#1a1a2e" }}>
        Generate Invoice
      </button>

      {/* INVOICE SUCCESS */}
      {invoice && (
        <div style={{ marginTop: "30px", background: "#e8f5e9", padding: "20px", borderRadius: "8px", maxWidth: "400px" }}>
          <h3 style={{ color: "green" }}>✅ Invoice Generated!</h3>
          <p><strong>Invoice ID:</strong> {invoice.invoice_id}</p>
          <p><strong>Subtotal:</strong> ₹{invoice.subtotal}</p>
          <p><strong>GST Applied:</strong> {invoice.gst_applied ? "Yes (18%)" : "No"}</p>
          <p><strong>Total Amount:</strong> ₹{invoice.total_amount}</p>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  padding: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  fontSize: "14px",
};

const btnStyle = {
  padding: "10px 20px",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
};

export default Billing;