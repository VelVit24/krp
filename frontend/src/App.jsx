import React from "react";
import { Link, Route, Routes } from "react-router-dom";
import Catalog from "./pages/Catalog";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Admin from "./pages/Admin";

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <Link className="brand" to="/">
            Магазин инструментов
          </Link>
        </div>
        <nav className="nav">
          <Link to="/">Каталог</Link>
          <Link to="/cart">Корзина</Link>
          <Link to="/checkout">Оформление</Link>
          <Link to="/admin">Админ-панель</Link>
        </nav>
      </header>

      <main className="page-wrap">
        <Routes>
          <Route path="/" element={<Catalog />} />
          <Route path="/products/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
