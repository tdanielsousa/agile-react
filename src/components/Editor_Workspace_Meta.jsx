import React, { useState, useEffect } from "react";

function Editor_Workspace_Meta({ project, tasksVersion, children }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!project?.id) return;

    setLoading(true);

    fetch(`/get-tasks?projectId=${project.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch tasks");
        return res.json();
      })
      .then((data) => {
        setTasks([...data]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading tasks:", err);
        setLoading(false);
      });
  }, [project?.id, tasksVersion]);
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const progressTasks = tasks.filter((t) => t.status === "PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");
  const overTasks = tasks.filter((t) => t.status === "OVER");

  const columns = [
    { title: "To Do", tasks: todoTasks, class: "todo" },
    { title: "In Progress", tasks: progressTasks, class: "progress" },
    { title: "Completed", tasks: completedTasks, class: "completed" },
    { title: "Over", tasks: overTasks, class: "over" },
  ];

  return children({ loading, columns });
}

export default Editor_Workspace_Meta;
