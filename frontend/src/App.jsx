import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductsByCategory from "./pages/ProductsByCategory";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/categoria/:id" element={<ProductsByCategory />} />
      </Routes>
    </Router>
  );
}

export default App;
