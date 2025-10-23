import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./FiltroOrden.module.css";

function FiltroOrden() {
  const [searchParams, setSearchParams] = useSearchParams();

  function handleChange(e) {
    const value = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    if (value === "default") newParams.delete("orden");
    else newParams.set("orden", value);
    setSearchParams(newParams);
  }

  const ordenActual = searchParams.get("orden") || "default";

  return (
    <select
      value={ordenActual}
      onChange={handleChange}
      className={styles.select}
    >
      <option value="default">Ordenar por...</option>
      <option value="precio-asc">Precio: menor a mayor</option>
      <option value="precio-desc">Precio: mayor a menor</option>
      <option value="nombre-asc">Nombre: A–Z</option>
      <option value="nombre-desc">Nombre: Z–A</option>
    </select>
  );
}

export default FiltroOrden;
