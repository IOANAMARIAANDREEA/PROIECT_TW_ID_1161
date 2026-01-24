import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api.js";

export default function DocumentDetail() {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [categories, setCategories] = useState([]);
  const [documentTypes, setDocumentTypes] = useState([]);
  const [docForm, setDocForm] = useState({ title: "", categoryId: "", description: "", registrationNumber: "", documentTypeId: "" });
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [uploadStatus, setUploadStatus] = useState({ state: "idle", message: "" });
  const [message, setMessage] = useState(null);

  const loadDocument = async () => {
    const response = await api.get(`/api/documents/${id}`);
    setDocument(response.data);
    setDocForm({
      title: response.data.title,
      categoryId: response.data.categoryId || "",
      description: response.data.description || "",
      registrationNumber: response.data.registrationNumber || "",
      documentTypeId: response.data.DocumentType?.id || response.data.documentTypeId || ""
    });
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
    loadDocument();
    loadCategories();
    loadDocumentTypes();
  }, [id]);

  const handleDocChange = (event) => {
    setDocForm({ ...docForm, [event.target.name]: event.target.value });
  };

  const handleDocSave = async (event) => {
    event.preventDefault();
    setMessage(null);
    if (!docForm.title.trim()) {
      setMessage({ type: "error", text: "Titlul este obligatoriu." });
      return;
    }
    if (!docForm.categoryId) {
      setMessage({ type: "error", text: "Categoria este obligatorie." });
      return;
    }
    if (!docForm.documentTypeId) {
      setMessage({ type: "error", text: "Tipul documentului este obligatoriu." });
      return;
    }
    try {
      await api.put(`/api/documents/${id}`, { ...docForm, title: docForm.title.trim() });
      setMessage({ type: "success", text: "Document actualizat." });
      loadDocument();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Nu pot actualiza documentul." });
    }
  };

  const handleFileUpload = async (event) => {
    event.preventDefault();
    if (!file) {
      setUploadStatus({ state: "error", message: "Selecteaza un fisier inainte de upload." });
      return;
    }
    try {
      setUploadStatus({ state: "uploading", message: "Se incarca fisierul..." });
      const formData = new FormData();
      formData.append("file", file);
      await api.post(`/api/documents/${id}/upload`, formData);
      setFile(null);
      setUploadStatus({ state: "success", message: "Fisier trimis cu succes." });
      loadDocument();
    } catch (err) {
      setUploadStatus({ state: "error", message: "Nu s-a putut incarca fisierul." });
    }
  };

  const handleDownload = async () => {
    const response = await api.get(`/api/documents/${id}/download`);
    setDownloadLink(response.data.link);
  };

  const handleDownloadVersion = async (fileId) => {
    const response = await api.get(`/api/documents/${id}/files/${fileId}/download`);
    if (response.data?.link) {
      window.open(response.data.link, "_blank", "noreferrer");
    }
  };

  if (!document) {
    return <p>Loading...</p>;
  }

  return (
    <section className="grid">
      <div className="card">
        <h2>Edit document</h2>
        <p>Numar inregistrare: {document.registrationNumber}</p>
        <form onSubmit={handleDocSave} className="form">
          <label>
            Titlu
            <input name="title" value={docForm.title} onChange={handleDocChange} required />
          </label>
          <label>
            Numar inregistrare
            <input
              name="registrationNumber"
              value={docForm.registrationNumber}
              onChange={handleDocChange}
            />
          </label>
          <label>
            Categoria
            <select name="categoryId" value={docForm.categoryId} onChange={handleDocChange} required>
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
            <select name="documentTypeId" value={docForm.documentTypeId} onChange={handleDocChange} required>
              <option value="">Alege tip</option>
              {documentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            Descriere
            <textarea name="description" value={docForm.description} onChange={handleDocChange} />
          </label>
          {message && <p className={`alert ${message.type}`}>{message.text}</p>}
          <button type="submit">Actualizeaza</button>
        </form>
        <div className="divider" />
        <h3>Fisier Dropbox</h3>
        {document.dropboxPath ? (
          <>
            <p>Fisier incarcat: {document.dropboxFileName || "-"}</p>
            <div className="dropbox-actions">
              <button type="button" onClick={handleDownload}>
                Descarca fisier
              </button>
            </div>
            {downloadLink && (
              <div className="dropbox-link">
                <a href={downloadLink} target="_blank" rel="noreferrer">
                  Descarca fisier
                </a>
              </div>
            )}
            <form onSubmit={handleFileUpload} className="form">
              <label>
                Inlocuieste fisier
                <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </label>
              <button type="submit" disabled={uploadStatus.state === "uploading"}>
                {uploadStatus.state === "uploading" ? "Se incarca..." : "Incarca versiune noua"}
              </button>
              {uploadStatus.message && (
                <p className={`alert ${uploadStatus.state === "error" ? "error" : "success"}`}>
                  {uploadStatus.message}
                </p>
              )}
            </form>
            {document.DocumentFiles?.length > 0 && (
              <div className="file-history">
                <h4>Istoric versiuni</h4>
                <ul className="list">
                  {document.DocumentFiles.map((fileItem) => (
                    <li key={fileItem.id} className="list-item">
                      <div>
                        <strong>v{fileItem.version}</strong>
                        <p>{fileItem.fileName}</p>
                        <p>{new Date(fileItem.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="actions">
                        <button type="button" onClick={() => handleDownloadVersion(fileItem.id)}>
                          Descarca
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <form onSubmit={handleFileUpload} className="form">
            <label>
              Incarca fisier
              <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
            <button type="submit" disabled={uploadStatus.state === "uploading"}>
              {uploadStatus.state === "uploading" ? "Se incarca..." : "Upload"}
            </button>
            {uploadStatus.message && (
              <p className={`alert ${uploadStatus.state === "error" ? "error" : "success"}`}>
                {uploadStatus.message}
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
