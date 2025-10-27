// frontend/src/pages/DescubreMas.jsx
import React, { useEffect, useState } from "react";
import ProductsGrid from "../components/ProductsGrid.jsx";
import styles from "./DescubreMas.module.css";
import { getProducts, getCurrentUser } from "../services/api.js";

function DescubreMas() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Intentamos obtener preferencias del usuario
        const user = await getCurrentUser();
        let params = { page: 1, pageSize: 60, sort: "stock_desc" };

        // Si el backend devuelve preferencias/historial con categorías vistas
        if (user && user.preferencias && user.preferencias.categoriasVistas?.length) {
          params.categoria = user.preferencias.categoriasVistas[0]; // ejemplo: priorizar la primera categoría vista
        }

        // Si no hay user o preferencias, fallback: top por stock
        const data = await getProducts(params);
        const items = Array.isArray(data) ? data : (data.items || []);
        setProducts(items);
      } catch (err) {
        console.error("Error en DescubreMas:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
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
