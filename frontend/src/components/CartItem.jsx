import React from "react";
function CartItem({ item, onRemove }) {
  const lineTotal = item.quantity * item.product.price;

  return (
    <article className="card cart-item">
      <div>
        <p className="pill">{item.product.category?.name || "Инструменты"}</p>
        <h3>{item.product.name}</h3>
        <p className="muted">{item.product.description}</p>
      </div>
      <div className="cart-item-side">
        <p>Количество: {item.quantity}</p>
        <p>{lineTotal.toFixed(0)} р</p>
        <button className="danger" onClick={() => onRemove(item.id)}>
          Удалить
        </button>
      </div>
    </article>
  );
}

export default CartItem;
