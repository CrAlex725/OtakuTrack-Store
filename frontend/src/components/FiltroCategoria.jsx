import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./FiltroCategoria.module.css";

function FiltroCategoria() {
  const [searchParams, setSearchParams] = useSearchParams();
  const valorActual = searchParams.get("categoria") || "todas";

  const handleChange = (e) => {
    const nuevaCategoria = e.target.value;
    const nuevosParams = new URLSearchParams(searchParams);
    nuevosParams.set("categoria", nuevaCategoria);
    setSearchParams(nuevosParams);
  };

  // Proximamente categorías cargadas desde el backend
  return (
    <div className={styles.filtro}>
      <label htmlFor="categoria">Categoría:</label>
      <select id="categoria" value={valorActual} onChange={handleChange}>
        <option value="todas">Todas</option>
        <option value="figuras">Figuras</option>
        <option value="mangas">Mangas</option>
        <option value="ropa">Ropa</option>
        <option value="accesorios">Accesorios</option>
      </select>
    </div>
  );
}

export default FiltroCategoria;
