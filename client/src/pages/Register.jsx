import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api.js";
import { setAuth } from "../services/auth.js";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
      const response = await api.post("/api/auth/register", form);
      setAuth(response.data.token, response.data.user);
      navigate("/documents");
    } catch (err) {
      setError(err.response?.data?.message || "Register failed");
    }
  };

  return (
    <section className="card">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>
          Name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
        </label>
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
        <button type="submit">Create account</button>
      </form>
      <p>
        Ai deja cont? <Link to="/login">Login</Link>
      </p>
    </section>
  );
}
