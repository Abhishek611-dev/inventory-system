import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, createOrder, deleteOrder } from "../api/orderApi";
import { getCustomers } from "../api/customerApi";
import { getProducts } from "../api/productApi";

const emptyForm = { customer_id: "", product_id: "", quantity: "" };

function Orders() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadAll();
  }, []);

  async function loadAll() {
    try {
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        getOrders(),
        getCustomers(),
        getProducts(),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      console.error("Error loading orders page:", err);
    }
  }

  function customerName(id) {
    return customers.find((c) => c.id === id)?.name || id;
  }

  function productName(id) {
    return products.find((p) => p.id === id)?.name || id;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createOrder({
        customer_id: parseInt(form.customer_id, 10),
        product_id: parseInt(form.product_id, 10),
        quantity: parseInt(form.quantity, 10),
      });
      setForm(emptyForm);
      loadAll();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create order");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Cancel this order?")) return;
    try {
      await deleteOrder(id);
      loadAll();
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  }

  return (
    <div>
      <h1>Orders</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <select value={form.customer_id} onChange={(e) => setForm({ ...form, customer_id: e.target.value })} required>
          <option value="">Select customer</option>
          {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <select value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required>
          <option value="">Select product</option>
          {products.map((p) => <option key={p.id} value={p.id}>{p.name} (stock: {p.quantity})</option>)}
        </select>
        <input placeholder="Quantity" type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <button type="submit">Place Order</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Order ID</th>
            <th style={th}>Customer</th>
            <th style={th}>Product</th>
            <th style={th}>Qty</th>
            <th style={th}>Total</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td style={td}>#{order.id}</td>
              <td style={td}>{customerName(order.customer_id)}</td>
              <td style={td}>{productName(order.product_id)}</td>
              <td style={td}>{order.quantity}</td>
              <td style={td}>₹{order.total_amount.toFixed(2)}</td>
              <td style={td}>
                <button onClick={() => navigate(`/orders/${order.id}`)} style={{ marginRight: "0.5rem" }}>Details</button>
                <button onClick={() => handleDelete(order.id)}>Cancel</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = { borderBottom: "2px solid #ddd", padding: "0.5rem", textAlign: "left" };
const td = { borderBottom: "1px solid #eee", padding: "0.5rem" };

export default Orders;
