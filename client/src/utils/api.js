import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("chat-app-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const SOCKET_URL = API_URL;
export default api;
