import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

const initialForm = {
  customer_name: "",
  customer_phone: "",
  customer_address: "",
};

function Checkout() {
  const [cartItems, setCartItems] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadCart = async () => {
      try {
        const response = await fetch(`${API_URL}/cart`);
        if (!response.ok) {
          throw new Error("Не удалось загрузить корзину.");
        }
        const data = await response.json();
        setCartItems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.quantity * item.product.price,
    0,
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Не удалось оформить заказ.");
      }

      setSuccess(
        `Заказ #${data.id} успешно оформлен на имя ${data.customer_name}.`,
      );
      setCartItems([]);
      setForm(initialForm);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Загрузка оформления...</p>;
  }

  return (
    <section className="checkout-layout">
      <div className="card checkout-summary">
        <h1>Подтверждение заказа</h1>
        <div className="stack compact">
          {cartItems.map((item) => (
            <div className="summary-row" key={item.id}>
              <span>
                {item.product.name} x {item.quantity}
              </span>
              <strong>{(item.quantity * item.product.price).toFixed(0)} р</strong>
            </div>
          ))}
        </div>
        <div className="summary-bar">
          <span>Итого</span>
          <strong>{total.toFixed(0)} р</strong>
        </div>
      </div>

      <form className="card checkout-form" onSubmit={handleSubmit}>
        <label>
          Имя
          <input
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Телефон
          <input
            name="customer_phone"
            value={form.customer_phone}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Адрес доставки
          <textarea
            name="customer_address"
            value={form.customer_address}
            onChange={handleChange}
            rows="4"
            required
          />
        </label>

        {error ? <p className="notice error">{error}</p> : null}
        {success ? <p className="notice success">{success}</p> : null}

        <button disabled={submitting || cartItems.length === 0} type="submit">
          {submitting ? "Отправка..." : "Оформить заказ"}
        </button>
      </form>
    </section>
  );
}

export default Checkout;
