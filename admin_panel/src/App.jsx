// admin_panel/src/App.jsx
import React, { useState } from "react";
import CategoryManager from "./pages/CategoryManager";
import ProductsManager from "./pages/ProductsManager";

export default function App() {
  const [activePanel, setActivePanel] = useState("categorias"); // 'categorias' or 'productos'

  return (
    <div style={{ display: 'flex', height: '100vh', padding: 16, boxSizing: 'border-box', fontFamily: 'sans-serif' }}>
      {/* CONTENIDO PRINCIPAL (ocupa todo el ancho disponible excepto la barra derecha) */}
      <div style={{ flex: 1, overflow: 'auto', paddingRight: 12 }}>
        <header style={{ marginBottom: 12 }}>
          <h1 style={{ margin: 0 }}>Panel de Administración</h1>
        </header>

        {/* Aquí se renderiza el panel activo dentro de la misma pantalla */}
        <div style={{ background: '#fff', padding: 12, borderRadius: 6, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
          {activePanel === 'categorias' && (
            <>
              <h2 style={{ marginTop: 0 }}>Gestión de Categorías</h2>
              <CategoryManager />
            </>
          )}

          {activePanel === 'productos' && (
            <>
              <h2 style={{ marginTop: 0 }}>Gestión de Productos</h2>
              <ProductsManager />
            </>
          )}
        </div>
      </div>

      {/* BARRA DERECHA: botones tipo pestaña */}
      <aside style={{ width: 360, borderLeft: '1px solid #eee', paddingLeft: 12, boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <button
            onClick={() => setActivePanel('categorias')}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: activePanel === 'categorias' ? '#2b6cb0' : '#e2e8f0',
              color: activePanel === 'categorias' ? '#fff' : '#000'
            }}
          >
            Categorías
          </button>

          <button
            onClick={() => setActivePanel('productos')}
            style={{
              flex: 1,
              padding: 10,
              borderRadius: 6,
              border: 'none',
              cursor: 'pointer',
              background: activePanel === 'productos' ? '#2b6cb0' : '#e2e8f0',
              color: activePanel === 'productos' ? '#fff' : '#000'
            }}
          >
            Productos
          </button>
        </div>

        {/* Espacio donde puedes añadir controles extras (filtros, búsqueda, etc.) */}
        <div style={{ marginTop: 8 }}>
          <p style={{ margin: '8px 0', color: '#666' }}>Acciones rápidas</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', background: '#fff' }} onClick={() => window.location.reload()}>
              🔄 Recargar datos
            </button>
            <button style={{ padding: 8, borderRadius: 6, border: '1px solid #ddd', background: '#fff' }} onClick={() => alert('Función pendiente')}>
              ⚙️ Ajustes (pendiente)
            </button>
          </div>
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 12, borderTop: '1px solid #f0f0f0', color: '#999', fontSize: 12 }}>
          OtakuTrack Admin — {new Date().getFullYear()}
        </div>
      </aside>
    </div>
  );
}
