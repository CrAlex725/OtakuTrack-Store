import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getSubcategories, getProductsByCategoryAndSubcategories } from '../services/api';

export default function CategoryPage() {
  const { id } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // 1️⃣ Obtener subcategorías
        const subs = await getSubcategories(id);
        setSubcategories(subs);

        // 2️⃣ Obtener productos de categoría y subcategorías
        const prods = await getProductsByCategoryAndSubcategories(id);
        setProducts(prods);
      } catch (error) {
        console.error('Error al cargar datos de categoría:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleSubcategoryClick = (sub) => {
    navigate(`/categoria/${sub._id}`);
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-4">
      {/* Subcategorías */}
      {subcategories.length > 0 && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-3 text-gray-700">Subcategorías</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {subcategories.map((sub) => (
              <button
                key={sub._id}
                onClick={() => handleSubcategoryClick(sub)}
                className="border rounded-lg px-3 py-2 bg-white shadow hover:bg-blue-100 transition"
              >
                {sub.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Productos */}
      <h2 className="text-2xl font-bold mb-3 text-gray-700">Productos</h2>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p._id} className="border rounded-lg p-3 bg-white shadow">
              <h3 className="font-semibold">{p.nombre}</h3>
              {p.precio && <p className="text-gray-600">${p.precio}</p>}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No hay productos en esta categoría.</p>
      )}
    </div>
  );
}
