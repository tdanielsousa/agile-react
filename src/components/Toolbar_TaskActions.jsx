import React, { useState } from "react";
import { createPortal } from "react-dom";
import InsertTask from "./InsertTask";

function Toolbar_TaskActions({ user, projectId, onRefreshData }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="toolbar-group">
      <a
        href="#"
        className="toolbar-btn btn-add"
        onClick={(e) => {
          e.preventDefault();
          setIsTaskModalOpen(true);
        }}
      >
        + Add Task
      </a>

      <a href="#" className="toolbar-btn btn-change-name">
        Change Project Name
      </a>

      {isTaskModalOpen &&
        createPortal(
          <InsertTask
            user={user}
            projectId={projectId}
            onClose={() => setIsTaskModalOpen(false)}
            onTaskAdded={onRefreshData}
          />,
          document.body
        )}
    </div>
  );
}

export default Toolbar_TaskActions;
