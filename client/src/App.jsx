import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DocumentDetail from "./pages/DocumentDetail.jsx";
import Dropbox from "./pages/Dropbox.jsx";
import Categories from "./pages/Categories.jsx";
import DocumentTypes from "./pages/DocumentTypes.jsx";
import { getToken } from "./services/auth.js";

function ProtectedRoute({ children }) {
  const token = getToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/documents" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents/:id"
          element={
            <ProtectedRoute>
              <DocumentDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dropbox"
          element={
            <ProtectedRoute>
              <Dropbox />
            </ProtectedRoute>
          }
        />
        <Route
          path="/categorii"
          element={
            <ProtectedRoute>
              <Categories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tipuri"
          element={
            <ProtectedRoute>
              <DocumentTypes />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
