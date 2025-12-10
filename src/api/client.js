import axios from "axios";


const rawBase =
  (import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")) ||
  "http://localhost:65041";


const baseURL = `${rawBase}/api`;

// 연결 확인용 로그
console.log("[API] baseURL =", baseURL); 

const client = axios.create({
  baseURL,
  withCredentials: false,
});

export default client;