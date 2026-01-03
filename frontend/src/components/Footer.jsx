import React from "react";
import "../css/Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* LEFT */}
        <div className="footer-brand">
          <h3>🌱 Carbon Vision</h3>
          <p>
            Track. Reduce. Transform.  
            <br />
            Small actions today create a sustainable tomorrow.
          </p>
        </div>

        {/* CENTER */}
        <div className="footer-links">
          <h4>Explore</h4>
          <a href="/dashboard">Dashboard</a>
          <a href="/activity">Daily Activity</a>
          <a href="/recommendations">AI Tips</a>
          <a href="/profile">Profile</a>
        </div>

        {/* RIGHT */}
        <div className="footer-stats">
          <h4>Did you know?</h4>
          <p>
            Reducing car travel by just <strong>2 km/day</strong> can save  
            <strong> 150+ kg CO₂</strong> per year 🚲
          </p>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Carbon Vision · Built for a greener future 🌍
      </div>
    </footer>
  );
}
