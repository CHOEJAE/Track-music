// 페이지 구성
// / 		    루트 페이지
// /login 	login 페이지
// /signup 	회원가입 페이지
// /home	  track 페이지
// /result	결과 페이지
// /profile	프로필(히스토리) 페이지

import { Routes, Route } from "react-router-dom";
import Header from "./components/Header.jsx";
import TrackPage from "./pages/TrackPage.jsx";
import RootPage from "./pages/RootPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";

export default function App() {
  return (
    <div className="app-root">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<RootPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/home" element={<TrackPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </main>
    </div>
  );
}
