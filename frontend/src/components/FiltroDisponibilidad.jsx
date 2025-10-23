// frontend/src/components/FiltroDisponibilidad.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./FiltroDisponibilidad.module.css";

function FiltroDisponibilidad() {
  const [searchParams, setSearchParams] = useSearchParams();


  function handleChange(e) {
    const value = e.target.value;
    // Mantiene otros filtros intactos
    const nuevosParams = new URLSearchParams(searchParams);
    if (value === "todas") nuevosParams.delete("filtro_disp");
    else nuevosParams.set("filtro_disp", value);
    setSearchParams(nuevosParams);
  }

  const valorActual = searchParams.get("filtro_disp") || "todas";

  return (
    <select value={valorActual} onChange={handleChange} className={styles.select}>
      <option value="todas">Todas las disponibilidades</option>
      <option value="disponible">Disponible</option>
      <option value="agotado">Agotado</option>
    </select>
  );
}

export default FiltroDisponibilidad;
