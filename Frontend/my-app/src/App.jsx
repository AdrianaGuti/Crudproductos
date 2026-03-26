import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProductDetail from "./pages/ProductDetail";
import ProductList from "./pages/ProductList";
import ProductForm from "./pages/ProductForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductList />} />
        <Route path="/producto/nuevo" element={<ProductForm />} />
        <Route path="/producto/editar/:id" element={<ProductForm />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;