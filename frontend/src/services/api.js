// frontend/src/services/api.js
import axios from "axios";

const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000, // ⬆ slightly higher for Ollama responses
  headers: {
    "Content-Type": "application/json",
  },
});

/* ===============================
   REQUEST INTERCEPTOR (JWT)
================================ */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ===============================
   RESPONSE INTERCEPTOR (ERRORS)
================================ */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    // 🔐 Handle auth expiry / invalid token
    if (status === 401) {
      console.warn("Unauthorized – logging out");
      localStorage.removeItem("token");

      // Avoid redirect loop
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Optional logging (useful during dev)
    if (import.meta.env.DEV) {
      console.error("API Error:", {
        url: error?.config?.url,
        status,
        message: error?.response?.data?.message || error.message,
      });
    }

    return Promise.reject(error);
  }
);

export default api;
