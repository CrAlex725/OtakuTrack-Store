// src/pages/CategoriesCRUD.jsx
import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function CategoriesCRUD() {
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/categories"); // ajusta según tu backend
        setCats(Array.isArray(res.data) ? res.data : res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const createCat = async (ev) => {
    ev.preventDefault();
    try {
      await api.post("/api/categories", { nombre: name });
      setName("");
      // reload
      const r = await api.get("/api/categories");
      setCats(Array.isArray(r.data) ? r.data : r.data || []);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h1>Categorías</h1>
      <form onSubmit={createCat} style={{ marginBottom: 12 }}>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Crear</button>
      </form>

      {loading ? (
        <div>Cargando...</div>
      ) : (
        <ul>
          {cats.map((c) => (
            <li key={c._id ?? c.id}>{c.nombre ?? c.name ?? c.title ?? "—"}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
