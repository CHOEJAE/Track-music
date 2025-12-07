import axios from "axios";

const baseURL =
  (import.meta.env.VITE_API_BASE_URL &&
    import.meta.env.VITE_API_BASE_URL.replace(/\/+$/, "")) ||
  "http://localhost:65041"; 
// 기본값은 로컬 환경으로 설정했습니다.

// 연결확인용도
console.log("[API] baseURL =", baseURL);

const client = axios.create({
  baseURL,
  withCredentials: false,
});

export default client;
