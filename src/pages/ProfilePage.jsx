import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

export default function ProfilePage() {
  const navigate = useNavigate();

  const user = {
    nickname: "게스트",
    username: "guest@webbrain.ai",
  };

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Back 버튼 */}
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate(-1)}  
        >
          ← {/* 추후 아이콘으로 변경 예정 */}
        </button>

        {/*추후 background-image 로 교체예정 */}
        <div className="profile-avatar">
          {/* 아이콘 자리 */}
        </div>

        <div className="profile-name">{user.nickname}</div>
        <div className="profile-username">{user.username}</div>

        <ul className="profile-menu">
          {/* Profile 메뉴 부분 */}
          <li
            className="profile-menu-item"
            onClick={() => navigate("/profile/detail")}
          >
            <div className="profile-menu-left">
              <div className="profile-menu-icon" />
              <span>프로필</span>
            </div>
            <span className="profile-menu-chevron">›</span>
          </li>

          <li className="profile-menu-item">
            <div className="profile-menu-left">
              <div className="profile-menu-icon" />
              <span>History</span>
            </div>
            <span className="profile-menu-chevron">›</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
