import { useEffect, useState } from "react";
import { getCustomers, createCustomer, deleteCustomer } from "../api/customerApi";

const emptyForm = { name: "", email: "", phone: "" };

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    try {
      const response = await getCustomers();
      setCustomers(response.data);
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createCustomer(form);
      setForm(emptyForm);
      loadCustomers();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create customer");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this customer?")) return;
    try {
      await deleteCustomer(id);
      loadCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
    }
  }

  return (
    <div>
      <h1>Customers</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
        <button type="submit">Add Customer</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Phone</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.id}>
              <td style={td}>{customer.name}</td>
              <td style={td}>{customer.email}</td>
              <td style={td}>{customer.phone}</td>
              <td style={td}>
                <button onClick={() => handleDelete(customer.id)}>Delete</button>
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

export default Customers;
