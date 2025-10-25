// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductsCRUD from "./pages/ProductsCRUD";
import CategoriesCRUD from "./pages/CategoriesCRUD";

function App() {
  return (
    <Router>
      <nav
        style={{
          backgroundColor: "#1f3b4d",
          padding: "0.8rem 1rem",
          display: "flex",
          gap: "1rem",
          alignItems: "center",
        }}
      >
        <div style={{ color: "white", fontWeight: "700" }}>OtakuTrack - Admin</div>
        <Link to="/productos" style={{ color: "white", textDecoration: "none" }}>
          Productos
        </Link>
        <Link to="/categorias" style={{ color: "white", textDecoration: "none" }}>
          Categorías
        </Link>
      </nav>

      <main>
        <Routes>
          <Route path="/" element={<h2 style={{ padding: "1rem" }}>Panel de Administración</h2>} />
          <Route path="/productos" element={<ProductsCRUD />} />
          <Route path="/categorias" element={<CategoriesCRUD />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
