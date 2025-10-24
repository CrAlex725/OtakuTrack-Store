import React, { useEffect, useState } from "react";
import ProductsGrid from "../components/ProductsGrid";
import styles from "./DescubreMas.module.css";

function DescubreMas() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.log("🔄 Cargando productos desde DescubreMas...");
        
        // ✅ Usar ruta relativa - el proxy de Vite se encargará del redireccionamiento
        const res = await fetch("/api/products");
        
        if (!res.ok) {
          throw new Error(`Error HTTP: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("✅ Respuesta completa:", data);
        
        const productosData = data.productos || [];
        console.log("📦 Productos extraídos:", productosData);

        const sorted = productosData
          .sort((a, b) => b.stock - a.stock)
          .slice(0, 30);

        setProducts(sorted);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error al cargar productos en Descubre Más:", err);
        setLoading(false);
      }
    };

    fetchProducts();
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