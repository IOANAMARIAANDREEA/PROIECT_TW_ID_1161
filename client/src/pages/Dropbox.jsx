import React, { useEffect, useState } from "react";
import api from "../services/api.js";

export default function Dropbox() {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState("");
  const [loadingIds, setLoadingIds] = useState({});
  const [status, setStatus] = useState({ connected: false, email: null });
  const [authUrl, setAuthUrl] = useState("");
  const [token, setToken] = useState("");
  const [showConnect, setShowConnect] = useState(false);
  const [message, setMessage] = useState(null);

  const loadDocuments = async () => {
    try {
      const response = await api.get("/api/documents");
      setDocuments(response.data.filter((doc) => doc.dropboxPath));
    } catch (err) {
      setError(err.response?.data?.message || "Nu pot incarca documentele.");
    }
  };

  const loadStatus = async () => {
    try {
      const response = await api.get("/api/dropbox/status");
      setStatus(response.data);
    } catch (err) {
      setStatus({ connected: false, email: null });
    }
  };

  const loadAuthUrl = async () => {
    try {
      const response = await api.get("/api/dropbox/auth-url");
      setAuthUrl(response.data.authUrl);
    } catch (err) {
      setError(err.response?.data?.message || "Nu pot obtine linkul Dropbox.");
    }
  };

  useEffect(() => {
    loadDocuments();
    loadStatus();
  }, []);

  const handleDownloadFile = async (docId) => {
    try {
      setError("");
      setLoadingIds((prev) => ({ ...prev, [docId]: true }));
      const response = await api.get(`/api/documents/${docId}/download`);
      if (response.data?.link) {
        window.open(response.data.link, "_blank", "noreferrer");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Nu pot genera linkul de descarcare.");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [docId]: false }));
    }
  };

  const handleConnect = async (event) => {
    event.preventDefault();
    setMessage(null);
    try {
      await api.post("/api/dropbox/connect", { accessToken: token });
      setToken("");
      setShowConnect(false);
      setMessage({ type: "success", text: "Dropbox conectat." });
      loadStatus();
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Nu pot conecta Dropbox." });
    }
  };

  return (
    <section className="grid">
      <div className="card">
        <h2>Documente incarcate in Dropbox</h2>
        <p>Fisierele mele din Dropbox</p>
        <div className="dropbox-status">
          {status.connected ? (
            <p>Dropbox connected ✅ {status.email ? `(${status.email})` : ""}</p>
          ) : (
            <p>Dropbox neconectat.</p>
          )}
          {!status.connected && (
            <button
              type="button"
              onClick={() => {
                setShowConnect((prev) => !prev);
                if (!authUrl) {
                  loadAuthUrl();
                }
              }}
            >
              Reconnect
            </button>
          )}
        </div>
        {showConnect && (
          <form onSubmit={handleConnect} className="form">
            <p>
              1. Deschide linkul si autorizeaza aplicatia.
              {authUrl && (
                <a href={authUrl} target="_blank" rel="noreferrer">
                  Autorizeaza Dropbox
                </a>
              )}
            </p>
            <label>
              Access Token
              <input value={token} onChange={(e) => setToken(e.target.value)} />
            </label>
            {message && <p className={`alert ${message.type}`}>{message.text}</p>}
            <button type="submit">Salveaza token</button>
          </form>
        )}
        {error && <p className="alert error">{error}</p>}
        <ul className="list">
          {documents.map((doc) => (
            <li key={doc.id} className="list-item">
              <div>
                <strong>{doc.title}</strong>
                <p>Nr. inregistrare: {doc.registrationNumber || "-"}</p>
                {doc.dropboxFileName ? (
                  <p>Fisier: {doc.dropboxFileName}</p>
                ) : (
                  <p>Fara fisier incarcat</p>
                )}
              </div>
              <div className="actions">
                <button
                  type="button"
                  onClick={() => handleDownloadFile(doc.id)}
                  disabled={!doc.dropboxPath || loadingIds[doc.id]}
                >
                  {loadingIds[doc.id] ? "Se genereaza..." : "Descarca fisier"}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
