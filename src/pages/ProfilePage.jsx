import { useNavigate, Link } from "react-router-dom";
import { userStore } from "../store/userStore";
import Leftarrow from "../components/icons/Leftarrow";
import Rightarrow from "../components/icons/Rightarrow";
import Historyicon from "../components/icons/Historyicon";
import Searchicon from "../components/icons/Searchicon";
import "../styles/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  // // Zustand Store에서 필요한 상태 가져오기
  const isLoggedIn = userStore((state) => state.isLoggedIn);
  const nickname = userStore((state) => state.nickname);
  const email = userStore((state) => state.email);

  // 테스트용
  // const isLoggedIn = true;
  // const nickname = "kim";
  // const email = "aaa@aaa.com";

  // 상태 확인용 변수
  const displayName = isLoggedIn ? nickname || "User" : "Guest";
  const displayEmail = isLoggedIn ? email || "user@example.com" : "로그인 필요";

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="profile-page">
      <div className="profile-card animate-form">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          <Leftarrow />
        </button>

        {/* 아바타 */}
        <div className="profile-avatar bg-gray-300">
          <img src="/profile.png" alt="프로필 사진" className="w-[60%]" />
        </div>

        {/* 이름 / 이메일 */}
        <div className="profile-name">{displayName}</div>
        <div className="profile-username">{displayEmail}</div>

        {/* 로그인 상태에 따라 다른 콘텐츠 렌더링 */}
        {isLoggedIn ? (
          // --- 로그인 O: 메뉴 리스트 표시 ---
          <ul className="profile-menu">
            <Link to="/profile/detail" className="profile-menu-item">
              <div className="profile-menu-left">
                <div className="profile-menu-icon flex justify-center items-center">
                  <Searchicon />
                </div>
                <span>프로필 상세 보기</span>
              </div>
              <span className="profile-menu-chevron">
                <Rightarrow />
              </span>
            </Link>

            <Link to="/profile/history" className="profile-menu-item">
              <div className="profile-menu-left">
                <div className="profile-menu-icon flex justify-center items-center">
                  <Historyicon />
                </div>
                <span>이용 기록 보기</span>
              </div>
              <span className="profile-menu-chevron">
                <Rightarrow />
              </span>
            </Link>
          </ul>
        ) : (
          <div className="flex justify-center mt-8">
            <button
              type="button"
              className="w-[50%] py-3 bg-linear-to-r from-red-600 to-red-800 text-white 
           rounded-xl font-bold text-lg tracking-wider 
           hover:from-red-700 hover:to-red-900 transition duration-300 
           focus:outline-none focus:ring-1 disabled:bg-gray-500 disabled:cursor-not-allowed"
              onClick={handleLoginRedirect}
            >
              로그인 하러 가기
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
