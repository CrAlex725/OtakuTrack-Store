import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./FiltroCategoria.module.css";

function FiltroCategoria() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleChange(e) {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value === "todas") newParams.delete("categoria");
    else newParams.set("categoria", value);
    setSearchParams(newParams);
  }

  const categoriaActual = searchParams.get("categoria") || "todas";

  return (
    <select value={categoriaActual} onChange={handleChange} className={styles.select}>
      <option value="todas">Todas las categorías</option>
      <option value="anime">Anime</option>
      <option value="manga">Manga</option>
      <option value="figuras">Figuras</option>
      <option value="ropa">Ropa</option>
    </select>
  );
}

export default FiltroCategoria;
