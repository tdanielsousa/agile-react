import React, { useState, useEffect } from 'react';

function MetricCards({ user }) {
  const [metrics, setMetrics] = useState({
    activeProjects: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/metrics?userId=${user.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data && !data.error) {
          setMetrics(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao ir buscar métricas:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <section className="metrics-grid"><p>Loading metrics...</p></section>;
  }

  return (
    <section className="metrics-grid">
      <div className="card-metric blue">
        <div className="metric-value">{metrics.activeProjects}</div>
        <div className="metric-label">Active Projects</div>
      </div>
      <div className="card-metric green">
        <div className="metric-value">{metrics.completedTasks}</div>
        <div className="metric-label">Completed Tasks</div>
      </div>
      <div className="card-metric yellow">
        <div className="metric-value">{metrics.pendingTasks}</div>
        <div className="metric-label">Pending Tasks</div>
      </div>
      <div className="card-metric red">
        <div className="metric-value">{metrics.overdueTasks}</div>
        <div className="metric-label">Overdue Tasks</div>
      </div>
    </section>
  );
}

export default MetricCards;