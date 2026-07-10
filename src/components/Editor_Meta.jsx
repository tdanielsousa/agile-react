import React, { useState, useEffect } from "react";

function Editor_Meta({ projectId, setProjectId, setView, children }) {
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [layout, setLayout] = useState("kanban");
  const [tasksVersion, setTasksVersion] = useState(0);

  const handleTaskAdded = () => {
    setTasksVersion((prev) => prev + 1);
  };

  useEffect(() => {
    if (!projectId) {
      setProject(null);
      return;
    }

    setLoading(true);

    fetch(`/get-project?projectId=${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch project");
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

  const handleStatusChange = (e, newStatus) => {
    e.preventDefault();
    if (!project) return;

    const previousStatus = project.status;
    setProject({ ...project, status: newStatus });

    fetch("/update-project-status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId, status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update status");
        return res.json();
      })
      .catch((err) => {
        console.error("Database sync error:", err);
        setProject({ ...project, status: previousStatus });
      });
  };

  const handleDeleteProject = (e) => {
    e.preventDefault();

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${project?.name}"? This will also remove its tasks.`
    );
    if (!confirmDelete) return;

    fetch("/delete-project", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ projectId }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete project");
        return res.json();
      })
      .then(() => {
        setProjectId(null);
        setView("projects");
      })
      .catch((err) => {
        console.error("Deletion error:", err);
        alert("Could not delete project.");
      });
  };

  return children({
    project,
    loading,
    layout,
    setLayout,
    tasksVersion,
    handleTaskAdded,
    handleStatusChange,
    handleDeleteProject,
  });
}

export default Editor_Meta;
