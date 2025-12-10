import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// 백엔드 api
const SIGNUP_URL = import.meta.env.VITE_API_URL + "/users/register";

export default function SignUpPage() {
  const navigate = useNavigate();

  // 폼 데이터
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * 회원가입 핸들러 함수: Axios를 사용하여 입력 데이터를 백엔드에 POST 전송
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // console.log(email, password, nickname);

    try {
      // 1. Axios POST 요청 보내기
      const response = await axios.post(
        SIGNUP_URL,
        {
          email,
          password,
          nickname,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // 2. 응답 상태 확인

      // 3. 회원가입 성공 처리
      console.log("회원가입 성공:", response.data);
      navigate("/login"); // 로그인 페이지로 이동
    } catch (err) {
      // 4. 오류 처리
      console.error("Signup Error:", err);

      let errorMessage = "회원가입에 실패했습니다. 정보를 확인해 주세요.";

      if (err.response) {
        // 서버에서 받은 응답 오류
        errorMessage = err.response.data.message || errorMessage;
      } else if (err.request) {
        // 요청은 보내졌으나 응답을 받지 못함
        errorMessage =
          "서버로부터 응답을 받지 못했습니다. 네트워크 연결을 확인해주세요.";
      } else {
        // 기타 오류
        errorMessage = "요청 처리 중 오류가 발생했습니다.";
      }

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    // 전체 컨테이너
    <div className="relative flex items-center justify-center h-screen text-white overflow-hidden p-4">
      {/* ... (그라데이션 배경 및 원들) ... */}
      <div
        className="absolute top-0 left-0 w-[500px] h-[500px] 
         bg-linear-to-br from-red-800/60 to-red-600/30 rounded-full 
         filter blur-3xl opacity-60 transition-all duration-1000"
        style={{ transform: "translate(-50%, -10%)" }}
      ></div>

      <div
        className="absolute bottom-0 right-0 w-80 h-80 
         bg-linear-to-tl from-red-600/50 to-red-900/40 rounded-full 
         filter blur-3xl opacity-50 transition-all duration-1000"
        style={{ transform: "translate(20%, 20%)" }}
      ></div>

      <div
        className="absolute top-1/4 left-1/4 w-12 h-12 rounded-full 
         bg-red-500 filter blur-sm opacity-50"
      ></div>

      {/* 회원가입 폼 */}
      <div className="relative z-10 w-full max-w-md p-10 **bg-[#1a0000]/80** backdrop-blur-sm rounded-xl shadow-2xl border-3 border-[#4a0707] animate-form">
        <h2
          className="text-5xl font-bold text-left mb-10 p-5 pl-0 
          bg-linear-to-l from-red-500 to-red-900 
          bg-clip-text text-transparent"
        >
          Create <br />
          Account
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
              id="signup-email"
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
              id="signup-password"
              placeholder="password"
              className="w-full bg-transparent border-b border-gray-600 text-white py-3 text-xl
            focus:border-red-500 focus:outline-none transition duration-300 placeholder-gray-500"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* 닉네임 박스 */}
          <div className="mb-10">
            <input
              type="text"
              id="signup-nickname"
              placeholder="nickname"
              className="w-full bg-transparent border-b border-gray-600 text-white py-3 text-xl
            focus:border-red-500 focus:outline-none transition duration-300 placeholder-gray-500"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-red-600 to-red-800 text-white 
           rounded-md font-bold text-lg tracking-wider 
           hover:from-red-700 hover:to-red-900 transition duration-300 
           focus:outline-none focus:ring-1 disabled:bg-gray-500 disabled:cursor-not-allowed"
          >
            {loading ? "처리 중..." : "SIGN UP"}
          </button>
        </form>

        {/* 로그인 링크 */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-sm text-gray-400 hover:text-red-400 transition duration-200"
          >
            이미 계정이 있으신가요? 로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
