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
    <div className="modal-overlay" onClick={onClose} style={overlayStyle}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={modalStyle}>
        <h3>Change Project Name</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="projectName" style={{ display: 'block', marginBottom: '5px' }}>New Name:</label>
            <input
              type="text"
              id="projectName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Enter new project name"
              required
              disabled={isSubmitting}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !newName.trim()}>
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
};
const modalStyle = {
  backgroundColor: '#fff', padding: '20px', borderRadius: '6px', width: '350px', maxWidth: '90%'
};

export default UpdateProjectName;