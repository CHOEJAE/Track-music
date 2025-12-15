import axios from "axios";

const TOKEN_KEY = "accessToken";

const rawBase =
  (import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")) ||
  "http://localhost:65041";

const baseURL = `${rawBase}/api`;

console.log("[API] baseURL =", baseURL);

const client = axios.create({
  baseURL,
  withCredentials: false,
});


client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default client;
