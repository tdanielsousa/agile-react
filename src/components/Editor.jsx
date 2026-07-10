import React from "react";
import Editor_Meta from "./Editor_Meta";
import Toolbar from "./Toolbar";
import Editor_Workspace from "./Editor_Workspace";

function Editor({ user, projectId, setProjectId, currentView, setView }) {
  if (!projectId) {
    return (
      <div className="editor-container empty-state">
        <p className="empty-message">
          You haven't selected a project, please select one.
        </p>
        <a
          href="#"
          className={`view-all ${currentView === "projects" ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            setView("projects");
          }}
        >
          Go to Project List ➔
        </a>
      </div>
    );
  }

  return (
    <Editor_Meta
      projectId={projectId}
      setProjectId={setProjectId}
      setView={setView}
    >
      {({
        project,
        loading,
        layout,
        setLayout,
        tasksVersion,
        handleTaskAdded,
        handleStatusChange,
        handleDeleteProject,
      }) => {
        if (loading || !project) {
          return (
            <div className="editor-container">
              <div className="editor-workspace">
                <p className="workspace-placeholder">Connecting to database...</p>
              </div>
            </div>
          );
        }

        return (
          <div className="editor-container">
            <Toolbar
              user={user}
              project={project}
              projectId={projectId}
              layout={layout}
              setLayout={setLayout}
              onStatusChange={handleStatusChange}
              onDeleteProject={handleDeleteProject}
              onRefreshData={handleTaskAdded}
            />

            <Editor_Workspace
              user={user}
              project={project}
              layout={layout}
              tasksVersion={tasksVersion}
            />
          </div>
        );
      }}
    </Editor_Meta>
  );
}

export default Editor;