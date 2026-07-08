import React, { useState, useEffect } from 'react';
import Toolbar from './Toolbar';
import Workspace from './Workspace';

function Editor({ user, projectId, setProjectId, currentView, setView }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState('kanban'); 
  
  // Track dataset updates to trigger re-fetches
  const [tasksVersion, setTasksVersion] = useState(0);

  const handleTaskAdded = () => {
    setTasksVersion(prev => prev + 1);
  };

  // Fetch project execution when selection context changes
  useEffect(() => {
    if (!projectId) {
      setProject(null);
      return;
    }

    setLoading(true);

    fetch(`/get-project?projectId=${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch project');
        return res.json();
      })
      .then((data) => {
        if (!data.error) {
          setProject(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Data connection error:", err);
        setLoading(false);
      });
  }, [projectId]);

  // Handler to toggle project status (ACTIVE / OVER)
  const handleStatusChange = (e, newStatus) => {
    e.preventDefault();
    if (!project) return;

    const previousStatus = project.status;
    setProject({ ...project, status: newStatus });

    fetch('/update-project-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId, status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update status');
        return res.json();
      })
      .catch((err) => {
        console.error("Database sync error:", err);
        setProject({ ...project, status: previousStatus });
      });
  };

  // Handler to delete project completely
  const handleDeleteProject = (e) => {
    e.preventDefault();
    
    const confirmDelete = window.confirm(`Are you sure you want to delete "${project?.name}"? This will also remove its tasks.`);
    if (!confirmDelete) return;

    fetch('/delete-project', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to delete project');
        return res.json();
      })
      .then(() => {
        setProjectId(null);
        setView('projects');
      })
      .catch((err) => {
        console.error("Deletion error:", err);
        alert("Could not delete project.");
      });
  };
  
  // Guard Clauses for empty selections or network loading
  if (!projectId) {
    return (
      <div className="editor-container empty-state">
        <p className="empty-message">You haven't selected a project, please select one.</p>
        <a 
          href="#" 
          className={`view-all ${currentView === 'projects' ? 'active' : ''}`}
          onClick={(e) => { e.preventDefault(); setView('projects'); }}
        > 
          Go to Project List ➔
        </a>
      </div>
    );
  }

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
      
      <Workspace
        user={user}  
        project={project}
        layout={layout}
        tasksVersion={tasksVersion} 
      />
    </div>
  );
}

export default Editor;