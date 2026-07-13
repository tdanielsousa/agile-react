import React, { useState } from "react";
import { createPortal } from "react-dom";
import InsertTask from "./InsertTask";

function Toolbar_Third_Row({
  user,
  projectId,
  layout,
  setLayout,
  onRefreshData,
}) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="toolbar-row secondary-row">
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
      </div>

      <div className="toolbar-group utilities-right">
        <a
          href="#"
          className={`toolbar-btn ${
            layout === "kanban" ? "active-layout" : ""
          }`}
          onClick={(e) => {
            e.preventDefault();
            setLayout("kanban");
          }}
        >
          Kanban Layout
        </a>
        <a
          href="#"
          className={`toolbar-btn ${layout === "list" ? "active-layout" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setLayout("list");
          }}
        >
          List Layout
        </a>
      </div>

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

export default Toolbar_Third_Row;
