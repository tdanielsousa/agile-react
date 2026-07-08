import React from 'react';

function Workspace({ user, project, layout }) {
  return (
    <div className="editor-workspace">
      <p className="workspace-placeholder">
        Workspace loaded for project <strong>{project.name}</strong>. Task board layouts will render here.
      </p>
      
      {/* Test element to verify the layout toggle is working */}
      <p style={{ marginTop: '10px', fontWeight: 'bold', color: '#0070f3' }}>
        Current Layout State: {layout}
      </p>
    </div>
  );
}

export default Workspace;