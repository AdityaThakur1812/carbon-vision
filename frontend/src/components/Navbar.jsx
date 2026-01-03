import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">Carbon Vision 🌿</div>

      <ul className="nav-links">
        {!user && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}

        {user && (
          <>
            <li>
              <Link to="/">Home</Link>
            </li>

            <li>
              <Link to="/activity">Daily Activity</Link>
            </li>

            <li>
              <Link to="/dashboard">Dashboard</Link>
            </li>

            <li>
              <Link to="/recommendations">AI Tips</Link>
            </li>

            {/* ✅ ADD THIS */}
            <li>
              <Link to="/profile">Profile</Link>
            </li>

            <li>
              <button className="logout-btn" onClick={logout}>
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}
