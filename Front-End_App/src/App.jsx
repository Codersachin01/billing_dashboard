import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Billing from "./pages/Billing";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "15px 30px", background: "#1a1a2e", display: "flex", gap: "30px", alignItems: "center" }}>
        <span style={{ color: "#e94560", fontWeight: "bold", fontSize: "18px" }}>LogiEdge</span>
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>Dashboard</Link>
        <Link to="/customers" style={{ color: "white", textDecoration: "none" }}>Customers</Link>
        <Link to="/items" style={{ color: "white", textDecoration: "none" }}>Items</Link>
        <Link to="/billing" style={{ color: "white", textDecoration: "none" }}>Billing</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/items" element={<Items />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;