import React, { useState } from "react";
import { saveDailyActivity } from "../services/activityService";
import "../css/DailyActivity.css";

export default function DailyActivity() {
  const [form, setForm] = useState({
    bodyType: "",
    sex: "",
    diet: "",
    socialActivity: "",

    showerFreq: "",
    tvPcHours: "",
    internetHours: "",

    heatingSource: "",
    energyEfficiency: "",
    cookingWith: "",

    transport: "",
    vehicleType: "",
    vehicleDistance: "",
    airTravelFreq: "",

    groceryBill: "",
    clothesMonthly: "",

    wasteBagSize: "",
    wasteBagWeekly: "",
    recycling: []
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    const { value, checked } = e.target;
    setForm({
      ...form,
      recycling: checked
        ? [...form.recycling, value]
        : form.recycling.filter((r) => r !== value)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await saveDailyActivity(form);
    alert("✅ Daily activity logged successfully");
  };

  return (
    <div className="daily-bg">
      <form className="daily-glass" onSubmit={handleSubmit}>
        <h1 className="daily-title">🌍 Daily Carbon Activity</h1>
        <p className="daily-subtitle">
          Log your lifestyle data to generate AI-powered carbon insights
        </p>

        {/* PERSONAL */}
        <section className="daily-section">
          <h3>👤 Personal</h3>
          <div className="grid">
            <select name="bodyType" onChange={handleChange} required>
              <option value="">Body Type</option>
              <option>Slim</option>
              <option>Average</option>
              <option>Obese</option>
            </select>

            <select name="sex" onChange={handleChange} required>
              <option value="">Sex</option>
              <option>Male</option>
              <option>Female</option>
            </select>

            <select name="diet" onChange={handleChange}>
              <option value="">Diet</option>
              <option>Vegetarian</option>
              <option>Vegan</option>
              <option>Omnivore</option>
            </select>

            <select name="socialActivity" onChange={handleChange}>
              <option value="">Social Activity</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </section>

        {/* HABITS */}
        <section className="daily-section">
          <h3>🛁 Daily Habits</h3>
          <div className="grid">
            <select name="showerFreq" onChange={handleChange}>
              <option value="">Shower Frequency</option>
              <option>Once a day</option>
              <option>Twice a day</option>
              <option>Every other day</option>
            </select>

            <input
              type="number"
              name="tvPcHours"
              placeholder="TV / PC hours per day"
              onChange={handleChange}
            />

            <input
              type="number"
              name="internetHours"
              placeholder="Internet hours per day"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* ENERGY */}
        <section className="daily-section">
          <h3>⚡ Home Energy</h3>
          <div className="grid">
            <select name="heatingSource" onChange={handleChange}>
              <option value="">Heating Source</option>
              <option>Electric</option>
              <option>Gas</option>
              <option>Coal</option>
            </select>

            <select name="energyEfficiency" onChange={handleChange}>
              <option value="">Energy Efficiency</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <select name="cookingWith" onChange={handleChange}>
              <option value="">Cooking With</option>
              <option>Gas</option>
              <option>Electric</option>
              <option>Induction</option>
            </select>
          </div>
        </section>

        {/* TRANSPORT */}
        <section className="daily-section">
          <h3>🚗 Transport</h3>
          <div className="grid">
            <select name="transport" onChange={handleChange}>
              <option value="">Primary Transport</option>
              <option>Car</option>
              <option>Public</option>
              <option>Bike</option>
              <option>Walk</option>
            </select>

            <select name="vehicleType" onChange={handleChange}>
              <option value="">Vehicle Type</option>
              <option>Petrol</option>
              <option>Diesel</option>
              <option>Electric</option>
            </select>

            <input
              type="number"
              name="vehicleDistance"
              placeholder="Monthly distance (km)"
              onChange={handleChange}
            />

            <select name="airTravelFreq" onChange={handleChange}>
              <option value="">Air Travel</option>
              <option>Never</option>
              <option>Rare</option>
              <option>Frequent</option>
            </select>
          </div>
        </section>

        {/* CONSUMPTION */}
        <section className="daily-section">
          <h3>🛒 Consumption</h3>
          <div className="grid">
            <input
              type="number"
              name="groceryBill"
              placeholder="Monthly grocery bill"
              onChange={handleChange}
            />

            <input
              type="number"
              name="clothesMonthly"
              placeholder="Clothes bought per month"
              onChange={handleChange}
            />
          </div>
        </section>

        {/* WASTE */}
        <section className="daily-section">
          <h3>🗑️ Waste & Recycling</h3>
          <div className="grid">
            <select name="wasteBagSize" onChange={handleChange}>
              <option value="">Waste bag size</option>
              <option>Small</option>
              <option>Medium</option>
              <option>Large</option>
            </select>

            <input
              type="number"
              name="wasteBagWeekly"
              placeholder="Waste bags per week"
              onChange={handleChange}
            />
          </div>

          <div className="checkbox-row">
            {["Plastic", "Paper", "Glass"].map((item) => (
              <label key={item}>
                <input
                  type="checkbox"
                  value={item}
                  onChange={handleCheckbox}
                />
                {item}
              </label>
            ))}
          </div>
        </section>

        <button type="submit" className="save-btn">
          Save Activity
        </button>
      </form>
    </div>
  );
}
