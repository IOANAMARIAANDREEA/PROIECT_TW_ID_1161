import React from "react";

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmText = "Sterge", cancelText = "Anuleaza" }) {
  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>{title}</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button type="button" className="secondary" onClick={onCancel}>
            {cancelText}
          </button>
          <button type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
