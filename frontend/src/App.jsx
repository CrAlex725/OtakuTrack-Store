// src/App.jsx
import Header from "./components/Header";

function App() {
  const mostrarHeader = true;

  return (
    <>
    {mostrarHeader && <Header />}
    </>
  );
}

export default App;
