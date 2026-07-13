import React, { useState, useEffect } from "react";
import Toolbar_First_Row from "./Toolbar_First_Row";
import Toolbar_Second_Row from "./Toolbar_Second_Row";
import Toolbar_Third_Row from "./Toolbar_Third_Row";

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
  const [localNameOverride, setLocalNameOverride] = useState(null);

  useEffect(() => {
    setLocalNameOverride(null);
  }, [projectId]);

  const displayName =
    localNameOverride !== null ? localNameOverride : project.name;

  return (
    <div className="editor-toolbar">
      <Toolbar_First_Row
        displayName={displayName}
        projectId={projectId}
        project={project}
        onDeleteProject={onDeleteProject}
      />

      <Toolbar_Second_Row
        projectId={projectId}
        displayName={displayName}
        project={project}
        onStatusChange={onStatusChange}
        onLocalNameChange={(newName) => {
          setLocalNameOverride(newName);
          if (onRefreshData) onRefreshData();
        }}
      />

      <Toolbar_Third_Row
        user={user}
        projectId={projectId}
        layout={layout}
        setLayout={setLayout}
        onRefreshData={onRefreshData}
      />
    </div>
  );
}

export default Toolbar;
