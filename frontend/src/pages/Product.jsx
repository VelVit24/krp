import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_URL = "http://localhost:8000";

function Product() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProduct = async () => {
      try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) {
          throw new Error("Товар не найден.");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

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
    window.alert(`Товар "${product.name}" добавлен в корзину.`);
  };

  if (loading) {
    return <p>Загрузка товара...</p>;
  }

  if (error) {
    return <p className="notice error">{error}</p>;
  }

  return (
    <section className="product-layout">
      <div className="card product-detail">
        <p className="pill">{product.category?.name || "Инструменты"}</p>
        <h1>{product.name}</h1>
        <p className="muted lead">{product.description}</p>
        <div className="detail-grid">
          <div>
            <span className="label">Цена</span>
            <strong>{product.price.toFixed(0)} р</strong>
          </div>
          <div>
            <span className="label">Остаток</span>
            <strong>{product.stock} шт.</strong>
          </div>
        </div>
        <div className="card-actions">
          <button onClick={handleAddToCart}>В корзину</button>
          <Link className="link-button" to="/cart">
            Перейти в корзину
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Product;
