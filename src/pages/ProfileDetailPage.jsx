import { useNavigate } from "react-router-dom";
import "../styles/profile.css"

export default function ProfileDetailPage() {
  const navigate = useNavigate();

  const user = {
    nickname: "게스트",
    username: "guest@webbrain.ai",
  };

  return (
    <div className="profile-page">
      <div className="profile-detail-card">
        {/* Back 버튼 */}
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          ← {/*화살표 아이콘으로 변경예정*/}
        </button>

        <h1 className="profile-detail-title">프로필</h1>

        <div className="profile-detail-avatar">
          {/* 프로필 이미지 자리 */}
        </div>

        <div className="profile-field">
          <span className="profile-field-label">닉네임</span>
          <div className="profile-field-value">{user.nickname}</div>
        </div>

        <div className="profile-field">
          <span className="profile-field-label">이메일</span>
          <div className="profile-field-sub">{user.username}</div>
        </div>

        <button type="button" className="profile-logout-button">
          로그아웃
        </button>
        <button type="button" className="profile-delete-button">
          계정 삭제
        </button>
      </div>
    </div>
  );
}
