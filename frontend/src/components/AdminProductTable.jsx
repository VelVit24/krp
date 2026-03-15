import React from "react";
function AdminProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="card admin-table-wrap">
      <div className="section-heading">
        <div>
          <h2>Товары</h2>
        </div>
      </div>

      <div className="table-scroll">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Категория</th>
              <th>Цена</th>
              <th>Остаток</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>{product.category?.name || product.category_id}</td>
                <td>{product.price.toFixed(0)} р</td>
                <td>{product.stock}</td>
                <td className="admin-actions-cell">
                  <button onClick={() => onEdit(product)} type="button">
                    Изменить
                  </button>
                  <button
                    className="danger"
                    onClick={() => onDelete(product.id)}
                    type="button"
                  >
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 ? (
              <tr>
                <td colSpan="6">Товары не найдены.</td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminProductTable;
