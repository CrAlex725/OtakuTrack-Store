export async function getProducts() {
  const res = await fetch("/api/products");
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
}
