// frontend/src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

import { getSummary, getTrends, getCompare } from "../services/dashboardService";
import ChartCard from "../components/ChartCard";
import "../css/Dashboard.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [rawTrends, setRawTrends] = useState([]);
  const [compare, setCompare] = useState(null);
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [useWeekly, setUseWeekly] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [sumRes, trendRes, compRes] = await Promise.all([
          getSummary(7),
          getTrends(60),
          getCompare(),
        ]);

        setSummary(sumRes.data);
        setInsight(sumRes.data?.insight || null); // ✅ FIX
        setRawTrends(trendRes.data || []);
        setCompare(compRes.data);
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  /* ---------------- Weekly Toggle ---------------- */
  const aggregatedTrends = useWeekly
    ? (() => {
        const map = {};
        rawTrends.forEach((t) => {
          const week = new Date(t.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          map[week] = (map[week] || 0) + t.carbon;
        });
        return Object.entries(map).map(([date, carbon]) => ({ date, carbon }));
      })()
    : rawTrends;

  /* ---------------- Charts ---------------- */
  const lineData = {
    labels: aggregatedTrends.map((t) => t.date),
    datasets: [
      {
        label: useWeekly ? "CO₂ per week (kg)" : "CO₂ per day (kg)",
        data: aggregatedTrends.map((t) => t.carbon),
        borderColor: "#10b981",
        backgroundColor: "#34d399",
        tension: 0.25,
        pointRadius: 3,
      },
    ],
  };

  const pieBreak = summary?.breakdown || {};
  const pieData = {
    labels: Object.keys(pieBreak),
    datasets: [
      {
        data: Object.values(pieBreak),
        backgroundColor: ["#34d399", "#60a5fa", "#f87171", "#fbbf24"],
      },
    ],
  };

  /* ---------------- CSV Export ---------------- */
  function exportCSV() {
    const rows = ["date,carbon"];
    rawTrends.forEach((r) => rows.push(`${r.date},${r.carbon}`));

    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "carbon-history.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="dashboard-page">
      <h2 className="dashboard-title">Dashboard</h2>

      {loading && <p>Loading...</p>}

      {!loading && (
        <>
          {/* ✅ AI INSIGHT */}
          {insight && (
            <div className="insight-card">
              <h3>🧠 AI Insight</h3>
              <h4>{insight.title}</h4>
              <p>{insight.message}</p>
              {insight.impact && (
                <p className="impact">Impact: {insight.impact}</p>
              )}
            </div>
          )}

          {/* SUMMARY */}
          <section className="summary-cards">
            <div className="summary-card">
              <h3>Total ({summary?.days || 7} days)</h3>
              <p className="big-value">
                {(summary?.totalCarbon || 0).toFixed(2)} kg
              </p>
              <p>Avg/day: {(summary?.averageDaily || 0).toFixed(2)} kg</p>
            </div>

            <div className="summary-card">
              <h3>Compare</h3>
              <p>User/year: {(compare?.userYearly || 0).toFixed(0)} kg</p>
              <p>City avg: {(compare?.cityAvg || 0).toFixed(0)} kg</p>
            </div>

            <div className="summary-card">
              <h3>Actions</h3>
              <button className="csv-btn" onClick={exportCSV}>
                📄 Export CSV
              </button>
              <button
                className="toggle-btn"
                onClick={() => setUseWeekly(!useWeekly)}
              >
                {useWeekly ? "Switch to Daily" : "Switch to Weekly"}
              </button>
            </div>
          </section>

          {/* CHARTS */}
          <section className="charts-row">
            <ChartCard title={useWeekly ? "Weekly Trend" : "Daily Trend"}>
              <Line data={lineData} />
            </ChartCard>

            <ChartCard title="Emission Breakdown">
              <Pie data={pieData} />
            </ChartCard>
          </section>

          {/* HISTORY */}
          <section className="history-list">
            <h3>Recent Logs</h3>
            <ul>
              {rawTrends.slice(-7).reverse().map((t) => (
                <li key={t.date}>
                  <strong>{t.date}</strong> — {t.carbon.toFixed(2)} kg
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
