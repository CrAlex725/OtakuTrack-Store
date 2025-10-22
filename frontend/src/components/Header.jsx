//frontend/src/components/Header.jsx
import React from "react";
import styles from "./Header.module.css";
import logo from "../assets/logo.svg";
import { FaSearch, FaHeart, FaShoppingCart, FaInstagram, FaGithub} from "react-icons/fa";
import { Link } from "react-router-dom";

function Header({ categoriasPadre = [] }) {
  return (
    <header className={styles.header}>
      {/* Secciones principales */}
      
      <div className={styles.logo}>
        <img src= {logo} alt="OtakuTrack Logo" className={styles.logoImg} />
      </div>

      <div className={styles.link}>
        <Link to="/catalogo" className={styles.catalogLink}>
        Catálogo
        </Link>
      </div>


      <div className={styles.link}>En Stock</div>

      {/* Categorías padre (dinámicas) */}
      <div className={styles.categorias}>
        {categoriasPadre.length > 0 ? (
          categoriasPadre.map((cat, index) => (
            <span key={index} className={styles.categoriaItem}>
              {cat}
            </span>
          ))
        ) : (
          <span className={styles.sinCategorias}>Sin categorías</span>
        )}
      </div>

      {/* Secciones adicionales */}
      <div className={styles.link}>Testimonios</div>
      <div className={styles.link}>Ayuda</div>
      <div className={styles.link}>Cuenta</div>

      {/* Íconos funcionales */}
      <div className={styles.iconos}>
        <FaSearch title="Buscar" />
        <FaHeart title="Favoritos" />
        <FaShoppingCart title="Carrito" />
      </div>

      {/* Redes sociales */}
      <div className={styles.redes}>
        <FaGithub />
        <FaInstagram />
      </div>
    </header>
  );
}

export default Header;
