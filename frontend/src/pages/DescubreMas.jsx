// frontend/src/pages/DescubreMas.jsx
import React, { useEffect, useState } from "react";
import ProductsGrid from "../components/ProductsGrid";
import styles from "./DescubreMas.module.css";
import axios from "axios";

function DescubreMas() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/products")
      .then((res) => {
        console.log("Respuesta completa:", res.data);
        
        // Extraer los productos del objeto de respuesta
        const data = res.data.productos || [];
        console.log("Productos extraídos:", data);

        // Ordena los productos por stock y limita a 30
        const sorted = data
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 30);

        setProducts(sorted);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar productos en Descubre Más:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className={styles.loading}>Cargando productos...</p>;
  if (!products.length) {
    return <p className={styles.notFound}>No hay productos disponibles.</p>;
  }

  return (
    <div className={styles.descubreMas}>
      <h2 className={styles.title}>Descubre Más</h2>
      <ProductsGrid products={products} />
    </div>
  );
}

export default DescubreMas;