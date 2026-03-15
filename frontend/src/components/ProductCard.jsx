import React from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:8000";

function ProductCard({ product, onAdded }) {
  const handleAddToCart = async () => {
    const response = await fetch(`${API_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: product.id,
        quantity: 1,
      }),
    });

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      window.alert(data?.detail || "Не удалось добавить товар в корзину.");
      return;
    }

    onAdded?.(product.name);
  };

  return (
    <article className="card product-card">
      <div className="pill">{product.category?.name || "Инструменты"}</div>
      <h2>{product.name}</h2>
      <p className="muted">{product.description}</p>
      <div className="product-meta">
        <span>{product.price.toFixed(0)} р</span>
        <span>В наличии: {product.stock}</span>
      </div>
      <div className="card-actions">
        <Link className="link-button" to={`/products/${product.id}`}>
          Подробнее
        </Link>
        <button onClick={handleAddToCart}>В корзину</button>
      </div>
    </article>
  );
}

export default ProductCard;
