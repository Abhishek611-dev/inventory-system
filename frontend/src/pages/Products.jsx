import { useEffect, useState } from "react";
import { getProducts, createProduct, deleteProduct } from "../api/productApi";

const emptyForm = { name: "", sku: "", price: "", quantity: "" };

function Products() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      await createProduct({
        name: form.name,
        sku: form.sku,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      });
      setForm(emptyForm);
      loadProducts();
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create product");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    try {
      await deleteProduct(id);
      loadProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  }

  return (
    <div>
      <h1>Products</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "1.5rem", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
        <input placeholder="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Quantity" type="number" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
        <button type="submit">Add Product</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>SKU</th>
            <th style={th}>Price</th>
            <th style={th}>Stock</th>
            <th style={th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td style={td}>{product.name}</td>
              <td style={td}>{product.sku}</td>
              <td style={td}>₹{product.price}</td>
              <td style={td}>{product.quantity}</td>
              <td style={td}>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
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

export default Products;
