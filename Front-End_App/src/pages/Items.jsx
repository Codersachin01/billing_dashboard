import { useState, useEffect } from "react";
import axios from "axios";

function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ item_code: "", name: "", price: "", is_active: true });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = () => {
    axios.get("http://localhost:5000/items").then((res) => setItems(res.data));
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/items", form).then(() => {
      alert("Item added!");
      fetchItems();
      setForm({ item_code: "", name: "", price: "", is_active: true });
      setShowForm(false);
    });
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "500", color: "#15803d" }}>Items</h2>
        <button onClick={() => setShowForm(!showForm)} style={btnStyle}>
          {showForm ? "Cancel" : "+ Add Item"}
        </button>
      </div>

      {showForm && (
        <div style={cardStyle}>
          <h3 style={{ fontSize: "15px", fontWeight: "500", marginBottom: "16px", color: "#15803d" }}>New Item</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
              <div>
                <label style={labelStyle}>Item Code</label>
                <input name="item_code" placeholder="IT00008" value={form.item_code} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Item Name</label>
                <input name="name" placeholder="Product name" value={form.name} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Selling Price (₹)</label>
                <input name="price" type="number" placeholder="0" value={form.price} onChange={handleChange} required style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Status</label>
                <select name="is_active" value={form.is_active} onChange={handleChange} style={inputStyle}>
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>
            <button type="submit" style={btnStyle}>Save Item</button>
          </form>
        </div>
      )}

      <div style={cardStyle}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#16a34a" }}>
              <th style={thStyle}>Item Code</th>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Price (₹)</th>
              <th style={thStyle}>Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr key={item.id} style={{ background: i % 2 === 0 ? "#fff" : "#f0fdf4" }}>
                <td style={tdStyle}>{item.item_code}</td>
                <td style={tdStyle}>{item.name}</td>
                <td style={tdStyle}>₹{Number(item.price).toLocaleString()}</td>
                <td style={tdStyle}>
                  <span style={{
                    padding: "3px 10px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    background: item.is_active ? "#dcfce7" : "#fee2e2",
                    color: item.is_active ? "#15803d" : "#dc2626",
                  }}>
                    {item.is_active ? "Active" : "Inactive"}
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

export default Items;