// admin_panel/src/components/CategoryItem.jsx
import React, { useState } from "react";

export default function CategoryItem({ node, onCreateChild, onUpdate, onDelete }) {
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nombre, setNombre] = useState(node.nombre || "");
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState("");

  const handleSave = async () => {
    await onUpdate(node._id, { nombre });
    setEditing(false);
  };

  const handleAddChild = async () => {
    if (!newChildName.trim()) return;
    await onCreateChild(node._id, newChildName.trim());
    setNewChildName("");
    setShowAddChild(false);
    setExpanded(true);
  };

  return (
    <div style={{ borderLeft: "1px solid #ddd", paddingLeft: 10, marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setExpanded((s) => !s)}>{expanded ? "▾" : "▸"}</button>

        {editing ? (
          <>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <button onClick={handleSave}>Guardar</button>
            <button onClick={() => { setEditing(false); setNombre(node.nombre); }}>Cancelar</button>
          </>
        ) : (
          <>
            <strong>{node.nombre}</strong>
            <small style={{ color: "#666", marginLeft: 8 }}>{node.slug}</small>

            <button onClick={() => setEditing(true)}>Editar</button>
            <button onClick={() => onDelete(node._id)}>Eliminar</button>
            <button onClick={() => setShowAddChild((s) => !s)}>Agregar Sub</button>
          </>
        )}
      </div>

      {showAddChild && (
        <div style={{ marginTop: 8 }}>
          <input value={newChildName} onChange={(e) => setNewChildName(e.target.value)} placeholder="Nombre subcategoría" />
          <button onClick={handleAddChild}>Agregar</button>
        </div>
      )}

      {expanded && node.children && node.children.length > 0 && (
        <div style={{ marginTop: 8, marginLeft: 12 }}>
          {node.children.map((child) => (
            <CategoryItem
              key={child._id}
              node={child}
              onCreateChild={onCreateChild}
              onUpdate={onUpdate}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
