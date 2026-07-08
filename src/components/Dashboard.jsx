import React, { useState } from "react";
import Sidebar from "./Sidebar";
import MetricCards from "./MetricCards";
import ActiveProjects from "./ActiveProjects";
import TasksOverview from "./TasksOverview";
import ProjectStats from "./ProjectStats";
import ProjectList from "./ProjectList";
import Creator from "./Creator";
import Editor from "./Editor";
import App from "../App";
import "../dashboard.css";

function Dashboard({ user, onLogout }) {
  const [darkMode, setDarkMode] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard");

  const [selectedProjectId, setSelectedProjectId] = useState(null);

  document.addEventListener("click", (e) => {
    if (e.target.tagName === "A" && e.target.getAttribute("href") === "#") {
      e.preventDefault();
    }
  });

  if (!user) {
    return <App />;
  }

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const getHeaderTitle = () => {
    switch (currentView) {
      case "projects":
        return "Project List";
      case "creator":
        return "Project Creator";
      case "editor":
        return "Project Editor";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="vh">
      <div className={`dashbg ${darkMode ? "dark-mode" : ""}`}>
        <div className="app-container">
          <Sidebar
            onLogout={onLogout}
            toggleDarkMode={toggleDarkMode}
            user={user}
            currentView={currentView}
            setView={setCurrentView}
          />

          <main className="main-content">
            <header className="main-header">
              <h1>{getHeaderTitle()}</h1>
              <div className="language-selector">
                user data: {JSON.stringify(user, null, 2)}
              </div>
            </header>

            {currentView === "dashboard" && (
              <>
                <div key="metrics" className="fade-in">
                  <MetricCards user={user} />
                </div>

                <div className="content-grid">
                  <div key="active-projects" className="fade-in overflow">
                    <ActiveProjects
                      user={user}
                      currentView={currentView}
                      setView={setCurrentView}
                      onSelectProject={(id) => {
                        setSelectedProjectId(id);
                        setCurrentView("editor");
                      }}
                    />
                  </div>

                  <div key="stats-column" className="right-column fade-in">
                    <TasksOverview user={user} />
                    <ProjectStats user={user} />
                  </div>
                </div>
              </>
            )}

            {currentView === "projects" && (
              <div key="project-list" className="content-card fade-in">
                <ProjectList
                  user={user}
                  currentView={currentView}
                  setView={setCurrentView}
                  onSelectProject={(id) => {
                    setSelectedProjectId(id);
                    setCurrentView("editor");
                  }}
                />
              </div>
            )}

            {currentView === "creator" && (
              <div key="creator-view" className="content-card create fade-in">
                <Creator user={user} />
              </div>
            )}

            {currentView === "editor" && (
              <div key="editor-view" className="content-card fade-in">
                <Editor
                  user={user}
                  projectId={selectedProjectId}
                  setProjectId={setSelectedProjectId}
                  currentView={currentView}
                  setView={setCurrentView}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
