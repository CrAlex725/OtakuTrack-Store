import React from "react";
import CategoryForm from "./components/CategoryForm";

export default function App() {
  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>OtakuTrack - Panel Administrativo</h1>
      <p>
        Este panel se conecta al backend en{" "}
        <code>VITE_API_URL/api/categories</code>
      </p>
      <CategoryForm />
    </div>
  );
}
