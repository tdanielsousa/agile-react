import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import InsertTask from './InsertTask';

function Toolbar({ user, project, projectId, layout, setLayout, onStatusChange, onDeleteProject, onRefreshData }) {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  return (
    <div className="editor-toolbar">
      {/* Primary Row: Info & Main Project Controls */}
      <div className="toolbar-row">
        <div className="toolbar-group">
          <span className="label">Project:</span>
          <span className="project-current-name">
            {project.name} (ID: {projectId}) — <small>[{project.status}]</small>
          </span>
        </div>
        
        <div className="toolbar-group actions-right">
          <a 
            href="#" 
            className={`toolbar-btn btn-active ${project.status === 'ACTIVE' ? 'active-layout' : ''}`}
            onClick={(e) => onStatusChange(e, 'ACTIVE')}
          >
            Set project as Active
          </a>
          <a 
            href="#" 
            className={`toolbar-btn btn-done ${project.status === 'OVER' ? 'active-layout' : ''}`}
            onClick={(e) => onStatusChange(e, 'OVER')}
          >
            Set project as Archived
          </a>
          <a 
            href="#" 
            className="toolbar-btn btn-delete" 
            onClick={onDeleteProject}
          >
            Delete project
          </a>
        </div>
      </div>

      {/* Secondary Row: Subtask Adders & Layout Toggles */}
      <div className="toolbar-row secondary-row">
        <div className="toolbar-group">
          <a 
            href="#" 
            className="toolbar-btn btn-add"
            onClick={(e) => { e.preventDefault(); setIsTaskModalOpen(true); }}
          >
            + Add Task
          </a>
        </div>

        <div className="toolbar-group utilities-right">
          <a 
            href="#" 
            className={`toolbar-btn ${layout === 'kanban' ? 'active-layout' : ''}`}
            onClick={(e) => { e.preventDefault(); setLayout('kanban'); }}
          >
            Kanban Layout
          </a>
          <a 
            href="#" 
            className={`toolbar-btn ${layout === 'list' ? 'active-layout' : ''}`}
            onClick={(e) => { e.preventDefault(); setLayout('list'); }}
          >
            List Layout
          </a>
        </div>
      </div>

      {/* React Portal Modal Render Tree Injection */}
      {isTaskModalOpen && createPortal(
        <InsertTask 
          user={user} 
          projectId={projectId} 
          onClose={() => setIsTaskModalOpen(false)}
          onTaskAdded={onRefreshData} 
        />,
        document.body
      )}
    </div>
  );
}

export default Toolbar;
