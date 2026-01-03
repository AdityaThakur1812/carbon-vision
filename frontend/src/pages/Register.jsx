import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import picLogin from "../assets/piclogin.png";
import "../css/Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setMessage("Registration Successful! Redirecting...");
      setTimeout(() => navigate("/login"), 800);

    } catch (err) {
      console.error("Registration error:", err);
      setMessage(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-left">
        <h1 className="register-title">Carbon Vision</h1>
        <p className="register-subtitle">
          Join the movement 🌍 <br /> Measure. Reduce. Reward.
        </p>
        <img src={picLogin} alt="" className="register-image" />
      </div>

      <div className="register-right">
        <div className="register-box">
          <h2 className="register-heading">Create Account 🌱</h2>

          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button className="register-btn">Sign Up</button>

            {message && <p className="register-message">{message}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
