import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrder } from "../api/orderApi";
import { getCustomers } from "../api/customerApi";
import { getProducts } from "../api/productApi";

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [customer, setCustomer] = useState(null);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [orderRes, customersRes, productsRes] = await Promise.all([
          getOrder(id),
          getCustomers(),
          getProducts(),
        ]);
        const o = orderRes.data;
        setOrder(o);
        setCustomer(customersRes.data.find((c) => c.id === o.customer_id) || null);
        setProduct(productsRes.data.find((p) => p.id === o.product_id) || null);
      } catch (err) {
        setError("Order not found.");
        console.error(err);
      }
    }
    load();
  }, [id]);

  if (error) return <div><p style={{ color: "red" }}>{error}</p><button onClick={() => navigate("/orders")}>Back</button></div>;
  if (!order) return <p>Loading…</p>;

  return (
    <div>
      <button onClick={() => navigate("/orders")} style={{ marginBottom: "1rem" }}>← Back to Orders</button>
      <h1>Order #{order.id}</h1>

      <table style={{ borderCollapse: "collapse" }}>
        <tbody>
          <tr><td style={td}><strong>Customer</strong></td><td style={td}>{customer ? `${customer.name} (${customer.email})` : order.customer_id}</td></tr>
          <tr><td style={td}><strong>Product</strong></td><td style={td}>{product ? `${product.name} — SKU: ${product.sku}` : order.product_id}</td></tr>
          <tr><td style={td}><strong>Quantity</strong></td><td style={td}>{order.quantity}</td></tr>
          <tr><td style={td}><strong>Unit Price</strong></td><td style={td}>{product ? `₹${product.price}` : "—"}</td></tr>
          <tr><td style={td}><strong>Total Amount</strong></td><td style={td}>₹{order.total_amount.toFixed(2)}</td></tr>
        </tbody>
      </table>
    </div>
  );
}

const td = { border: "1px solid #ddd", padding: "0.6rem 1rem" };

export default OrderDetails;
