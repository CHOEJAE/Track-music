import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = {
    name: "User",
    email: "user@example.com",
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        {/* 아바타 */}
        <div className="profile-avatar" />

        {/* 이름 / 이메일 */}
        <div className="profile-name">{user.name}</div>
        <div className="profile-username">{user.email}</div>

        {/* 메뉴 리스트 */}
        <ul className="profile-menu">
          <li
            className="profile-menu-item"
            onClick={() => navigate("/profile/detail")}
          >
            <div className="profile-menu-left">
              <div className="profile-menu-icon" />
              <span>프로필 상세 보기</span>
            </div>
            <span className="profile-menu-chevron">›</span>
          </li>

          <li
            className="profile-menu-item"
            onClick={() => navigate("/profile/history")}
          >
            <div className="profile-menu-left">
              <div className="profile-menu-icon" />
              <span>이용 기록 보기</span>
            </div>
            <span className="profile-menu-chevron">›</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
