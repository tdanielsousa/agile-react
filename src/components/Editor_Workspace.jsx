import React, { useState } from "react";
import Editor_Workspace_Meta from "./Editor_Workspace_Meta";
import Editor_Workspace_Kanban from "./Editor_Workspace_Kanban";
import Editor_Workspace_List from "./Editor_Workspace_List";
import TaskEditModal from "./TaskEditModal";

function Editor_Workspace({
  user,
  project,
  layout,
  tasksVersion: propTasksVersion,
}) {
  const [localVersion, setLocalVersion] = useState(0);

  const currentVersion =
    propTasksVersion !== undefined
      ? `${propTasksVersion}_${localVersion}`
      : localVersion;

  const [activeTask, setActiveTask] = useState(null);

  const handleTaskUpdated = () => {
    setLocalVersion((prev) => prev + 1);
  };

  return (
    <>
      <Editor_Workspace_Meta project={project} tasksVersion={currentVersion}>
        {({ loading, columns }) => {
          if (loading) {
            return (
              <div className="editor-workspace msg-state">
                <p>Loading tasks from Turso...</p>
              </div>
            );
          }

          return (
            <div className="print_editor-workspace">
              {layout === "kanban" ? (
                <Editor_Workspace_Kanban
                  columns={columns}
                  onSelectTask={setActiveTask}
                />
              ) : (
                <Editor_Workspace_List
                  columns={columns}
                  onSelectTask={setActiveTask}
                />
              )}
            </div>
          );
        }}
      </Editor_Workspace_Meta>

      {activeTask && (
        <TaskEditModal
          task={activeTask}
          onClose={() => setActiveTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </>
  );
}

export default Editor_Workspace;
