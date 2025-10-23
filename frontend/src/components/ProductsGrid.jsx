// frontend/src/components/ProductsGrid.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ProductsGrid.module.css";
import default1 from "../assets/ImagenPorDefecto1.jpeg";
import default2 from "../assets/ImagenPorDefecto2.jpeg";
import default3 from "../assets/ImagenPorDefecto3.jpeg";

const defaultImages = [default1, default2, default3];

function ProductsGrid({ products }) {
  const navigate = useNavigate();

  return (
    <div className={styles.grid}>
      {products.map((p, index) => {
        const image =
          p.imagenes?.[0] || p.imagen || defaultImages[index % defaultImages.length];

        return (
          <div
            key={p._id || p.id}
            className={styles.card}
            onClick={() => navigate(`/product/${p._id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={image} alt={p.nombre} className={styles.productImage} />
            <div className={styles.info}>
              <h3>{p.nombre}</h3>
              <p className={styles.price}>${p.precio}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProductsGrid;
