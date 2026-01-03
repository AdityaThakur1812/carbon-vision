import React, { useEffect, useState } from "react";
import { getRecommendations } from "../services/aiService";
import "../css/Recommendations.css";

export default function Recommendations() {
  const [today, setToday] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [source, setSource] = useState("unknown");
  const [loading, setLoading] = useState(true);

  const load = (regen = false) => {
    setLoading(true);
    getRecommendations(regen)
      .then(res => {
        setSource(res.data.source);
        setToday(res.data.today || []);
        setWeekly(res.data.weekly || []);
      })
      .catch(() => {
        setToday([]);
        setWeekly([]);
        setSource("error");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(false);
  }, []);

  return (
    <div className="recommendations-page">
      <div className="recommendations-header">
        <h2>Personalized Recommendations</h2>
        <button className="regen-btn" onClick={() => load(true)}>
          Regenerate (AI)
        </button>
      </div>

      {loading && <p className="status-text">Loading AI insights...</p>}

      {!loading && (
        <>
          <p className="source-text">
            Source: <strong>{source}</strong>
          </p>

          <h3>📅 Today’s Recommendations</h3>
          {today.length === 0 && <p>No tips for today.</p>}
          <div className="recommendations-grid">
            {today.map((t, i) => (
              <div className="recommendation-card" key={i}>
                <h4>{t.title}</h4>
                <p>{t.detail}</p>
                <span>{t.yearlySaveKg} kg CO₂ / year</span>
              </div>
            ))}
          </div>

          <h3 style={{ marginTop: 30 }}>📊 Weekly Insights</h3>
          {weekly.length === 0 && <p>No weekly insights yet.</p>}
          <div className="recommendations-grid">
            {weekly.map((t, i) => (
              <div className="recommendation-card" key={i}>
                <h4>{t.title}</h4>
                <p>{t.detail}</p>
                <span>{t.yearlySaveKg} kg CO₂ / year</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
