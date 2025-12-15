// 페이지 구성
// / 		    루트 페이지
// /login 	login 페이지
// /signup 	회원가입 페이지
// /home	  track 페이지
// /result	결과 페이지
// /profile	프로필(히스토리) 페이지

import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import { userStore } from "./store/userStore.js";

import TrackPage from "./pages/TrackPage.jsx";
import RootPage from "./pages/RootPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import ProfileDetailPage from "./pages/ProfileDetailPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

export default function App() {
  // user store에서 initializeAuth 액션(로그인 유지 확인) 가져오기
  const initializeAuth = userStore((state) => state.initializeAuth);

  // 컴포넌트 마운트 시 (앱이 처음 로드될 때) 딱 한 번 실행
  useEffect(() => {
    console.log("로그인 유지 확인");
    initializeAuth();
  }, []);

  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<TrackPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* 서버 닫혀 있을 시(개발시, 그냥 url으로 상세페이지 접근 가능) */}
          {/* <Route path="/profile/detail" element={<ProfileDetailPage />} />
          <Route path="/profile/history" element={<HistoryPage />} /> */}

          {/** 서버 켜져 있을 시(로그인 정보 확인 후 로그인 안되어 있다면 상세 페이지 접근 불가) */}
          <Route
            path="/profile/detail"
            element={
              <ProtectedRoute>
                <ProfileDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
