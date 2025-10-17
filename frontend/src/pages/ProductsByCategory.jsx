import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductsByCategory } from "../services/api";

const ProductsByCategory = () => {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProductsByCategory(id);
        setProducts(data);
        if (data.length === 0) setError("No hay productos en esta categoría.");
      } catch (err) {
        console.error("Error al obtener productos por categoría:", err);
        setError("Error al cargar productos.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Cargando productos...</p>;
  if (error) return <p className="text-center text-red-600 mt-10">{error}</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Productos de la categoría seleccionada
      </h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">
          No hay productos disponibles en esta categoría.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <div
              key={prod._id}
              className="border p-4 rounded-lg shadow hover:shadow-lg transition"
            >
              <img
                src={prod.imagen || "https://via.placeholder.com/150"}
                alt={prod.nombre}
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold">{prod.nombre}</h3>
              <p className="text-gray-600">${prod.precio?.toFixed(2) ?? "—"}</p>
              <button
                onClick={() =>
                  alert(`Has comprado ${prod.nombre} por $${prod.precio}`)
                }
                className="mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Comprar 🛒
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsByCategory;
