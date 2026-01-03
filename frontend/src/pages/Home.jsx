import React, { useEffect, useState } from "react";
import { getTodayActivity } from "../services/activityService";
import { getRecommendations } from "../services/aiService";
import { Link } from "react-router-dom";
import "../css/Home.css";

export default function Home() {
  const [today, setToday] = useState(null);
  const [tips, setTips] = useState([]);

  useEffect(() => {
    getTodayActivity()
      .then((res) => setToday(res.data))
      .catch(() => setToday(null));

    getRecommendations(false)
      .then((res) => setTips(res.data.suggestions?.slice(0, 2) || []))
      .catch(() => setTips([]));
  }, []);

  return (
    <div className="home-page">
      {/* HERO */}
      <div className="home-hero">
        <h1>🌱 Carbon Vision</h1>
        <p>Track today. Improve tomorrow. Save the planet.</p>
      </div>

      {/* TODAY SUMMARY */}
      <div className="home-card">
        <h3>Today’s Carbon Footprint</h3>
        {today ? (
          <h2>{today.carbonPoints?.toFixed(2)} kg CO₂</h2>
        ) : (
          <p>No activity logged today.</p>
        )}
      </div>

      {/* QUICK ACTIONS */}
      <div className="quick-actions">
        <Link to="/activity" className="action-btn">
          ➕ Log Today’s Activity
        </Link>

        <Link to="/dashboard" className="action-btn secondary">
          📊 Dashboard
        </Link>

        <Link to="/recommendations" className="action-btn outline">
          🤖 AI Tips
        </Link>
      </div>

      {/* AI PREVIEW */}
      <div className="ai-preview">
        <h3>AI Suggestions</h3>

        {tips.length === 0 && (
          <p className="muted">Log activity to get AI recommendations.</p>
        )}

        {tips.map((t, i) => (
          <div key={i} className="ai-tip">
            <strong>{t.title}</strong>
            <p>{t.detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
