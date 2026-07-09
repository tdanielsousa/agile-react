import React, { useState } from "react";
import { createPortal } from "react-dom";
import Creator from "./Creator";
import Sidebar_DateTimeDisplay from "./Sidebar_DateTimeDisplay";

function Sidebar({ onLogout, toggleDarkMode, user, currentView, setView }) {
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  return (
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo">
          <h1 className="brand-title">Agile</h1>
        </div>

        <div className="create-btn-group">
          <button className="btn-create" onClick={() => setIsCreatorOpen(true)}>
            Create New
          </button>
          <button className="btn-plus" onClick={() => setIsCreatorOpen(true)}>
            +
          </button>
        </div>

        <nav className="nav-menu">
          <a
            href="#"
            className={`nav-item ${
              currentView === "dashboard" ? "active" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              setView("dashboard");
            }}
          >
            <span className="icon">📊</span> Dashboard
          </a>

          <a
            href="#"
            className={`nav-item ${currentView === "projects" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setView("projects");
            }}
          >
            <span className="icon">📋</span> Project List
          </a>

          <a
            href="#"
            className={`nav-item ${currentView === "editor" ? "active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              setView("editor");
            }}
          >
            <span className="icon">✏️</span> Editor
          </a>
        </nav>
      </div>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="username">{user.name}</div>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onLogout();
            }}
            className="logout"
          >
            [ Logout ]
          </a>
        </div>
        <div className="theme-toggle" onClick={toggleDarkMode}>
          <span className="icon">🌓</span>{" "}
          <span className="toggle-text">Toggle Light/Dark Mode</span>
        </div>
        <div className="date-time">
          {" "}
          <Sidebar_DateTimeDisplay />{" "}
        </div>
      </div>

      {isCreatorOpen &&
        createPortal(
          <Creator user={user} onClose={() => setIsCreatorOpen(false)} />,
          document.body
        )}
    </aside>
  );
}

export default Sidebar;
