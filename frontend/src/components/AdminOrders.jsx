import React from "react";
function AdminOrders({ orders, selectedOrder, onSelectOrder }) {
  return (
    <div className="admin-orders-layout">
      <div className="card admin-orders-list">
        <div className="section-heading">
          <div>
            <h2>Заказы</h2>
          </div>
        </div>

        <div className="stack compact">
          {orders.map((order) => (
            <button
              key={order.id}
              className={`order-list-item${selectedOrder?.id === order.id ? " active" : ""}`}
              onClick={() => onSelectOrder(order.id)}
              type="button"
            >
              <span>Заказ #{order.id}</span>
              <strong>{order.total_price.toFixed(0)} р</strong>
            </button>
          ))}
          {orders.length === 0 ? <p>Заказов пока нет.</p> : null}
        </div>
      </div>

      <div className="card admin-order-detail">
        <div className="section-heading">
          <div>
            <h2>{selectedOrder ? `Заказ #${selectedOrder.id}` : "Выберите заказ"}</h2>
          </div>
        </div>

        {selectedOrder ? (
          <div className="stack compact">
            <p>
              <strong>Покупатель:</strong> {selectedOrder.customer_name}
            </p>
            <p>
              <strong>Телефон:</strong> {selectedOrder.customer_phone}
            </p>
            <p>
              <strong>Адрес:</strong> {selectedOrder.customer_address}
            </p>
            <div className="stack compact">
              {selectedOrder.items.map((item) => (
                <div className="summary-row" key={item.id}>
                  <span>
                    {item.product?.name || `Товар #${item.product_id}`} x {item.quantity}
                  </span>
                  <strong>{(item.price * item.quantity).toFixed(0)} р</strong>
                </div>
              ))}
            </div>
            <div className="summary-bar">
              <span>Итого</span>
              <strong>{selectedOrder.total_price.toFixed(0)} р</strong>
            </div>
          </div>
        ) : (
          <p className="muted">Выберите заказ из списка, чтобы посмотреть детали.</p>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
