import React, { useEffect, useState } from "react";
import AdminOrders from "../components/AdminOrders";
import AdminProductForm from "../components/AdminProductForm";
import AdminProductTable from "../components/AdminProductTable";

const API_URL = "http://localhost:8000";

function Admin() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const categories = products.reduce((result, product) => {
    const alreadyAdded = result.some((category) => category.id === product.category?.id);
    if (product.category?.id && !alreadyAdded) {
      result.push(product.category);
    }
    return result;
  }, []).sort((a, b) => a.id - b.id);

  const loadProducts = async () => {
    const response = await fetch(`${API_URL}/admin/products`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Не удалось загрузить товары.");
    }
    setProducts(data);
  };

  const loadOrders = async () => {
    const response = await fetch(`${API_URL}/admin/orders`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Не удалось загрузить заказы.");
    }
    setOrders(data);
  };

  const loadOrderDetails = async (orderId) => {
    const response = await fetch(`${API_URL}/admin/orders/${orderId}`);
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.detail || "Не удалось загрузить детали заказа.");
    }
    setSelectedOrder(data);
  };

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        await Promise.all([loadProducts(), loadOrders()]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadAdminData();
  }, []);

  const handleProductSubmit = async (productData) => {
    setError("");
    setMessage("");

    const endpoint = editingProduct
      ? `${API_URL}/admin/products/${editingProduct.id}`
      : `${API_URL}/admin/products`;
    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    const data = await response.json().catch(() => null);

    if (!response.ok) {
      setError(data?.detail || "Не удалось сохранить товар.");
      return;
    }

    await loadProducts();
    setEditingProduct(null);
    setMessage(editingProduct ? "Товар обновлен." : "Товар создан.");
  };

  const handleDeleteProduct = async (productId) => {
    setError("");
    setMessage("");

    const response = await fetch(`${API_URL}/admin/products/${productId}`, {
      method: "DELETE",
    });

    if (response.status === 204) {
      await loadProducts();
      setMessage("Товар удален.");
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
      }
      return;
    }

    const data = await response.json().catch(() => null);
    setError(data?.detail || "Не удалось удалить товар.");
  };

  const handleSelectOrder = async (orderId) => {
    setError("");
    try {
      await loadOrderDetails(orderId);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <section className="stack">
      <div className="hero admin-hero">
        <div>
          <h1>Управление товарами и просмотр заказов</h1>
        </div>
      </div>

      {message ? <p className="notice success">{message}</p> : null}
      {error ? <p className="notice error">{error}</p> : null}
      {loading ? <p>Загрузка панели администратора...</p> : null}

      {!loading ? (
        <>
          <div className="admin-layout">
            <AdminProductForm
              categories={categories}
              editingProduct={editingProduct}
              onCancel={() => setEditingProduct(null)}
              onSubmit={handleProductSubmit}
            />
            <AdminProductTable
              products={products}
              onDelete={handleDeleteProduct}
              onEdit={setEditingProduct}
            />
          </div>

          <AdminOrders
            orders={orders}
            selectedOrder={selectedOrder}
            onSelectOrder={handleSelectOrder}
          />
        </>
      ) : null}
    </section>
  );
}

export default Admin;
