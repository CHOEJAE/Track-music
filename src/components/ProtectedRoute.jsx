import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { userStore } from "../store/userStore";

// 로그인 되어있지 않은데 직접 detail, history에 접근시 로그인 페이지로 리다이렉트 시키는 컴포넌트

const DelayScreen = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-red-950 via-black to-red-900 text-white p-6">
    <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl shadow-2xl text-center w-full max-w-sm">
      <div className="flex justify-center mb-6">
        <div className="w-10 h-10 border-4 border-red-700 border-t-transparent rounded-full animate-spin" />
      </div>

      <h1 className="text-xl font-bold mb-2 text-red-400">
        로그인되어있지 않습니다
      </h1>
      <p className="text-sm text-gray-300">
        잠시 후 로그인 페이지로 이동합니다
      </p>
    </div>
  </div>
);

export default function ProtectedRoute({ children }) {
  // 로그인 상태 확인
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  // 로딩 시간 설정
  const REDIRECT_DELAY = 1200;

  useEffect(() => {
    // 로그인시 그냥 리턴
    if (isLoggedIn) return;

    const timer = setTimeout(() => {
      setShouldRedirect(true);
    }, REDIRECT_DELAY);

    return () => clearTimeout(timer);
  }, [isLoggedIn]);

  // 로그인 되면 항상 children 렌더
  if (isLoggedIn) {
    return children;
  }

  if (shouldRedirect) {
    return <Navigate to="/login" replace />;
  }

  return <DelayScreen />;
}
