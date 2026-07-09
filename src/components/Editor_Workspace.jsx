import React from "react";
import Editor_Workspace_Meta from "./Editor_Workspace_Meta";
import Editor_Workspace_Kanban from "./Editor_Workspace_Kanban";
import Editor_Workspace_List from "./Editor_Workspace_List";

function Editor_Workspace({ user, project, layout, tasksVersion }) {
  return (
    <Editor_Workspace_Meta project={project} tasksVersion={tasksVersion}>
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
              <Editor_Workspace_Kanban columns={columns} />
            ) : (
              <Editor_Workspace_List columns={columns} />
            )}
          </div>
        );
      }}
    </Editor_Workspace_Meta>
  );
}

export default Editor_Workspace;
