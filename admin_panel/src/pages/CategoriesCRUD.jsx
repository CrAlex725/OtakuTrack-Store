import React, { useEffect, useState } from "react";
import { getCategories, deleteCategory } from "../services/api.js";
import CategoryForm from "../components/CategoryForm.js";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [editing, setEditing] = useState(null);

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleDelete = async (id) => {
    await deleteCategory(id);
    loadCategories();
  };

  return (
    <div className="admin-page">
      <h1>Categorías</h1>
      <CategoryForm onSaved={loadCategories} editing={editing} setEditing={setEditing} />
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Slug</th>
            <th>Tipo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.nombre}</td>
              <td>{cat.slug}</td>
              <td>{cat.tipo}</td>
              <td>
                <button onClick={() => setEditing(cat)}>Editar</button>
                <button onClick={() => handleDelete(cat._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
