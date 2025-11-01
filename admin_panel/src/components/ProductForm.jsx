// admin_panel/src/components/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { fetchParentCategories } from "../api";

export default function ProductForm({ onCreate }) {
  const [product, setProduct] = useState({ nombre: "", descripcion: "", precio: "", categoria: "" });
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchParentCategories().then(res => {
      if (res && res.data) setCategories(res.data);
    }).catch(()=>{});
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!product.nombre.trim()) return;
    onCreate(product);
    setProduct({ nombre: "", descripcion: "", precio: "", categoria: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 12 }}>
      <input placeholder="Nombre" value={product.nombre} onChange={e=>setProduct({...product, nombre:e.target.value})} />
      <input placeholder="Descripción" value={product.descripcion} onChange={e=>setProduct({...product, descripcion:e.target.value})} />
      <input placeholder="Precio" value={product.precio} onChange={e=>setProduct({...product, precio:e.target.value})} />
      <select value={product.categoria} onChange={e=>setProduct({...product, categoria:e.target.value})}>
        <option value="">Sin categoría</option>
        {categories.map(c=> <option key={c._id} value={c._id}>{c.nombre}</option>)}
      </select>
      <button type="submit" style={{ display: 'block', marginTop: 8 }}>Crear Producto</button>
    </form>
  );
}
