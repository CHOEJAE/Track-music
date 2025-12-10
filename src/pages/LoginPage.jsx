import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { userStore } from "../store/userStore";

// 백엔드 api
const LOGIN_URL = import.meta.env.VITE_API_URL + "/users/login";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Zustand Store에서 login 액션 가져오기
  const login = userStore((state) => state.login);

  /**로그인 핸들러 함수, 후에 백엔드 패치 결합 */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Axios POST 요청: 이메일과 패스워드 전송
      const response = await axios.post(
        LOGIN_URL,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 응답 데이터에서 사용자 정보 및 토큰 추출
      // 백엔드 응답 형식:
      // { userId: 101, token: "jwt_token_string", nickname: "user_nickname" }
      const authData = response.data;

      // Zustand 스토어에 로그인 정보 저장 및 토큰 저장 (localStorage 포함)
      login({
        userId: authData.userId,
        token: authData.token,
        nickname: authData.nickname,
      });

      // 홈 페이지로 이동
      console.log("로그인 성공. 유저:", authData.nickname);
      navigate("/home");
    } catch (err) {
      // 오류 처리 (401 Unauthorized 등)
      console.error("Login Error:", err);

      let errorMessage = "로그인에 실패했습니다. 정보를 확인해 주세요.";

      if (err.response) {
        // 서버에서 받은 응답 오류 (예: 401 Unauthorized)
        errorMessage =
          err.response.data.message ||
          "이메일 또는 비밀번호가 일치하지 않습니다.";
      } else if (err.request) {
        // 요청은 보내졌으나 응답을 받지 못함 (네트워크 문제)
        errorMessage = "서버 연결에 실패했습니다.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 전체 컨테이너
    <div className="relative flex items-center justify-center h-screen text-white overflow-hidden p-4">
      {/* 왼쪽 하단의 큰 그라데이션 원*/}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] 
                   bg-linear-to-br from-red-800/60 to-red-600/30 rounded-full 
                   filter blur-3xl opacity-60 transition-all duration-1000"
        style={{ transform: "translate(-50%, -10%)" }}
      ></div>

      {/* 오른쪽 하단 그라데이션 원 */}
      <div
        className="absolute bottom-0 right-0 w-80 h-80 
                   bg-linear-to-tl from-red-600/50 to-red-900/40 rounded-full 
                   filter blur-3xl opacity-50 transition-all duration-1000"
        style={{ transform: "translate(20%, 20%)" }}
      ></div>

      {/* 왼쪽 상단 작은 원*/}
      <div
        className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full 
                   bg-red-500 filter blur-sm opacity-50"
      ></div>

      {/* 로그인 폼 */}
      <div className="relative z-10 w-full max-w-md p-10 **bg-[#1a0000]/80** backdrop-blur-sm rounded-xl shadow-2xl border-3 border-[#4a0707] animate-form">
        <h2
          className="text-5xl font-bold text-center mb-10 p-5 pl-0 bg-linear-to-l from-red-500 to-red-900
      bg-clip-text text-transparent"
        >
          Login
        </h2>

        {/* 에러 메시지 출력 */}
        {error && (
          <div className="bg-red-900/50 text-red-300 p-3 rounded-md mb-4 text-sm text-center border border-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* 이메일 박스 */}
          <div className="mb-5">
            <input
              type="email"
              id="email"
              placeholder="e-mail"
              className="w-full bg-transparent border-b border-gray-600 text-white py-3 text-xl
            focus:border-red-500 focus:outline-none transition duration-300 placeholder-gray-500"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* 패스워드 박스 */}
          <div className="mb-10">
            <input
              type="password"
              id="password"
              placeholder="password"
              className="w-full bg-transparent border-b border-gray-600 text-white py-3 text-xl
            focus:border-red-500 focus:outline-none transition duration-300 placeholder-gray-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-red-600 to-red-800 text-white 
           rounded-md font-bold text-lg tracking-wider 
           hover:from-red-700 hover:to-red-900 transition duration-300 
           focus:outline-none focus:ring-1 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "로그인 중..." : "LOGIN"}
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div className="text-center mt-6">
          <Link
            to="/signup"
            className="text-sm text-gray-400 hover:text-red-400 transition duration-200"
          >
            계정이 없으신가요? 회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
