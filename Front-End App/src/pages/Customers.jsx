import { useState, useEffect } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    cust_id: "",
    name: "",
    address: "",
    pan: "",
    gst: "",
    is_active: true,
  });

  // This fetches all customers when page get load
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = () => {
    axios.get("http://localhost:5000/customers").then((res) => {
      setCustomers(res.data);
    });
  };

  // This handles form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // It is submit form
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/customers", form).then(() => {
      alert("Customer added successfully!");
      fetchCustomers();
      setForm({ cust_id: "", name: "", address: "", pan: "", gst: "", is_active: true });
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Customers</h2>

      {/* Here adding customer form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", marginBottom: "30px" }}>
        <input name="cust_id" placeholder="Customer ID (e.g. C00001)" value={form.cust_id} onChange={handleChange} required style={inputStyle} />
        <input name="name" placeholder="Customer Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required style={inputStyle} />
        <input name="pan" placeholder="PAN (10 digits)" value={form.pan} onChange={handleChange} required style={inputStyle} />
        <input name="gst" placeholder="GST Number (15 digits) — leave empty if not registered" value={form.gst} onChange={handleChange} style={inputStyle} />
        <select name="is_active" value={form.is_active} onChange={handleChange} style={inputStyle}>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        <button type="submit" style={btnStyle}>Add Customer</button>
      </form>

      {/* It is customer list */}
      <h3>All Customers</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1a1a2e", color: "white" }}>
            <th style={thStyle}>Cust ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Address</th>
            <th style={thStyle}>PAN</th>
            <th style={thStyle}>GST</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{c.cust_id}</td>
              <td style={tdStyle}>{c.name}</td>
              <td style={tdStyle}>{c.address}</td>
              <td style={tdStyle}>{c.pan}</td>
              <td style={tdStyle}>{c.gst || "Not Registered"}</td>
              <td style={tdStyle}>{c.is_active ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>
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
  padding: "10px",
  background: "#1a1a2e",
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "14px",
};

const thStyle = {
  padding: "10px",
  textAlign: "left",
};

const tdStyle = {
  padding: "10px",
};

export default Customers;