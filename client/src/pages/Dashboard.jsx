import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api.js";
import ConfirmDialog from "../components/ConfirmDialog.jsx";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [form, setForm] = useState({ title: "", categoryId: "", registrationNumber: "", documentTypeId: "" });
  const [filters, setFilters] = useState({ title: "", registrationNumber: "", categoryId: "" });
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ state: "idle", message: "" });
  const [message, setMessage] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const loadDocuments = async () => {
    const params = {};
    if (filters.title) params.title = filters.title;
    if (filters.registrationNumber) params.registrationNumber = filters.registrationNumber;
    if (filters.categoryId) params.categoryId = filters.categoryId;
    const response = await api.get("/api/documents", { params });
    setDocuments(response.data);
  };

  const loadCategories = async () => {
    const response = await api.get("/api/categories");
    setCategories(response.data);
  };

  const loadDocumentTypes = async () => {
    const response = await api.get("/api/document-types");
    setDocumentTypes(response.data);
  };

  useEffect(() => {
    loadDocuments();
    loadCategories();
    loadDocumentTypes();
  }, []);

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleFilterChange = (event) => {
    setFilters({ ...filters, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage(null);
    setUploadStatus({ state: "idle", message: "" });
    if (!form.title.trim()) {
      setError("Titlul este obligatoriu.");
      return;
    }
    if (!form.categoryId) {
      setError("Categoria este obligatorie.");
      return;
    }
    if (!form.documentTypeId) {
      setError("Tipul documentului este obligatoriu.");
      return;
    }
    try {
      const response = await api.post("/api/documents", {
        ...form,
        title: form.title.trim()
      });
      const createdDoc = response.data;
      if (file) {
        try {
          setUploadStatus({ state: "uploading", message: "Se incarca fisierul..." });
          const formData = new FormData();
          formData.append("file", file);
          await api.post(`/api/documents/${createdDoc.id}/upload`, formData);
          setUploadStatus({ state: "success", message: "Fisier incarcat cu succes." });
        } catch (uploadError) {
          setUploadStatus({
            state: "error",
            message:
              uploadError.response?.data?.message || "Document salvat, dar fisierul nu s-a incarcat."
          });
        }
      }
      setForm({ title: "", categoryId: "", registrationNumber: "", documentTypeId: "" });
      setFile(null);
      setMessage({ type: "success", text: "Document salvat cu succes." });
      loadDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create document");
    }
  };

  const handleApplyFilters = async (event) => {
    event.preventDefault();
    loadDocuments();
  };

  const requestDelete = (id) => {
    setConfirm({ open: true, id });
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/api/documents/${confirm.id}`);
      setMessage({ type: "success", text: "Document sters." });
      loadDocuments();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Nu pot sterge documentul." });
    } finally {
      setConfirm({ open: false, id: null });
    }
  };

  return (
    <section className="grid">
      <div className="card">
        <h2>Adauga document</h2>
        <p>Documentele mele</p>
        <form onSubmit={handleSubmit} className="form">
          <label>
            Titlu
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            Numar inregistrare (optional)
            <input name="registrationNumber" value={form.registrationNumber} onChange={handleChange} />
          </label>
          <label>
            Categoria
            <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
              <option value="">Alege categoria</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Tip document
            <select name="documentTypeId" value={form.documentTypeId} onChange={handleChange} required>
              <option value="">Alege tip</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Incarca fisier
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
          {error && <p className="alert error">{error}</p>}
          {message && <p className={`alert ${message.type}`}>{message.text}</p>}
          {uploadStatus.message && (
            <p className={`alert ${uploadStatus.state === "error" ? "error" : "success"}`}>
              {uploadStatus.message}
            </p>
          )}
          <button type="submit">Salveaza</button>
        </form>
      </div>
      <div className="card">
        <h2>Filtre</h2>
        <form onSubmit={handleApplyFilters} className="form">
          <label>
            Titlu
            <input name="title" value={filters.title} onChange={handleFilterChange} />
          </label>
          <label>
            Numar inregistrare
            <input
              name="registrationNumber"
              value={filters.registrationNumber}
              onChange={handleFilterChange}
            />
          </label>
          <label>
            Categoria
            <select name="categoryId" value={filters.categoryId} onChange={handleFilterChange}>
              <option value="">Toate</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <button type="submit">Aplica</button>
        </form>
      </div>
      <div className="card">
        <h2>Documente</h2>
        <ul className="list">
          {documents.map((doc) => (
            <li key={doc.id} className="list-item">
              <div>
                <h3>{doc.title}</h3>
                <p>
                  {doc.Category?.parent
                    ? `${doc.Category.parent.name} / ${doc.Category.name}`
                    : doc.Category?.name || "Fara categorie"}
                </p>
                <p>Nr: {doc.registrationNumber}</p>
                <p>Tip: {doc.DocumentType?.name || doc.documentType || "-"}</p>
              </div>
              <div className="actions">
                <Link to={`/documents/${doc.id}`}>Detalii</Link>
                <button type="button" onClick={() => requestDelete(doc.id)}>
                  Sterge
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <ConfirmDialog
        open={confirm.open}
        title="Sterge document"
        message="Sigur doresti sa stergi acest document?"
        onConfirm={handleDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </section>
  );
}
