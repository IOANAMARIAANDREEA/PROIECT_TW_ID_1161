import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ id: null, name: "", parentId: "" });
  const [message, setMessage] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const loadCategories = async () => {
    const response = await api.get("/api/categories");
    setCategories(response.data);
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({ id: null, name: "", parentId: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Numele categoriei este obligatoriu." });
      return;
    }
    try {
      if (form.id) {
        await api.put(`/api/categories/${form.id}`, {
          name: form.name.trim(),
          parentId: form.parentId || null
        });
        setMessage({ type: "success", text: "Categorie actualizata cu succes." });
      } else {
        await api.post("/api/categories", {
          name: form.name.trim(),
          parentId: form.parentId || null
        });
        setMessage({ type: "success", text: "Categorie adaugata cu succes." });
      }
      resetForm();
      loadCategories();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Operatiunea a esuat." });
    }
  };

  const handleEdit = (category) => {
    setForm({ id: category.id, name: category.name, parentId: category.parentId || "" });
  };

  const requestDelete = (id) => {
    setConfirm({ open: true, id });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/categories/${confirm.id}`);
      setMessage({ type: "success", text: "Categorie stearsa." });
      setConfirm({ open: false, id: null });
      loadCategories();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Nu pot sterge categoria." });
      setConfirm({ open: false, id: null });
    }
  };

  return (
    <section className="grid">
      <div className="card">
        <h2>Categorii</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Nume categorie
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          <label>
            Categorie parinte (optional)
            <select name="parentId" value={form.parentId} onChange={handleChange}>
              <option value="">Selecteaza parinte</option>
              {categories
                .filter((cat) => cat.id !== form.id)
                .map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
            </select>
          </label>
          {message && <p className={`alert ${message.type}`}>{message.text}</p>}
          <button type="submit">{form.id ? "Actualizeaza" : "Adauga"}</button>
        </form>
      </div>
      <div className="card">
        <h2>Lista categorii</h2>
        <ul className="list">
          {categories.map((cat) => (
            <li key={cat.id} className="list-item">
              <div>
                <strong>{cat.name}</strong>
              </div>
              <div className="actions">
                <button type="button" onClick={() => handleEdit(cat)}>
                  Editeaza
                </button>
                <button type="button" onClick={() => requestDelete(cat.id)}>
                  Sterge
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ConfirmDialog
        open={confirm.open}
        title="Sterge categorie"
        message="Sigur doresti sa stergi aceasta categorie?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </section>
  );
}
