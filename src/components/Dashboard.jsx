import React from "react";
import Dashboard_Meta from "./Dashboard_Meta";
import Sidebar from "./Sidebar";
import Dashboard_MetricCards from "./Dashboard_MetricCards";
import Dashboard_ActiveProjects from "./Dashboard_ActiveProjects";
import Dashboard_TasksOverview from "./Dashboard_TasksOverview";
import Dashboard_ProjectStats from "./Dashboard_ProjectStats";
import Dashboard_ProjectList from "./Dashboard_ProjectList";
import Creator from "./Creator";
import Editor from "./Editor";
import App from "../App";
import "../dashboard.css";

function Dashboard({ user, onLogout }) {

  if (!user) {
    return <App />;
  }

  return (
    <Dashboard_Meta>
      {({
        darkMode,
        currentView,
        setCurrentView,
        selectedProjectId,
        setSelectedProjectId,
        toggleDarkMode,
        headerTitle,
      }) => (
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
                  <h1>{headerTitle}</h1>
                 {/* <div className="language-selector">
                    user data: {JSON.stringify(user, null, 2)}
                  </div>*/}
                </header>

                {currentView === "dashboard" && (
                  <>
                    <div key="metrics" className="fade-in">
                      <Dashboard_MetricCards user={user} />
                    </div>

                    <div className="content-grid">
                      <div key="active-projects" className="fade-in overflow">
                        <Dashboard_ActiveProjects
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
                        <Dashboard_TasksOverview user={user} />
                        <Dashboard_ProjectStats user={user} />
                      </div>
                    </div>
                  </>
                )}

                {currentView === "projects" && (
                  <div key="project-list" className="content-card fade-in">
                    <Dashboard_ProjectList
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
                  <div
                    key="creator-view"
                    className="content-card create fade-in"
                  >
                    <Creator user={user} />
                  </div>
                )}

                {currentView === "editor" && (
                  <div key="editor-view" className="content-card editor fade-in">
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
      )}
    </Dashboard_Meta>
  );
}

export default Dashboard;
