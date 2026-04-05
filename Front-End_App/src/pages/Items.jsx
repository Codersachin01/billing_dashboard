import { useState, useEffect } from "react";
import axios from "axios";

function Items() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    item_code: "",
    name: "",
    price: "",
    is_active: true,
  });

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = () => {
    axios.get("http://localhost:5000/items").then((res) => {
      setItems(res.data);
    });
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/items", form).then(() => {
      alert("Item added successfully!");
      fetchItems();
      setForm({ item_code: "", name: "", price: "", is_active: true });
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Items</h2>

      {/* Here adding item form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", marginBottom: "30px" }}>
        <input name="item_code" placeholder="Item Code (e.g. IT00001)" value={form.item_code} onChange={handleChange} required style={inputStyle} />
        <input name="name" placeholder="Item Name" value={form.name} onChange={handleChange} required style={inputStyle} />
        <input name="price" placeholder="Selling Price" type="number" value={form.price} onChange={handleChange} required style={inputStyle} />
        <select name="is_active" value={form.is_active} onChange={handleChange} style={inputStyle}>
          <option value={true}>Active</option>
          <option value={false}>Inactive</option>
        </select>
        <button type="submit" style={btnStyle}>Add Item</button>
      </form>

      {/* It is customer list */}
      <h3>All Items</h3>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#1a1a2e", color: "white" }}>
            <th style={thStyle}>Item Code</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Price (₹)</th>
            <th style={thStyle}>Status</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td style={tdStyle}>{item.item_code}</td>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>₹{item.price}</td>
              <td style={tdStyle}>{item.is_active ? "Active" : "Inactive"}</td>
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

export default Items;