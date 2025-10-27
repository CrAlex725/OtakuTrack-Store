import React, { useEffect, useState } from "react";
import { getCategories, createProduct, updateProduct } from "../services/api.js";

export default function ProductForm({ onSaved, editing, setEditing }) {
  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: "",
    categoria_id: "",
    descripcion_larga: "",
  });
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    getCategories().then((res) => setCategorias(res.data));
    if (editing) setForm(editing);
  }, [editing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await updateProduct(editing._id, form);
      setEditing(null);
    } else {
      await createProduct(form);
    }
    setForm({ nombre: "", precio: "", stock: "", categoria_id: "", descripcion_larga: "" });
    onSaved();
  };

  return (
    <form onSubmit={handleSubmit} className="admin-form">
      <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del producto" />
      <input name="precio" value={form.precio} onChange={handleChange} placeholder="Precio" />
      <input name="stock" value={form.stock} onChange={handleChange} placeholder="Stock" />
      <select name="categoria_id" value={form.categoria_id} onChange={handleChange}>
        <option value="">Seleccionar categoría</option>
        {categorias.map((c) => (
          <option key={c._id} value={c._id}>{c.nombre}</option>
        ))}
      </select>
      <textarea name="descripcion_larga" value={form.descripcion_larga} onChange={handleChange} placeholder="Descripción" />
      <button type="submit">{editing ? "Actualizar" : "Crear"}</button>
    </form>
  );
}
