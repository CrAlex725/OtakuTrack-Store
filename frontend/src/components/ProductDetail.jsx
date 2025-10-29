//frontend/src/components/ProductDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetail.module.css";
import { getProductById } from "../services/api.js";

import default1 from "../assets/ImagenPorDefecto1.jpeg";
import default2 from "../assets/ImagenPorDefecto2.jpeg";
import default3 from "../assets/ImagenPorDefecto3.jpeg";
import default4 from "../assets/ImagenPorDefecto4.jpeg";

const defaultImages = [default1, default2, default3, default4];

const ProductDetail = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cantidad, setCantidad] = useState(1);
  const [imagenActual, setImagenActual] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!id) throw new Error("ID inválido o indefinido");
        const data = await getProductById(id);
        const productoData = data?.producto || data || null;
        if (!productoData || Object.keys(productoData).length === 0)
          throw new Error("Producto no encontrado");
        setProducto(productoData);
      } catch (error) {
        console.error("❌ Error al cargar producto:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <p className={styles.loading}>Cargando...</p>;
  if (!producto) return <p className={styles.notFound}>Producto no encontrado.</p>;

  const imagenes = producto.imagenes?.length ? producto.imagenes : defaultImages;
  const selectedImage = imagenes[imagenActual];

  const handleCantidadChange = (e) => {
    const value = Math.min(Math.max(1, e.target.value), producto.stock);
    setCantidad(value);
  };

  const handleAgregarCarrito = () => {
    alert(`Agregado ${cantidad} ${producto.nombre}(s) al carrito 🛒`);
  };

  const handlePrev = () => setImagenActual((p) => (p === 0 ? imagenes.length - 1 : p - 1));
  const handleNext = () => setImagenActual((p) => (p === imagenes.length - 1 ? 0 : p + 1));
  const handleThumbnailClick = (i) => setImagenActual(i);

  return (
    <div className={styles.productDetail}>
      <div className={styles.mainSection}>
        <div className={styles.imageContainer}>
          <div className={styles.mainImageWrapper}>
            <img src={selectedImage} alt={producto.nombre} className={styles.productImage} />
            {imagenes.length > 1 && (
              <>
                <button className={`${styles.navButton} ${styles.prevButton}`} onClick={handlePrev}>
                  ‹
                </button>
                <button className={`${styles.navButton} ${styles.nextButton}`} onClick={handleNext}>
                  ›
                </button>
              </>
            )}
          </div>
          <div className={styles.thumbnailRow}>
            {imagenes.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`Vista ${i + 1}`}
                className={`${styles.thumbnail} ${imagenActual === i ? styles.active : ""}`}
                onClick={() => handleThumbnailClick(i)}
              />
            ))}
          </div>
        </div>

        <div className={styles.infoContainer}>
          <h1 className={styles.nombre}>{producto.nombre}</h1>
          <p className={styles.precio}>💰 ${producto.precio}</p>
          <p><strong>ID del Producto:</strong> {producto._id || producto.id}</p>
          <p><strong>Stock Disponible:</strong> {producto.stock}</p>
          <p>
            <strong>Categoría:</strong>{" "}
            {Array.isArray(producto.categoria)
              ? producto.categoria.map((c) => c.nombre).join(", ")
              : producto.categoria?.nombre || "Sin categoría"}
          </p>

          <div className={styles.cantidadContainer}>
            <label htmlFor="cantidad"><strong>Cantidad:</strong></label>
            <input
              id="cantidad"
              type="number"
              value={cantidad}
              min="1"
              max={producto.stock}
              onChange={handleCantidadChange}
              className={styles.cantidadInput}
            />
          </div>

          <button
            className={styles.addToCartBtn}
            onClick={handleAgregarCarrito}
            disabled={producto.stock === 0}
          >
            {producto.stock === 0 ? "❌ Sin stock" : "🛒 Agregar al carrito"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
