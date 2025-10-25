// src/pages/ProductsCRUD.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ProductsCRUD() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", price: "" });
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
  setLoading(true);
  setError(null);
  try {
    const res = await api.get("/api/products");
    
    // DEBUG: Ver qué devuelve el backend
    console.log("Respuesta completa:", res);
    console.log("res.data:", res.data);
    console.log("Tipo de res.data:", typeof res.data);
    
    // Determinar la estructura correcta
    let productsData;
    if (Array.isArray(res.data)) {
      productsData = res.data; // Si es array directo
    } else if (res.data && Array.isArray(res.data.data)) {
      productsData = res.data.data; // Si es { data: [...] }
    } else if (res.data && Array.isArray(res.data.products)) {
      productsData = res.data.products; // Si es { products: [...] }
    } else {
      productsData = []; // Por defecto array vacío
    }
    
    console.log("productsData final:", productsData);
    setProducts(productsData);
  } catch (e) {
    setError("No se pudieron cargar productos. Revisa backend y CORS.");
    console.error(e);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (ev) => {
    ev.preventDefault();
    setError(null);
    try {
      const payload = { 
        nombre: form.title, 
        precio: parseFloat(form.price) || 0 };
      // eslint-disable-next-line no-unused-vars
      const res = await api.post("/api/products", payload); // ajusta ruta si hace falta
      // idealmente backend retorna el producto creado; si no, recarga
      await fetchProducts();
      setForm({ title: "", price: "" });
    } catch (e) {
      setError("Error creando producto.");
      console.error(e);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar producto?")) return;
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((p) => p.filter((x) => String(x._id || x.id) !== String(id)));
    } catch (e) {
      setError("Error eliminando producto.");
      console.error(e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Productos</h1>
      {error && <div style={{ color: "crimson" }}>{error}</div>}
      <section style={{ margin: "1rem 0" }}>
        <form onSubmit={handleCreate} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            placeholder="Título"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Precio"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          <button type="submit">Crear</button>
        </form>
      </section>

      <section>
        {loading ? (
          <div>Cargando productos...</div>
        ) : products.length === 0 ? (
          <div>No hay productos (respuesta vacía del backend).</div>
        ) : (
          <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const id = p._id ?? p.id ?? "(sin id)";
                return (
                  <tr key={id}>
                    <td style={{ maxWidth: 200, overflow: "hidden" }}>{id}</td>
                    <td>{p.nombre ?? p.name ?? "—"}</td>
                    <td>{p.precio ?? "—"}</td>
                    <td>
                      <button onClick={() => handleDelete(id)}>Eliminar</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
