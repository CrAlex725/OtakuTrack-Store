// frontend/src/components/FiltroDisponibilidad.jsx
import React from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./FiltroDisponibilidad.module.css";

function FiltroDisponibilidad() {
  const [searchParams, setSearchParams] = useSearchParams();
  const valorActual = searchParams.get("filtro_disp") || "todas";

  function handleChange(e) {
    const nuevaDisponibilidad = e.target.value;
    // Mantiene otros filtros intactos
    const nuevosParams = new URLSearchParams(searchParams);
    nuevosParams.set("filtro_disp", nuevaDisponibilidad);
    setSearchParams(nuevosParams);
  }

  return (
    <div className={styles.filtro}>
      <label htmlFor="filtro_disp">Disponibilidad:</label>
      <select id="filtro_disp" value={valorActual} onChange={handleChange}>
        <option value="todas">Todas</option>
        <option value="en_stock">En stock</option>
        <option value="agotado">Agotado</option>
        <option value="preventa">Preventa</option>
      </select>
    </div>
  );
}

export default FiltroDisponibilidad;
