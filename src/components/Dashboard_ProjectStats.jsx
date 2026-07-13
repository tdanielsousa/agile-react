import React, { useState, useEffect } from "react";

function Dashboard_ProjectStats({ user }) {
  const [stats, setStats] = useState({
    totalProjects: 0,
    todo: 0,
    progress: 0,
    completed: 0,
    overdue: 0,
    pctTodo: 0,
    pctProgress: 0,
    pctCompleted: 0,
    pctOverdue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/projects-stats?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          const totalTasks =
            data.todoTasks +
            data.progressTasks +
            data.completedTasks +
            data.overdueTasks;

          if (totalTasks > 0) {
            setStats({
              totalProjects: data.totalProjects,
              todo: data.todoTasks,
              progress: data.progressTasks,
              completed: data.completedTasks,
              overdue: data.overdueTasks,
              pctTodo: (data.todoTasks / totalTasks) * 100,
              pctProgress: (data.progressTasks / totalTasks) * 100,
              pctCompleted: (data.completedTasks / totalTasks) * 100,
              pctOverdue: (data.overdueTasks / totalTasks) * 100,
            });
          } else {
            setStats({
              totalProjects: data.totalProjects,
              todo: 0,
              progress: 0,
              completed: 0,
              overdue: 0,
              pctTodo: 0,
              pctProgress: 0,
              pctCompleted: 0,
              pctOverdue: 0,
            });
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error getting stats:", err);
        setLoading(false);
      });
  }, [user.id]);

  if (loading) {
    return (
      <section className="content-card stats-card">
        <p>Loading stats...</p>
      </section>
    );
  }

  const hasNoTasks =
    stats.todo + stats.progress + stats.completed + stats.overdue === 0;

  return (
    <section className="content-card stats-card">
      <div className="card-header">
        <h2>All Projects Tasks Stats</h2>
      </div>
      <div className="stats-body">
        <div className="stats-labels">
          <div className="label-row">
            <span className="bullet gray"></span> Total Projects{" "}
            <strong className="val">{stats.totalProjects}</strong>
          </div>
          <div className="label-row">
            <span className="bullet blue"></span> To-Do (
            {stats.pctTodo.toFixed(2)}%){" "}
            <strong className="val">{stats.todo}</strong>
          </div>
          <div className="label-row">
            <span className="bullet yellow"></span> In Progress (
            {stats.pctProgress.toFixed(2)}%){" "}
            <strong className="val">{stats.progress}</strong>
          </div>
          <div className="label-row">
            <span className="bullet green"></span> Completed (
            {stats.pctCompleted.toFixed(2)}%){" "}
            <strong className="val">{stats.completed}</strong>
          </div>
          <div className="label-row">
            <span className="bullet red"></span> Overdue (
            {stats.pctOverdue.toFixed(2)}%){" "}
            <strong className="val">{stats.overdue}</strong>
          </div>
        </div>

        <div className="chart-container">
          <div
            className={`pie-chart ${hasNoTasks ? "no-tasks" : ""}`}
            style={{
              "--todo": stats.pctTodo,
              "--progress": stats.pctProgress,
              "--completed": stats.pctCompleted,
            }}
          ></div>
        </div>
      </div>
    </section>
  );
}

export default Dashboard_ProjectStats;
