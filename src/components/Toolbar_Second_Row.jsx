import React, { useState } from "react";
import { createPortal } from "react-dom";
import UpdateProjectName from "./UpdateProjectName";

function Toolbar_Second_Row({ projectId, displayName, project, onStatusChange, onLocalNameChange }) {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);

  return (
    <div className="toolbar-row secondary-row">
      <div className="toolbar-group">
        <a 
          href="#" 
          className="toolbar-btn btn-change-name"
          onClick={(e) => {
            e.preventDefault();
            setIsNameModalOpen(true);
          }}
        >
          Change Project Name
        </a>
      </div>

      <div className="toolbar-group utilities-right">
        <a
          href="#"
          className={`toolbar-btn btn-active ${
            project.status === "ACTIVE" ? "active-layout" : ""
          }`}
          onClick={(e) => onStatusChange(e, "ACTIVE")}
        >
          Set project as Active
        </a>
        <a
          href="#"
          className={`toolbar-btn btn-done ${
            project.status === "OVER" ? "active-layout" : ""
          }`}
          onClick={(e) => onStatusChange(e, "OVER")}
        >
          Set project as Archived
        </a>
      </div>

      {isNameModalOpen &&
        createPortal(
          <UpdateProjectName
            projectId={projectId}
            currentName={displayName}
            onClose={() => setIsNameModalOpen(false)}
            onNameUpdated={(savedName) => {
              if (onLocalNameChange) onLocalNameChange(savedName);
            }} 
          />,
          document.body
        )}
    </div>
  );
}

export default Toolbar_Second_Row;