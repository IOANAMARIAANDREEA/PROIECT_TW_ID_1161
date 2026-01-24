import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { setAuth } from "../services/auth.js";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Email invalid.");
      return;
    }
    if (form.password.length < 6) {
      setError("Parola trebuie sa aiba minim 6 caractere.");
      return;
    }
    try {
      const response = await api.post("/api/auth/login", form);
      setAuth(response.data.token, response.data.user);
      navigate("/documents");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="card">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />
        </label>
        {error && <p className="alert error">{error}</p>}
        <button type="submit">Login</button>
      </form>
      <p>
        Nu ai cont? <Link to="/register">Creeaza cont</Link>
      </p>
    </section>
  );
}
