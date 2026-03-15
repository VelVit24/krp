import React, { useEffect, useState } from "react";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category_id: "",
};

function AdminProductForm({ categories, editingProduct, onSubmit, onCancel }) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingProduct) {
      setForm({
        name: editingProduct.name,
        description: editingProduct.description || "",
        price: String(editingProduct.price),
        stock: String(editingProduct.stock),
        category_id: String(editingProduct.category_id),
      });
      return;
    }

    setForm((current) => ({
      ...emptyForm,
      category_id: categories[0] ? String(categories[0].id) : "",
    }));
  }, [categories, editingProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
      category_id: Number(form.category_id),
    });
  };

  return (
    <form className="card admin-form" onSubmit={handleSubmit}>
      <div className="section-heading">
        <div>
          <h2>{editingProduct ? "Редактировать товар" : "Добавить товар"}</h2>
        </div>
      </div>

      <label>
        Название
        <input name="name" value={form.name} onChange={handleChange} required />
      </label>
      <label>
        Описание
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
        />
      </label>
      <div className="admin-form-grid">
        <label>
          Цена
          <input
            min="0"
            name="price"
            step="0.01"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Остаток
          <input
            min="0"
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <label>
        Категория
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="" disabled>
            Выберите категорию
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <div className="card-actions">
        <button type="submit">
          {editingProduct ? "Сохранить" : "Создать"}
        </button>
        {editingProduct ? (
          <button className="secondary-button" onClick={onCancel} type="button">
            Отмена
          </button>
        ) : null}
      </div>
    </form>
  );
}

export default AdminProductForm;
