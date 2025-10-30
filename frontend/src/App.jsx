import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import Catalog from "./pages/Catalog.jsx";
import Home from "./pages/Home.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import DescubreMas from "./pages/DescubreMas.jsx";

function App() {
  const [categoriasPadre, setCategoriasPadre] = useState([]);

useEffect(() => {
  fetch("http://localhost:3001/api/categories/padre")
    .then((res) => {
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      return res.json();
    })
    .then((data) => {
      console.log("📦 Categorías padre recibidas:", data);
      setCategoriasPadre(data);
    })
    .catch((err) => {
      console.error("❌ Error completo:", err);
      console.log("⚠️ Verifica que el servidor en puerto 3001 esté corriendo");
    });
}, []);

  return (
    <Router>
      {/* ✅ Pasamos las categorías al Header como prop */}
      <Header categoriasPadre={categoriasPadre} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/descubre-mas" element={<DescubreMas />} />
      </Routes>
    </Router>
  );
}

export default App;
