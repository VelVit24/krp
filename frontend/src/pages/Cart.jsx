import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CartItem from "../components/CartItem";

const API_URL = "http://localhost:8000";

function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCart = async () => {
    try {
      const response = await fetch(`${API_URL}/cart`);
      if (!response.ok) {
        throw new Error("Не удалось загрузить корзину.");
      }
      const data = await response.json();
      setItems(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const handleRemove = async (id) => {
    const response = await fetch(`${API_URL}/cart/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      window.alert("Не удалось удалить товар из корзины.");
      return;
    }

    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  };

  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  return (
    <section>
      <div className="section-heading">
        <div>
          <h1>Корзина</h1>
        </div>
        {items.length > 0 ? (
          <Link className="link-button" to="/checkout">
            Оформить заказ
          </Link>
        ) : null}
      </div>

      {loading ? <p>Загрузка корзины...</p> : null}
      {error ? <p className="notice error">{error}</p> : null}

      {items.length === 0 && !loading ? (
        <div className="card empty-state">
          <p>Корзина пуста.</p>
          <Link className="link-button" to="/">
            Перейти в каталог
          </Link>
        </div>
      ) : null}

      <div className="stack">
        {items.map((item) => (
          <CartItem key={item.id} item={item} onRemove={handleRemove} />
        ))}
      </div>

      {items.length > 0 ? (
        <div className="summary-bar">
          <span>Сумма заказа</span>
          <strong>{total.toFixed(0)} р</strong>
        </div>
      ) : null}
    </section>
  );
}

export default Cart;
