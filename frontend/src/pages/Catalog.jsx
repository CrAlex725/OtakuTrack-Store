// frontend/src/pages/Catalog.jsx
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./Catalog.module.css";
import ProductsGrid from "../components/ProductsGrid.jsx";
import { getProducts } from "../services/api.js";

const PAGE_SIZE = 30;

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1', 10));
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const readParams = () => {
    return {
      categoria: searchParams.get("categoria") || undefined,
      subcategoria: searchParams.get("subcategoria") || undefined,
      disponible: searchParams.get("disponible") || undefined,
      minStock: searchParams.get("minStock") || undefined,
      sort: searchParams.get("sort") || undefined,
      page: page,
      pageSize: PAGE_SIZE,
      q: searchParams.get("q") || undefined
    };
  };

  const fetchProducts = useCallback(async (reset = false) => {
    setLoading(true);
    const params = readParams();
    try {
      const data = await getProducts(params);
      // Suponemos que la API devuelve { items: [], total: n } o un array directamente
      const items = Array.isArray(data) ? data : (data.items || []);
      if (reset) setProductos(items);
      else setProductos(prev => [...prev, ...items]);
      setHasMore(items.length === PAGE_SIZE); // simple heuristic
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false);
    }
  }, [searchParams, page]);

  // cuando cambian filtros en URL, recargar desde página 1
  useEffect(() => {
    setPage(1);
    fetchProducts(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.toString()]);

  // cuando cambia la página (mostrar más)
  useEffect(() => {
    if (page === 1) return;
    fetchProducts(false);
  }, [page, fetchProducts]);

  const handleMostrarMas = () => setPage(p => p + 1);

  // helpers para que los filtros modifiquen la searchParams
  const updateFilter = (key, value) => {
    const sp = new URLSearchParams(searchParams);
    if (value === null || value === undefined || value === "") {
      sp.delete(key);
    } else {
      sp.set(key, value);
    }
    // push new params to history (so back/forward works)
    setSearchParams(sp);
    // navigate(`?${sp.toString()}`, { replace: false }); // alternativa si quieres navigate
  };

  return (
    <div className={styles.catalog}>
      <h1>Catálogo</h1>

      {/* Aquí van tus FiltroCategoria, FiltroDisponibilidad, FiltroOrden */}
      {/* Los Filtro* deberían llamar updateFilter('categoria', 'figuras') etc. */}
      <div className={styles.filters}>
        {/* ejemplo básico: */}
        <label>
          Buscar:
          <input
            type="text"
            value={searchParams.get('q') || ''}
            onChange={(e)=> updateFilter('q', e.target.value)}
          />
        </label>
      </div>

      <ProductsGrid products={productos} />

      <div className={styles.actions}>
        {hasMore ? (
          <button className={styles.loadMoreBtn} onClick={handleMostrarMas} disabled={loading}>
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
