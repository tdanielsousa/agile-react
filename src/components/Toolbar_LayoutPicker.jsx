import React from "react";

function Toolbar_LayoutPicker({ layout, setLayout }) {
  return (
    <div className="toolbar-group utilities-right">
      <a
        href="#"
        className={`toolbar-btn ${layout === "kanban" ? "active-layout" : ""}`}
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
  );
}

export default Toolbar_LayoutPicker;
