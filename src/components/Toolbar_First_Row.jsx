import React from "react";

function Toolbar_First_Row({ displayName, projectId, project, onDeleteProject }) {
  return (
    <div className="toolbar-row">
      <div className="toolbar-group">
        <span className="label">Project:</span>
        <span className="project-current-name">
          {displayName} {/*(ID: {projectId}) — <small>[{project.status}]</small>*/}
        </span>
      </div>

      <div className="toolbar-group actions-right">
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

export default Toolbar_First_Row;
