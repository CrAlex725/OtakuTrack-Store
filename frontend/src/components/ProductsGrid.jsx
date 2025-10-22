// frontend/src/components/ProductsGrid.jsx
import React from "react";
import styles from "./ProductsGrid.module.css";

function ProductsGrid({ products }) {
  return (
    <div className={styles.grid}>
      {products.map((p) => (
        <div key={p._id} className={styles.card}>
          <img
            src={p.imagen || "/placeholder.jpg"}
            alt={p.nombre}
            className={styles.image}
          />
          <h3>{p.nombre}</h3>
          <p>${p.precio}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductsGrid;