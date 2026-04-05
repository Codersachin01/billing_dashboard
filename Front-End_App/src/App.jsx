import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Billing from "./pages/Billing";
import Dashboard from "./pages/Dashboard";
import "./index.css";

function Navbar() {
  const location = useLocation();
  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/customers", label: "Customers" },
    { path: "/items", label: "Items" },
    { path: "/billing", label: "Billing" },
  ];
  return (
    <nav style={{
      background: "#16a34a",
      padding: "0 30px",
      display: "flex",
      alignItems: "center",
      height: "56px",
      gap: "8px",
    }}>
      <span style={{
        color: "white",
        fontWeight: "500",
        fontSize: "16px",
        marginRight: "20px",
        letterSpacing: "0.3px",
      }}>
        LogiEdge Billing
      </span>
      {links.map((link) => (
        <Link
          key={link.path}
          to={link.path}
          style={{
            color: location.pathname === link.path ? "white" : "rgba(255,255,255,0.75)",
            textDecoration: "none",
            padding: "6px 14px",
            borderRadius: "6px",
            fontSize: "14px",
            background: location.pathname === link.path ? "rgba(255,255,255,0.2)" : "transparent",
          }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ background: "#f0fdf4", minHeight: "calc(100vh - 56px)", padding: "30px" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/items" element={<Items />} />
          <Route path="/billing" element={<Billing />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;