// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Catalog from "./pages/Catalog";
import Home from "./pages/Home";
import ProductDetail from "./components/ProductDetail"; // ✅ Corregido
import DescubreMas from "./pages/DescubreMas";

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/:id" element={<ProductDetail />} />
        <Route path="/Descubre-mas" element={<DescubreMas/>}/>
      </Routes>
    </Router>
  );
}

export default App;
