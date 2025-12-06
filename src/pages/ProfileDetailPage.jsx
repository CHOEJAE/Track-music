import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

export default function ProfileDetailPage() {
  const navigate = useNavigate();

  const user = {
    name: "User",
    email: "user@example.com",
  };

  const handleEditProfile = () => {
    //서버 연동후 작성
  };

  const handleLogout = () => {
    //서버 연동후 작성
  };

  const handleDeleteAccount = () => {
    //서버 연동후 작성
  };

  return (
    <div className="profile-page">
      <div className="profile-detail-card">
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1 className="profile-detail-title">프로필</h1>

        <div className="profile-detail-avatar" />

        <div className="profile-field">
          <span className="profile-field-label">닉네임</span>
          <div className="profile-field-value">{user.name}</div>
        </div>

        <div className="profile-field">
          <span className="profile-field-label">이메일</span>
          <div className="profile-field-sub">{user.email}</div>
        </div>

        <button
          type="button"
          className="profile-edit-button"
          onClick={handleEditProfile}
        >
          프로필 수정
        </button>

        <button
          type="button"
          className="profile-logout-button"
          onClick={handleLogout}
        >
          로그아웃
        </button>

        <button
          type="button"
          className="profile-delete-button"
          onClick={handleDeleteAccount}
        >
          계정 삭제
        </button>
      </div>
    </div>
  );
}
