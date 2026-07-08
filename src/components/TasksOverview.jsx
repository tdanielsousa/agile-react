import React, { useState, useEffect } from "react";

function TasksOverview({ user }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/pie_metrics?userId=${user.id}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData && !resData.error) {
          setData(resData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching pie chart data:", err);
        setLoading(false);
      });
  }, [user.id]);

  if (loading) {
    return (
      <section className="content-card stats-card">
        <p>Loading overview...</p>
      </section>
    );
  }

  const stats = data || {
    totalTasks: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    todoPct: 0,
    inProgressPct: 0,
    completedPct: 0,
    overduePct: 0,
  };

  const chartStyle = {
    "--todo": stats.todoPct,
    "--progress": stats.inProgressPct,
    "--completed": stats.completedPct,
    "--overdue": stats.overduePct,
  };

  return (
    <section className="content-card stats-card">
      <div className="card-header">
        <h2>Current Projects Tasks Overview</h2>
      </div>
      <div className="stats-body">
        <div className="stats-labels">
          <div className="label-row">
            <span className="bullet gray"></span>
            Total Tasks Assigned{" "}
            <strong className="val">{stats.totalTasks}</strong>
          </div>
          <div className="label-row">
            <span className="bullet blue"></span>
            To-Do ({stats.todoPct}%){" "}
            <strong className="val">{stats.todo}</strong>
          </div>
          <div className="label-row">
            <span className="bullet yellow"></span>
            In Progress ({stats.inProgressPct}%){" "}
            <strong className="val">{stats.inProgress}</strong>
          </div>
          <div className="label-row">
            <span className="bullet green"></span>
            Completed ({stats.completedPct}%){" "}
            <strong className="val">{stats.completed}</strong>
          </div>
          <div className="label-row">
            <span className="bullet red"></span>
            Overdue ({stats.overduePct}%){" "}
            <strong className="val">{stats.overdue}</strong>
          </div>
        </div>
        <div className="chart-container">
          <div
            className={`pie-chart ${stats.totalTasks === 0 ? "no-tasks" : ""}`}
            style={chartStyle}
          ></div>
        </div>
      </div>
    </section>
  );
}

export default TasksOverview;
