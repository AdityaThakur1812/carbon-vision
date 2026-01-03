import api from "./api";

/* ---- SAVE / UPDATE TODAY'S ACTIVITY ---- */
export const saveDailyActivity = (data) => {
  return api.post("/activity/log", data);
};

/* ---- GET TODAY'S ACTIVITY ---- */
export const getTodayActivity = () => {
  return api.get("/activity/today");
};

/* ---- GET FULL HISTORY ---- */
export const getActivityHistory = () => {
  return api.get("/activity/history");
};
