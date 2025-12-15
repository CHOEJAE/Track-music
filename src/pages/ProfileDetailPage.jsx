import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userStore } from "../store/userStore";
import axios from "axios";
import "../styles/profile.css";

const LOGOUT_URL = import.meta.env.VITE_API_BASE_URL + "/api/users/logout";
const DELETE_URL = import.meta.env.VITE_API_BASE_URL + "/api/users/delete";

export default function ProfileDetailPage() {
  const navigate = useNavigate();

  // 스토어에서 유저 정보, 처리 액션 가져오기
  const nicknameFromStore = userStore((state) => state.nickname);
  const emailFromStore = userStore((state) => state.email);
  const token = userStore((state) => state.accessToken);
  const logout = userStore((state) => state.logout);

  // 스토어에 값이 비어있을 경우 기본값 설정
  const nickname = nicknameFromStore || "User";
  const email = emailFromStore || "user@example.com";

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", message: "" }); // API 상태 메시지

  //서버 연동후 작성 (필요없는 기능 같아서 일단 보류)
  // const handleEditProfile = () => {
  //
  // };

  // 로그아웃 핸들링 함수
  const handleLogout = async () => {
    setStatusMessage({ type: "", message: "" });

    try {
      if (token) {
        // 1. 서버에 토큰 무효화 요청
        await axios.post(LOGOUT_URL, null, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      // 2. 클라이언트 상태 정리 및 로컬 스토리지 삭제
      logout();

      // 3. 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 처리 실패 (서버 통신 오류):", error);
      // 서버 통신 오류가 발생해도 클라이언트 측에서는 로그아웃 처리
      logout();
      navigate("/login");
    }
  };

  // 계정삭제 확인 함수 (삭제 버튼 클릭시 컨펌 UI 출력)
  const handleConfirmDelete = () => {
    setShowDeleteConfirm(true);
    setStatusMessage({
      type: "warning",
      message:
        "계정을 삭제하면 모든 데이터가 영구히 사라집니다. 정말 삭제하시겠습니까?",
    });
  };

  // 계정삭제 핸들링 함수
  const handleDeleteAccount = async () => {
    setStatusMessage({ type: "", message: "" });
    setShowDeleteConfirm(false); // 확인 UI 숨기기

    if (!token) {
      setStatusMessage({
        type: "error",
        message: "인증 정보가 없습니다. 다시 로그인해 주세요.",
      });
      logout();
      navigate("/login");
      return;
    }

    try {
      // 1. 서버에 계정 삭제 요청 (토큰 기반)
      await axios.delete(DELETE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatusMessage({
        type: "success",
        message: "계정 삭제가 완료되었습니다. 감사합니다.",
      });

      // 2. 상태 정리 및 이동
      logout();
      // 3. 계정 삭제 후 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      console.error("계정 삭제 실패:", error);
      setStatusMessage({
        type: "error",
        message: "계정 삭제에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      });
    }
  };

  // Tailwind 기반 스타일링 사전 정의
  const statusClasses = {
    error: "bg-red-900/30 text-red-400 border-red-500",
    warning: "bg-yellow-900/30 text-yellow-400 border-yellow-500",
    success: "bg-green-900/30 text-green-400 border-green-500",
  };

  return (
    <div className="profile-page min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="profile-detail-card w-full max-w-sm mx-auto bg-zinc-800 p-8 rounded-xl shadow-2xl border border-red-700/50 relative">
        <button
          type="button"
          className="profile-back-button"
          onClick={() => navigate(-1)}
        >
          ←
        </button>

        <h1 className="profile-detail-title">프로필</h1>

        <div className="profile-detail-avatar" />

        <div className="mb-4 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
          <span className="text-sm font-semibold text-gray-400 block">
            닉네임
          </span>
          <div className="profile-field-value text-lg font-bold text-white mt-1">
            {nickname}
          </div>
        </div>

        <div className="mb-4 p-3 bg-zinc-900 rounded-lg border border-zinc-700">
          <span className="text-sm font-semibold text-gray-400 block">
            이메일
          </span>
          <div className="profile-field-sub text-md mt-1">{email}</div>
        </div>

        {/* API 상태 메시지 출력 영역 */}
        {statusMessage.message && (
          <div
            className={`border-l-4 p-3 mt-4 text-sm font-medium ${
              statusClasses[statusMessage.type] || "bg-gray-800 text-white"
            }`}
          >
            {statusMessage.message}
          </div>
        )}

        {/* 로그아웃 버튼 (계정 삭제 확인 중일 때는 숨김 처리) */}
        {!showDeleteConfirm && (
          <button
            type="button"
            className="profile-logout-button"
            onClick={handleLogout}
          >
            로그아웃
          </button>
        )}

        {/* 계정 삭제 버튼 및 확인 UI */}
        {!showDeleteConfirm ? (
          <button
            type="button"
            className="profile-delete-button w-full mt-4 py-3 bg-transparent border-2 border-red-800 hover:bg-red-900/50 text-red-400 font-bold rounded-lg transition duration-150"
            onClick={handleConfirmDelete}
          >
            계정 삭제
          </button>
        ) : (
          <div className="mt-4 p-4 border border-red-600 rounded-lg bg-zinc-900/70 shadow-inner flex flex-col gap-3">
            <p className="profile-delete-prompt text-red-300 font-bold text-center">
              정말로 삭제하시겠습니까?
            </p>
            <button
              type="button"
              className="w-full py-2 bg-red-800 hover:bg-red-900 text-white font-bold rounded-lg transition duration-150"
              onClick={handleDeleteAccount}
            >
              예, 영구 삭제합니다
            </button>
            <button
              type="button"
              className="w-full py-2 bg-[#363636] hover:bg-zinc-700 text-gray-200 rounded-lg transition duration-150"
              onClick={() => {
                setShowDeleteConfirm(false);
                setStatusMessage({ type: "", message: "" });
              }}
            >
              아니요, 취소합니다
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
