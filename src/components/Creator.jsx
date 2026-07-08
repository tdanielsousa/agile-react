import React, { useState } from "react";
import "../create_edit.css";

function Creator({ user, onClose }) {
  const [projectName, setProjectName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!projectName.trim()) {
      setError("Please provide a project name.");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/create-project", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: projectName,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setSuccess("Created successfully!");
      setProjectName("");

      setTimeout(() => {
        onClose();
      }, 2200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="creator-container modal-box"
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="modal-close-btn" onClick={onClose}>
          &times;
        </button>

        {error && (
          <div className="alert-message error-banner">
            <p>{error}</p>
          </div>
        )}
        {success && (
          <div className="alert-message success-banner">
            <p>{success}</p>
          </div>
        )}

        <div className="top">
          <h2>Create New Project</h2>
        </div>
        <form onSubmit={handleSubmit} className="creator-form">
          <div className="form-group">
            <label htmlFor="projectName">Project Name</label>
            <input
              type="text"
              id="projectName"
              placeholder="e.g., E-commerce Redesign"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              disabled={submitting}
            />
          </div>

          <button type="submit" className="btn-submit" disabled={submitting}>
            {submitting ? "Creating..." : "Create Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Creator;
