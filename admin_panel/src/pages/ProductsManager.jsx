// admin_panel/src/pages/ProductsManager.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export default function ProductsManager() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    nombre: "",
    slug: "",
    descripcion: "",
    precio: "",
    precio_descuento: "",
    stock: 0,
    categoria: "",
    imagenes: [],
    talla: ""
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🟢 Cargar productos y categorías
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await axios.get(`${API_URL}/api/products`);
    setProducts(res.data.items || res.data);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const res = await axios.get(`${API_URL}/api/categories`);
    setCategories(res.data);
  };

  // 🟡 Manejo de formularios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
    setPreviewImages(files.map((f) => URL.createObjectURL(f)));
  };

  const uploadImages = async () => {
    if (selectedFiles.length === 0) return [];
    const data = new FormData();
    selectedFiles.forEach((f) => data.append("imagenes", f));
    const res = await axios.post(`${API_URL}/api/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.imagenes;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imagenes = formData.imagenes || [];
      if (selectedFiles.length > 0) {
        const uploaded = await uploadImages();
        imagenes = [...imagenes, ...uploaded];
      }
      const payload = { ...formData, imagenes };

      if (editingId) {
        await axios.put(`${API_URL}/api/products/${editingId}`, payload);
        alert("Producto actualizado");
      } else {
        await axios.post(`${API_URL}/api/products`, payload);
        alert("Producto creado");
      }

      setFormData({
        nombre: "",
        slug: "",
        descripcion: "",
        precio: "",
        precio_descuento: "",
        stock: 0,
        categoria: "",
        imagenes: [],
        talla: ""
      });
      setSelectedFiles([]);
      setPreviewImages([]);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Error al guardar producto");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p._id);
    setFormData(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;
    await axios.delete(`${API_URL}/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Gestión de Productos</h2>
      <form onSubmit={handleSubmit}>
        <input name="nombre" placeholder="Nombre" value={formData.nombre} onChange={handleChange} required />
        <input name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} />
        <textarea name="descripcion" placeholder="Descripción" value={formData.descripcion} onChange={handleChange} />
        <input name="precio" type="number" placeholder="Precio" value={formData.precio} onChange={handleChange} />
        <input name="precio_descuento" type="number" placeholder="Precio Descuento" value={formData.precio_descuento} onChange={handleChange} />
        <input name="stock" type="number" placeholder="Stock" value={formData.stock} onChange={handleChange} />
        <select name="categoria" value={formData.categoria} onChange={handleChange}>
          <option value="">-- Sin categoría --</option>
          {categories.map(c => <option key={c._id} value={c._id}>{c.nombre}</option>)}
        </select>

        {/* Subir imágenes */}
        <label>Imágenes</label>
        <input type="file" multiple accept="image/*" onChange={handleFileChange} />
        <div className="previews">
          {previewImages.map((src, i) => (
            <img key={i} src={src} alt="preview" width={80} height={80} />
          ))}
        </div>

        {formData.categoriaNombre === "Ropa" && (
          <>
            <label>Talla</label>
            <input name="talla" placeholder="Ej: M, L, XL" value={formData.talla} onChange={handleChange} />
          </>
        )}

        <button type="submit">{editingId ? "Actualizar" : "Crear"} producto</button>
      </form>

      <h3>Productos</h3>
      {loading ? <p>Cargando...</p> : (
        <table>
          <thead>
            <tr>
              <th>Nombre</th><th>Precio</th><th>Categoría</th><th>Imágenes</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td>{p.nombre}</td>
                <td>${p.precio}</td>
                <td>{p.categoria?.nombre}</td>
                <td>{p.imagenes?.length}</td>
                <td>
                  <button onClick={() => handleEdit(p)}>Editar</button>
                  <button onClick={() => handleDelete(p._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
