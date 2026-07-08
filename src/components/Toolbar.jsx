import React from "react";
import Toolbar_ProjectMeta from "./Toolbar_ProjectMeta";
import Toolbar_TaskActions from "./Toolbar_TaskActions";
import Toolbar_LayoutPicker from "./Toolbar_LayoutPicker";

function Toolbar({
  user,
  project,
  projectId,
  layout,
  setLayout,
  onStatusChange,
  onDeleteProject,
  onRefreshData,
}) {
  return (
    <div className="editor-toolbar">
      <Toolbar_ProjectMeta
        project={project}
        projectId={projectId}
        onStatusChange={onStatusChange}
        onDeleteProject={onDeleteProject}
      />

      <div className="toolbar-row secondary-row">
        <Toolbar_TaskActions
          user={user}
          projectId={projectId}
          onRefreshData={onRefreshData}
        />

        <Toolbar_LayoutPicker layout={layout} setLayout={setLayout} />
      </div>
    </div>
  );
}

export default Toolbar;
