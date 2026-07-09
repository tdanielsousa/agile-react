import React, { useState } from 'react';

function UpdateProjectName({ projectId, currentName, onClose, onNameUpdated }) {
  const [newName, setNewName] = useState(currentName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newName.trim() || isSubmitting) return;

    setIsSubmitting(true);

    fetch('/api/update-project-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        projectId: projectId,
        newName: newName.trim(),
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update project name');
        return res.json();
      })
      .then(() => {
        onNameUpdated();
        onClose();
      })
      .catch((err) => {
        console.error('Error updating project name:', err);
        alert('Could not update project name.');
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="change-name-modal-backdrop" onClick={onClose}>
      <div className="change-name-modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="change-name-modal-close-btn" onClick={onClose}>
          &times;
        </button>

        <h3>Change Project Name</h3>
        <form onSubmit={handleSubmit}>
          <div className="change-name-modal-form-group">
            <label htmlFor="projectName">New Name:</label>
            <input
              type="text"
              id="projectName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new project name"
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="change-name-modal-actions">
            <button 
              type="button" 
              className="change-name-modal-btn-cancel" 
              onClick={onClose} 
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="change-name-modal-btn-save" 
              disabled={isSubmitting || !newName.trim()}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateProjectName;