import { useState, useEffect } from "react";
import axios from "axios";

function Dashboard() {
  const [invoices, setInvoices] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [searchError, setSearchError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");

  useEffect(() => {
    fetchInvoices();
    axios.get("http://localhost:5000/customers").then((res) => {
      setCustomers(res.data);
    });
  }, []);

  const fetchInvoices = () => {
    axios.get("http://localhost:5000/invoices").then((res) => {
      setInvoices(res.data);
    });
  };

  // Here we can search invoice by ID
  const handleSearch = () => {
    if (!searchId) return alert("Please enter invoice ID");
    setSearchResult(null);
    setSearchError("");
    axios
      .get(`http://localhost:5000/invoices/search/${searchId}`)
      .then((res) => {
        setSearchResult(res.data);
      })
      .catch(() => {
        setSearchError("Invoice not found");
      });
  };

  // Here we can filter customer
  const handleCustomerFilter = (e) => {
    setSelectedCustomer(e.target.value);
    if (e.target.value === "") {
      fetchInvoices();
    } else {
      axios
        .get(`http://localhost:5000/invoices/customer/${e.target.value}`)
        .then((res) => {
          setInvoices(res.data);
        });
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Dashboard</h2>

      {/* SEARCH BY INVOICE ID */}
      <div style={{ marginBottom: "30px", background: "#f5f5f5", padding: "20px", borderRadius: "8px" }}>
        <h3>Search Invoice by ID</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="Enter Invoice ID (e.g. INVC224830)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={inputStyle}
          />
          <button onClick={handleSearch} style={btnStyle}>
            Search
          </button>
          <button
            onClick={() => { setSearchResult(null); setSearchError(""); setSearchId(""); }}
            style={{ ...btnStyle, background: "#888" }}
          >
            Clear
          </button>
        </div>

        {/* SEARCH RESULT */}
        {searchResult && (
          <div style={{ marginTop: "15px", background: "white", padding: "15px", borderRadius: "8px", borderLeft: "4px solid green" }}>
            <p><strong>Invoice ID:</strong> {searchResult.invoice_id}</p>
            <p><strong>Customer:</strong> {searchResult.customer_name}</p>
            <p><strong>Total Amount:</strong> ₹{searchResult.total_amount}</p>
            <p><strong>GST Applied:</strong> {searchResult.gst_applied ? "Yes (18%)" : "No"}</p>
          </div>
        )}
        {searchError && (
          <p style={{ color: "red", marginTop: "10px" }}>{searchError}</p>
        )}
      </div>

      {/* FILTER BY CUSTOMER */}
      <div style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "15px" }}>
        <label style={{ fontWeight: "bold" }}>Filter by Customer:</label>
        <select
          value={selectedCustomer}
          onChange={handleCustomerFilter}
          style={{ ...inputStyle, width: "300px" }}
        >
          <option value="">-- All Customers --</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cust_id} — {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* ALL INVOICES TABLE */}
      <h3>
        {selectedCustomer
          ? `Invoices for selected customer`
          : `All Recent Invoices`}
        <span style={{ fontSize: "14px", fontWeight: "normal", marginLeft: "10px", color: "#888" }}>
          ({invoices.length} records)
        </span>
      </h3>

      {invoices.length === 0 ? (
        <p style={{ color: "#888" }}>No invoices found.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#1a1a2e", color: "white" }}>
              <th style={thStyle}>Invoice ID</th>
              <th style={thStyle}>Customer</th>
              <th style={thStyle}>Subtotal</th>
              <th style={thStyle}>GST</th>
              <th style={thStyle}>Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{inv.invoice_id}</td>
                <td style={tdStyle}>{inv.customer_name}</td>
                <td style={tdStyle}>₹{inv.total_amount}</td>
                <td style={tdStyle}>
                  {inv.gst_applied ? (
                    <span style={{ color: "orange" }}>Yes (18%)</span>
                  ) : (
                    <span style={{ color: "green" }}>No</span>
                  )}
                </td>
                <td style={tdStyle}>₹{inv.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default Dashboard;