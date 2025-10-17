//frontend/src/components/CategoryList.jsx
import { useEffect, useState } from 'react';
import { getCategories } from '../services/api';

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div>
      <h2>Categorías</h2>
      <ul>
        {categories.map(cat => (
          <li key={cat._id}>
            {cat.nombre}
            {cat.subcategorias?.length > 0 && (
              <ul>
                {cat.subcategorias.map(sub => (
                  <li key={sub._id}>↳ {sub.nombre}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
