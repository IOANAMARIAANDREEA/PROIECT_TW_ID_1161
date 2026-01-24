import React, { useEffect, useState } from "react";
import api from "../services/api.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function DocumentTypes() {
  const [types, setTypes] = useState([]);
  const [form, setForm] = useState({ id: null, name: "" });
  const [message, setMessage] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const loadTypes = async () => {
    const response = await api.get("/api/document-types");
    setTypes(response.data);
  };

  useEffect(() => {
    loadTypes();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const resetForm = () => {
    setForm({ id: null, name: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Numele tipului este obligatoriu." });
      return;
    }
    try {
      if (form.id) {
        await api.put(`/api/document-types/${form.id}`, { name: form.name.trim() });
        setMessage({ type: "success", text: "Tip actualizat cu succes." });
      } else {
        await api.post("/api/document-types", { name: form.name.trim() });
        setMessage({ type: "success", text: "Tip adaugat cu succes." });
      }
      resetForm();
      loadTypes();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Operatiunea a esuat." });
    }
  };

  const handleEdit = (type) => {
    setForm({ id: type.id, name: type.name });
  };

  const requestDelete = (id) => {
    setConfirm({ open: true, id });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/document-types/${confirm.id}`);
      setMessage({ type: "success", text: "Tip sters." });
      setConfirm({ open: false, id: null });
      loadTypes();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Nu pot sterge tipul." });
      setConfirm({ open: false, id: null });
    }
  };

  return (
    <section className="grid">
      <div className="card">
        <h2>Tipuri document</h2>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Nume tip
            <input name="name" value={form.name} onChange={handleChange} required />
          </label>
          {message && <p className={`alert ${message.type}`}>{message.text}</p>}
          <button type="submit">{form.id ? "Actualizeaza" : "Adauga"}</button>
        </form>
      </div>
      <div className="card">
        <h2>Lista tipuri</h2>
        <ul className="list">
          {types.map((type) => (
            <li key={type.id} className="list-item">
              <div>
                <strong>{type.name}</strong>
              </div>
              <div className="actions">
                <button type="button" onClick={() => handleEdit(type)}>
                  Editeaza
                </button>
                <button type="button" onClick={() => requestDelete(type.id)}>
                  Sterge
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ConfirmDialog
        open={confirm.open}
        title="Sterge tip document"
        message="Sigur doresti sa stergi acest tip?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </section>
  );
}
