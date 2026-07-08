import React from "react";

function Toolbar_ProjectMeta({
  project,
  projectId,
  onStatusChange,
  onDeleteProject,
}) {
  return (
    <div className="toolbar-row">
      <div className="toolbar-group">
        <span className="label">Project:</span>
        <span className="project-current-name">
          {project.name} (ID: {projectId}) — <small>[{project.status}]</small>
        </span>
      </div>

      <div className="toolbar-group actions-right">
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
        <a
          href="#"
          className="toolbar-btn btn-delete"
          onClick={onDeleteProject}
        >
          Delete project
        </a>
      </div>
    </div>
  );
}

export default Toolbar_ProjectMeta;
