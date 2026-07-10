import React from 'react';
import UpdateProjectName_Meta from './UpdateProjectName_Meta';

function UpdateProjectName({ projectId, currentName, onClose, onNameUpdated }) {
  const {
    newName,
    setNewName,
    isSubmitting,
    handleSubmit,
  } = UpdateProjectName_Meta({ projectId, currentName, onClose, onNameUpdated });

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
