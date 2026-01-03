import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DailyActivity from "./pages/DailyActivity";
import Dashboard from "./pages/Dashboard";
import Recommendations from "./pages/Recommendations";
import Profile from "./pages/Profile";

import api from "./services/api";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  /* 🔐 Restore session from token */
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/users/me")
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "20vh" }}>
        <h3>🌱 Loading Carbon Vision...</h3>
      </div>
    );
  }

  const hideFooter =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* NAVBAR */}
      <Navbar user={user} setUser={setUser} />

      {/* ROUTES */}
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={user ? <Home /> : <Navigate to="/login" replace />}
        />

        {/* AUTH */}
        <Route
          path="/login"
          element={!user ? <Login setUser={setUser} /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!user ? <Register /> : <Navigate to="/" replace />}
        />

        {/* PROTECTED */}
        <Route
          path="/activity"
          element={user ? <DailyActivity /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/dashboard"
          element={user ? <Dashboard /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/recommendations"
          element={user ? <Recommendations /> : <Navigate to="/login" replace />}
        />

        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" replace />}
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* FOOTER */}
      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
