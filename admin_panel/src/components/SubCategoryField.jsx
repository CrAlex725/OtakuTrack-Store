import React from "react";

// Componente recursivo: cada subcategoría puede contener otras subcategorías
export default function SubCategoryField({ data, onChange, onRemove }) {
  const handleChange = (field, value) => {
    onChange({ ...data, [field]: value });
  };

  const addChild = () => {
    const newChildren = [...(data.children || []), { nombre: "", slug: "", children: [] }];
    onChange({ ...data, children: newChildren });
  };

  const updateChild = (index, updatedChild) => {
    const newChildren = data.children.map((child, i) =>
      i === index ? updatedChild : child
    );
    onChange({ ...data, children: newChildren });
  };

  const removeChild = (index) => {
    const newChildren = data.children.filter((_, i) => i !== index);
    onChange({ ...data, children: newChildren });
  };

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: 10,
        marginTop: 10,
        borderRadius: 6,
        background: "#fafafa",
      }}
    >
      <label>Nombre:</label>
      <input
        value={data.nombre}
        onChange={(e) => handleChange("nombre", e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />

      <label>Slug:</label>
      <input
        value={data.slug}
        onChange={(e) => handleChange("slug", e.target.value)}
        style={{ width: "100%", marginBottom: 5 }}
      />

      <div style={{ marginTop: 5 }}>
        <button type="button" onClick={addChild}>
          ➕ Agregar subcategoría interna
        </button>
        <button
          type="button"
          style={{ marginLeft: 10 }}
          onClick={onRemove}
        >
          ❌ Eliminar
        </button>
      </div>

      {/* Renderiza sub-subcategorías si existen */}
      {data.children?.length > 0 && (
        <div style={{ marginLeft: 20, marginTop: 10 }}>
          {data.children.map((child, idx) => (
            <SubCategoryField
              key={idx}
              data={child}
              onChange={(updated) => updateChild(idx, updated)}
              onRemove={() => removeChild(idx)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
