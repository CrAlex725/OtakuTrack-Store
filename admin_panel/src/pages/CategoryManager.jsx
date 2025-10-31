// admin_panel/src/pages/CategoryManager.jsx
import React, { useEffect, useState } from "react";
import {
  fetchCategoriesTree,
  createCategory,
  createChild,
  updateCategory,
  deleteCategory,
} from "../api";
import CategoryItem from "../components/CategoryItem";

export default function CategoryManager() {
  const [tree, setTree] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const loadTree = async () => {
    setLoading(true);
    try {
      const res = await fetchCategoriesTree();
      setTree(res.data);
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar árbol");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, []);

  // Crear categoría raíz simple (sin hijos)
  const handleCreateRoot = async (nombre) => {
    setMessage("");
    try {
      const slug = nombre.trim().toLowerCase().replace(/\s+/g, "-");
      await createCategory({ nombre, slug, tipo: "principal" });
      await loadTree();
      setMessage("Categoría creada");
    } catch (err) {
      console.error(err);
      setMessage("Error al crear");
    }
  };

  // wrapper para crear child en backend
  const handleCreateChild = async (parentId, nombre) => {
    setMessage("");
    try {
      const slug = nombre.trim().toLowerCase().replace(/\s+/g, "-");
      await createChild(parentId, { nombre, slug });
      await loadTree();
      setMessage("Subcategoría creada");
    } catch (err) {
      console.error(err);
      setMessage("Error al crear subcategoría");
    }
  };

  const handleUpdate = async (id, payload) => {
    setMessage("");
    try {
      await updateCategory(id, payload);
      await loadTree();
      setMessage("Categoría actualizada");
    } catch (err) {
      console.error(err);
      setMessage("Error al actualizar");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Eliminar categoría y todas sus subcategorías?")) return;
    setMessage("");
    try {
      await deleteCategory(id);
      await loadTree();
      setMessage("Eliminada");
    } catch (err) {
      console.error(err);
      setMessage("Error al eliminar");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Admin — Categorías</h1>

      <CreateRootForm onCreate={handleCreateRoot} />

      <div style={{ marginTop: 20 }}>
        <h2>Árbol de categorías</h2>
        {loading ? (
          <p>Cargando...</p>
        ) : tree.length === 0 ? (
          <p>No hay categorías</p>
        ) : (
          <div>
            {tree.map((node) => (
              <CategoryItem
                key={node._id}
                node={node}
                onCreateChild={handleCreateChild}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {message && <p style={{ marginTop: 12 }}>{message}</p>}
    </div>
  );
}

function CreateRootForm({ onCreate }) {
  const [nombre, setNombre] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!nombre.trim()) return;
        onCreate(nombre.trim());
        setNombre("");
      }}
      style={{ display: "flex", gap: 8 }}
    >
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nueva categoría (raíz)" />
      <button type="submit">Crear</button>
    </form>
  );
}
