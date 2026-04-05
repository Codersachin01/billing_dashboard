import { useState, useEffect } from "react";
import axios from "axios";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    cust_id: "", name: "", address: "", pan: "", gst: "", is_active: true,
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = () => {
    axios.get("http://localhost:5000/customers").then((res) => setCustomers(res.data));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/customers", form).then(() => {
      alert("Customer added!");
      fetchCustomers();
      setForm({ cust_id: "", name: "", address: "", pan: "", gst: "", is_active: true });
      setShowForm(false);
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "500", color: "#15803d" }}>Customers</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? "Cancel" : "+ Add Customer"}
        </button>
      </div>

      {showForm && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "16px", color: "#15803d" }}>New Customer</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={labelStyle}>Customer ID</label>
                <input name="cust_id" placeholder="C00006" value={form.cust_id} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Customer Name</label>
                <input name="name" placeholder="Company name" value={form.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Address</label>
                <input name="address" placeholder="City, State" value={form.address} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>PAN (10 digits)</label>
                <input name="pan" placeholder="ABCDE1234F" value={form.pan} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>GST Number (leave empty if not registered)</label>
                <input name="gst" placeholder="Optional" value={form.gst} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="is_active" value={form.is_active} onChange={handleChange} style={inputStyle}>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" style={btnStyle}>Save Customer</button>
          </form>
        </div>
      )}

      <div style={cardStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#16a34a" }}>
              <th style={thStyle}>Cust ID</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Address</th>
              <th style={thStyle}>PAN</th>
              <th style={thStyle}>GST</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? "#fff" : "#f0fdf4" }}>
                <td style={tdStyle}>{c.cust_id}</td>
                <td style={tdStyle}>{c.name}</td>
                <td style={tdStyle}>{c.address}</td>
                <td style={tdStyle}>{c.pan}</td>
                <td style={tdStyle}>{c.gst || "Not Registered"}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    background: c.is_active ? "#dcfce7" : "#fee2e2",
                    color: c.is_active ? "#15803d" : "#dc2626",
                  }}>
                    {c.is_active ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  background: "#fff",
  border: "0.5px solid #bbf7d0",
  borderRadius: "10px",
  padding: "20px",
  marginBottom: "20px",
};

const inputStyle = {
  width: "100%",
  padding: "8px 10px",
  border: "0.5px solid #bbf7d0",
  borderRadius: "6px",
  fontSize: "13px",
  outline: "none",
  background: "#fff",
};

const labelStyle = {
  display: "block",
  fontSize: "12px",
  color: "#15803d",
  marginBottom: "4px",
  fontWeight: "500",
};

const btnStyle = {
  padding: "8px 18px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "500",
};

const thStyle = {
  padding: "10px 12px",
  textAlign: "left",
  color: "white",
  fontSize: "13px",
  fontWeight: "500",
};

const tdStyle = {
  padding: "10px 12px",
  fontSize: "13px",
  color: "#374151",
  borderBottom: "0.5px solid #dcfce7",
};

export default Customers;