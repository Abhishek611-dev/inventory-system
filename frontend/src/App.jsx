import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Customers from "./pages/Customers";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: "1rem", borderBottom: "1px solid #ddd", display: "flex", gap: "1rem" }}>
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/customers">Customers</NavLink>
        <NavLink to="/orders">Orders</NavLink>
      </nav>

      <main style={{ padding: "1rem" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:id" element={<OrderDetails />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
