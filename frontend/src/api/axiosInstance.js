import axios from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

console.log("API Base URL:", baseURL);

const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export default axiosInstance;
