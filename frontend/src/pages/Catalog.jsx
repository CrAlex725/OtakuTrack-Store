// frontend/src/pages/Catalog.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./Catalog.module.css";
import ProductsGrid from "../components/ProductsGrid";
import FiltroDisponibilidad from "../components/FiltroDisponibilidad";
import FiltroCategoria from "../components/FiltroCategoria";
import FiltroOrden from "../components/FiltroOrden";

const PAGE_SIZE = 30;

function Catalog() {
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchParams] = useSearchParams();

  // 🎯 Todos los filtros combinados
  const filtros = {
    disponibilidad: searchParams.get("filtro_disp") || "todas",
    categoria: searchParams.get("categoria") || "todas",
    orden: searchParams.get("orden") || "default",
  };

  useEffect(() => {
    loadPage(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtros.disponibilidad, filtros.categoria, filtros.orden]);

  async function fetchProductsFromApi(pageNumber) {
    try {
      const res = await fetch(
        `http://localhost:3001/api/products?page=${pageNumber}&limit=${PAGE_SIZE}`
      );
      if (!res.ok) throw new Error("Error al obtener productos");

      const data = await res.json();
      let productosFiltrados = data.productos || [];

      // 🧩 Filtro de disponibilidad
      if (filtros.disponibilidad !== "todas") {
        productosFiltrados = productosFiltrados.filter(
          (p) => p.disponibilidad === filtros.disponibilidad
        );
      }

      // 🧩 Filtro de categoría
      if (filtros.categoria !== "todas") {
        productosFiltrados = productosFiltrados.filter(
          (p) => p.categoria === filtros.categoria
        );
      }

      // 🧩 Ordenamiento
      if (filtros.orden === "precio-asc") {
        productosFiltrados.sort((a, b) => a.precio - b.precio);
      } else if (filtros.orden === "precio-desc") {
        productosFiltrados.sort((a, b) => b.precio - a.precio);
      } else if (filtros.orden === "nombre-asc") {
        productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
      } else if (filtros.orden === "nombre-desc") {
        productosFiltrados.sort((a, b) => b.nombre.localeCompare(a.nombre));
      }

      return productosFiltrados;
    } catch (error) {
      console.error("❌ Error al cargar productos:", error);
      return [];
    }
  }

  async function loadPage(pageNumber, replace = false) {
    setLoading(true);
    const nuevos = await fetchProductsFromApi(pageNumber);

    if (!nuevos || nuevos.length === 0) {
      setHasMore(false);
      setLoading(false);
      return;
    }

    setProductos((prev) => (replace ? nuevos : [...prev, ...nuevos]));
    setPage(pageNumber);
    if (nuevos.length < PAGE_SIZE) setHasMore(false);
    setLoading(false);
  }

  function handleMostrarMas() {
    if (loading || !hasMore) return;
    loadPage(page + 1);
  }

  return (
    <div className={styles.catalogWrapper}>
      <div className={styles.headerActions}>
        <h2>Catálogo</h2>
        <div style={{ display: "flex", gap: "1rem" }}>
          <FiltroDisponibilidad />
          <FiltroCategoria />
          <FiltroOrden />
        </div>
      </div>

      <ProductsGrid products={productos} />

      <div className={styles.loadMoreWrapper}>
        {hasMore ? (
          <button
            className={styles.loadMoreBtn}
            onClick={handleMostrarMas}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Mostrar más"}
          </button>
        ) : (
          <div className={styles.noMore}>No hay más productos</div>
        )}
      </div>
    </div>
  );
}

export default Catalog;