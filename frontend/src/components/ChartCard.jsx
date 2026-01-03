// frontend/src/components/ChartCard.jsx
import React from "react";
import "../css/Dashboard.css";

export default function ChartCard({ title, children }) {
  return (
    <div className="chart-card">
      <h4 className="chart-card-title">{title}</h4>
      <div className="chart-card-body">{children}</div>
    </div>
  );
}
