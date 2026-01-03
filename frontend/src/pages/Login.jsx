import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import picLogin from "../assets/piclogin.png";
import "../css/Login.css";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // LOGIN user
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        formData
      );

      const token = res.data.token;
      localStorage.setItem("token", token);

      // FETCH LOGGED-IN USER
      const profile = await axios.get(
        "http://localhost:5000/api/users/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // server returns { id: "..." }
      setUser(profile.data);

      setMessage("Login Successful! Redirecting...");
      setTimeout(() => navigate("/"), 800);

    } catch (err) {
      console.error("Login error:", err);
      setMessage(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <h1 className="login-title">Carbon Vision</h1>
        <p className="login-subtitle">See your impact. Shape your future 🌍</p>
        <img src={picLogin} alt="Eco AI Illustration" className="login-image" />
      </div>

      <div className="login-right">
        <div className="login-box">
          <h2 className="login-heading">Welcome Back 🌿</h2>

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>

            <button type="submit" className="login-btn">Sign In</button>

            {message && <p className="login-message">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
