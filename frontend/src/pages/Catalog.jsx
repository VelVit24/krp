import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

const API_URL = "http://localhost:8000";

function Catalog() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) {
          throw new Error("Не удалось загрузить товары.");
        }
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const categories = products.reduce((result, product) => {
    const exists = result.some((category) => category.id === product.category?.id);
    if (product.category?.id && !exists) {
      result.push(product.category);
    }
    return result;
  }, []);

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") {
      return true;
    }
    return String(product.category?.id) === selectedCategory;
  });

  return (
    <section>
      <div className="page-header">
        <h2>Каталог</h2>
      </div>

      {notice ? <div className="notice success">{notice}</div> : null}
      {loading ? <p>Загрузка товаров...</p> : null}
      {error ? <p className="notice error">{error}</p> : null}

      <div className="card filter-bar">
        <label>
          Категория
          <select
            value={selectedCategory}
            onChange={(event) => setSelectedCategory(event.target.value)}
          >
            <option value="all">Все категории</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdded={(productName) => setNotice(`Товар "${productName}" добавлен в корзину.`)}
          />
        ))}
      </div>
    </section>
  );
}

export default Catalog;
