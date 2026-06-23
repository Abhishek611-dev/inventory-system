import { useEffect, useState } from "react";
import { getProducts } from "../api/productApi";
import { getCustomers } from "../api/customerApi";
import { getOrders } from "../api/orderApi";

function Dashboard() {
  const [stats, setStats] = useState({ products: 0, customers: 0, orders: 0, revenue: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [productsRes, customersRes, ordersRes] = await Promise.all([
          getProducts(),
          getCustomers(),
          getOrders(),
        ]);

        const revenue = ordersRes.data.reduce((sum, o) => sum + o.total_amount, 0);

        setStats({
          products: productsRes.data.length,
          customers: customersRes.data.length,
          orders: ordersRes.data.length,
          revenue,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    }

    loadStats();
  }, []);

  const cards = [
    { label: "Products", value: stats.products },
    { label: "Customers", value: stats.customers },
    { label: "Orders", value: stats.orders },
    { label: "Total Revenue", value: `₹${stats.revenue.toFixed(2)}` },
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1.5rem",
              minWidth: "160px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>{card.value}</div>
            <div style={{ color: "#666", marginTop: "0.25rem" }}>{card.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
