import React, { useEffect, useState } from "react";
import api from "../services/api";
import "../css/Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    dailyGoal: ""
  });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState(null);

  /* ==========================
     LOAD PROFILE
  ========================== */
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get("/users/profile");
        setProfile(res.data);
        setForm({
          name: res.data.user.name || "",
          dailyGoal: res.data.user.dailyCarbonGoal ?? ""
        });
      } catch (err) {
        console.error("Profile load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  /* ==========================
     HANDLERS
  ========================== */
  const handleChange = (e) => {
    setStatus(null);
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      await api.put("/users/profile", {
        name: form.name.trim(),
        dailyCarbonGoal:
          form.dailyGoal === "" ? undefined : Number(form.dailyGoal)
      });

      const res = await api.get("/users/profile");
      setProfile(res.data);

      setEditing(false);
      setStatus("success");
    } catch (err) {
      console.error("Profile update error:", err);
      setStatus("error");
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setStatus(null);
    setForm({
      name: profile.user.name || "",
      dailyGoal: profile.user.dailyCarbonGoal ?? ""
    });
  };

  /* ==========================
     UI STATES
  ========================== */
  if (loading) return <p className="center">Loading profile...</p>;
  if (!profile) return <p className="center">Failed to load profile</p>;

  const { user, stats } = profile;

  return (
    <div className="profile-page">
      <h2 className="profile-title">My Profile</h2>

      {/* ================= USER INFO ================= */}
      <div className="profile-card">
        <h3 className="card-title">👤 User Info</h3>

        {!editing ? (
          <>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
              <strong>Daily Carbon Goal:</strong>{" "}
              {user.dailyCarbonGoal ? `${user.dailyCarbonGoal} kg` : "—"}
            </p>

            <button className="edit-btn" onClick={() => setEditing(true)}>
              ✏️ Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="input-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Daily Carbon Goal (kg)</label>
              <input
                type="number"
                min="0"
                step="0.1"
                name="dailyGoal"
                value={form.dailyGoal}
                onChange={handleChange}
              />
            </div>

            <div className="profile-actions">
              <button className="save-btn" onClick={saveProfile}>
                Save Changes
              </button>
              <button className="cancel-btn" onClick={cancelEdit}>
                Cancel
              </button>
            </div>
          </>
        )}

        {status === "success" && (
          <p className="success-msg">✅ Profile updated successfully</p>
        )}
        {status === "error" && (
          <p className="error-msg">❌ Failed to update profile</p>
        )}
      </div>

      {/* ================= STATS ================= */}
      <div className="profile-card">
        <h3 className="card-title">📊 Carbon Stats</h3>
        <p>Days Tracked: {stats.daysTracked}</p>
        <p>Avg Daily CO₂: {stats.avgCarbon} kg</p>
        <p>Best Day: {stats.bestDay ?? "—"} kg</p>
        <p>Worst Day: {stats.worstDay ?? "—"} kg</p>
      </div>
    </div>
  );
}
