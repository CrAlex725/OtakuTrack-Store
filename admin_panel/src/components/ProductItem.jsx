// admin_panel/src/components/ProductItem.jsx
import React, { useState } from "react";

export default function ProductItem({ product, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState(product.nombre || "");
  const [precio, setPrecio] = useState(product.precio || 0);
  const [categoria, setCategoria] = useState(product.categoria || "");

  const handleSave = async () => {
    await onUpdate(product._id, { nombre, precio, categoria });
    setEditing(false);
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: 8, marginBottom: 8 }}>
      {editing ? (
        <>
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Nombre" />
          <input value={precio} onChange={(e) => setPrecio(e.target.value)} placeholder="Precio" />
          <input value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Categoría (id)" />
          <div style={{ marginTop:8 }}>
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => setEditing(false)} style={{ marginLeft:8 }}>Cancelar</button>
          </div>
        </>
      ) : (
        <>
          <strong>{product.nombre}</strong>
          <div>Precio: {product.precio}</div>
          <div>Categoría: {product.categoria || "—"}</div>
          <div style={{ marginTop:8 }}>
            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={() => onDelete(product._id)} style={{ marginLeft:8 }}>Eliminar</button>
          </div>
        </>
      )}
    </div>
  );
}
