//frontend/src/components/CategoryList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCategories } from '../services/api';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 🟢 Cargar categorías al montar el componente
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
        setError('No se pudieron cargar las categorías.');
      }
    };
    fetchCategories();
  }, []);

  // 🟢 Función recursiva para renderizar jerarquía de categorías
  const renderCategories = (cats) => (
    <ul className="ml-4">
      {cats.map((cat) => (
        <li key={cat._id} className="mb-1">
          <button
            onClick={() => handleCategoryClick(cat)}
            className="text-left w-full px-2 py-1 rounded hover:bg-blue-100"
          >
            {cat.nombre}
          </button>
          {cat.children && cat.children.length > 0 && renderCategories(cat.children)}
        </li>
      ))}
    </ul>
  );

  // 🟢 Al hacer clic en una categoría
  const handleCategoryClick = (category) => {
    if (category.children && category.children.length > 0) {
      setError('Esta categoría tiene subcategorías. Selecciona una categoría final.');
      return;
    }
    navigate(`/categoria/${category._id}`);
  };

  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <h2 className="text-xl font-bold mb-3 text-gray-700">Categorías</h2>
      {error && <p className="text-sm text-red-600 mb-2">{error}</p>}
      {categories.length > 0 ? (
        renderCategories(categories)
      ) : (
        <p className="text-gray-500">Cargando categorías...</p>
      )}
    </div>
  );
};

export default CategoryList;
