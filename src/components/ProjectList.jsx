import React, { useState, useEffect } from "react";

function ProjectList({ user, currentView, setView, onSelectProject }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/project-list?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao ir buscar projetos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section className="content-card">
        <p>Loading projects...</p>
      </section>
    );
  }

  return (
    <section className="content-projlist">
      <div className="card-header">
        <h2>All Projects</h2>
      </div>

      {projects.length === 0 ? (
        <div className="no-projects">
          <p>No projects yet</p>
        </div>
      ) : (
        <div className="projects-list">
          {projects.map((project) => {
            let statusClass = "red";
            let statusText = "Archived";

            if (project.status === "ACTIVE") {
              statusClass = "blue";
              statusText = "Active";
            }

            return (
              <div
                className="project-item"
                key={project.id}
                style={{ cursor: "pointer" }}
                onClick={() => onSelectProject(project.id)}
              >
                <div className="project-info">
                  <span className="project-name">
                    {project.name} id nr: {project.id}
                  </span>

                  <span className={`project-stat ${statusClass}`}>
                    {statusText}
                  </span>

                  <span className="project-percentage">
                    Total Tasks <strong>{project.totalTasks}</strong>
                  </span>
                </div>

                <div className="progress-bar segmented">
                  <div
                    className="segment blue"
                    style={{ width: `${project.todoPct}%` }}
                  ></div>
                  <div
                    className="segment yellow"
                    style={{ width: `${project.inProgressPct}%` }}
                  ></div>
                  <div
                    className="segment green"
                    style={{ width: `${project.completedPct}%` }}
                  ></div>
                  <div
                    className="segment red"
                    style={{ width: `${project.overduePct}%` }}
                  ></div>
                </div>

                <div className="project-badges">
                  <span className="badge blue">
                    <strong>{project.todo}</strong> To-Do
                  </span>
                  <span className="badge yellow">
                    <strong>{project.inProgress}</strong> In Progress
                  </span>
                  <span className="badge green">
                    <strong>{project.completed}</strong> Completed
                  </span>
                  <span className="badge red">
                    <strong>{project.overdue}</strong> Overdue
                  </span>
                </div>

                <div className="user-notes-box">
                  <div className="dates-container">
                    <span className="date-start">
                      Created at - {project.createdAt}
                    </span>
                    <span className="date-end"></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default ProjectList;
