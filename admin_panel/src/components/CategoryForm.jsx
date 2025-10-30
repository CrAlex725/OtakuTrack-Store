// admin_panel/src/components/CategoryForm.jsx
import React, { useState } from "react";
import axios from "../api";

function CategoryForm() {
  const [category, setCategory] = useState({
    nombre: "",
    slug: "",
    children: [],
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // 🔤 Genera slug automáticamente
  const generateSlug = (text) =>
    text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();

  // 🧩 Agregar subcategoría a la raíz
  const addSubcategory = () => {
    setCategory((prev) => ({
      ...prev,
      children: [
        ...prev.children,
        { nombre: "", slug: "", children: [] },
      ],
    }));
  };

  // 🧩 Agregar sub-subcategoría dentro de una subcategoría
  const addSubSubcategory = (index) => {
    const updated = { ...category };
    updated.children[index].children.push({
      nombre: "",
      slug: "",
      children: [],
    });
    setCategory(updated);
  };

  // 🗑️ Eliminar subcategoría o sub-subcategoría
  const removeSubcategory = (index) => {
    const updated = { ...category };
    updated.children.splice(index, 1);
    setCategory(updated);
  };

  const removeSubSubcategory = (parentIndex, subIndex) => {
    const updated = { ...category };
    updated.children[parentIndex].children.splice(subIndex, 1);
    setCategory(updated);
  };

  // ✏️ Cambiar nombre de categoría principal
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory({
      ...category,
      nombre: value,
      slug: generateSlug(value),
    });
  };

  // ✏️ Cambiar nombre de subcategoría
  const handleSubcategoryChange = (index, value) => {
    const updated = { ...category };
    updated.children[index].nombre = value;
    updated.children[index].slug = generateSlug(value);
    setCategory(updated);
  };

  // ✏️ Cambiar nombre de sub-subcategoría
  const handleSubSubcategoryChange = (parentIndex, subIndex, value) => {
    const updated = { ...category };
    updated.children[parentIndex].children[subIndex].nombre = value;
    updated.children[parentIndex].children[subIndex].slug = generateSlug(value);
    setCategory(updated);
  };

  // 🚀 Enviar categoría completa al backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      console.log("📦 Enviando:", category);
      const res = await axios.post("/api/categories", category);
      setMessage(`✅ Categoría creada correctamente: ${res.data.nombre || "sin nombre"}`);
      setCategory({ nombre: "", slug: "", children: [] });
    } catch (err) {
      console.error("❌ Error:", err.response?.data || err.message);
      setMessage("❌ Error al crear la categoría");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "auto" }}>
      <h2>Crear Categoría</h2>
      <form onSubmit={handleSubmit}>
        {/* Categoría principal */}
        <div>
          <label>Nombre de la categoría principal:</label>
          <input
            type="text"
            value={category.nombre}
            onChange={handleCategoryChange}
            required
          />
          <p><b>Slug:</b> {category.slug}</p>
        </div>

        {/* Subcategorías */}
        <div style={{ marginTop: "1rem" }}>
          <h3>Subcategorías</h3>
          {category.children.map((sub, i) => (
            <div
              key={i}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
              }}
            >
              <input
                type="text"
                placeholder="Nombre de subcategoría"
                value={sub.nombre}
                onChange={(e) =>
                  handleSubcategoryChange(i, e.target.value)
                }
              />
              <button
                type="button"
                onClick={() => removeSubcategory(i)}
                style={{ marginLeft: "8px" }}
              >
                ❌
              </button>
              <p><b>Slug:</b> {sub.slug}</p>

              {/* Sub-subcategorías */}
              <div style={{ marginLeft: "1rem" }}>
                <h4>Sub-Subcategorías</h4>
                {sub.children.map((child, j) => (
                  <div key={j}>
                    <input
                      type="text"
                      placeholder="Nombre de sub-subcategoría"
                      value={child.nombre}
                      onChange={(e) =>
                        handleSubSubcategoryChange(i, j, e.target.value)
                      }
                    />
                    <button
                      type="button"
                      onClick={() => removeSubSubcategory(i, j)}
                      style={{ marginLeft: "8px" }}
                    >
                      ❌
                    </button>
                    <p><b>Slug:</b> {child.slug}</p>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSubSubcategory(i)}
                  style={{ marginTop: "4px" }}
                >
                  ➕ Agregar Sub-Subcategoría
                </button>
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={addSubcategory}
            style={{ marginTop: "10px" }}
          >
            ➕ Agregar Subcategoría
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{ display: "block", marginTop: "20px" }}
        >
          {loading ? "Creando..." : "Crear Categoría"}
        </button>
      </form>

      {message && <p style={{ marginTop: "15px" }}>{message}</p>}
    </div>
  );
}

export default CategoryForm;
