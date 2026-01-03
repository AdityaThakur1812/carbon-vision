// frontend/src/services/dashboardService.js
import api from "./api";

// summary, trends, compare, forecast already exist in backend
export const getSummary = (days = 7) =>
  api.get(`/dashboard/summary?days=${days}`);

export const getTrends = (days = 30) =>
  api.get(`/dashboard/trends?days=${days}`);

export const getCompare = () =>
  api.get(`/dashboard/compare`);

export const getForecast = (days = 30, future = 30) =>
  api.get(`/dashboard/forecast?days=${days}&future=${future}`);
