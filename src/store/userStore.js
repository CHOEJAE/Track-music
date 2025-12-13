import { create } from "zustand";
import axios from "axios";

// 토큰 키
const TOKEN_KEY = "accessToken";

// API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:65041";
const PROFILE_URL = `${API_BASE_URL}/api/auth/me`; // 서버에 로그인 유지 확인 요청

// 유저 스토어
export const userStore = create((set, get) => ({
  // 상태 정의
  isLoggedIn: !!localStorage.getItem(TOKEN_KEY),
  userId: null,
  accessToken: localStorage.getItem(TOKEN_KEY) || null,
  nickname: null,
  email: null, // 이메일 상태 추가

  // 액션 정의

  // 로그인 성공 시 상태 갱신 및 토큰 저장
  login: (authData) => {
    set({
      isLoggedIn: true,
      userId: authData.userId,
      accessToken: authData.token,
      nickname: authData.nickname,
      email: authData.email,
    });
    localStorage.setItem(TOKEN_KEY, authData.token);
  },

  // 로그아웃 시 상태 초기화 및 토큰 삭제
  logout: () => {
    set({
      isLoggedIn: false,
      userId: null,
      accessToken: null,
      nickname: null,
      email: null,
    });
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * 로그인 상태 확인 함수 (새로고침/재접속 시 호출)
   * localStorage의 토큰을 사용하여 서버에 사용자 정보를 다시 요청합니다.
   */
  initializeAuth: async () => {
    const token = get().accessToken;
    if (!token) {
      // 토큰이 없으면 초기화할 필요 없음
      get().logout(); // 상태 정리
      return;
    }

    try {
      // 1. 서버에 토큰을 보내서 유효성을 검증하고 사용자 정보 재요청
      const response = await axios.get(PROFILE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 2. 토큰이 유효하면 사용자 정보를 받아와 상태 업데이트
      // 서버에서 { userId, nickname, email } 을 반환
      const userData = response.data;
      set({
        isLoggedIn: true,
        userId: userData.userId,
        accessToken: token, // 토큰은 이미 저장되어 있음
        nickname: userData.nickname,
        email: userData.email,
      });
      console.log("로그인 유지 성공:", userData.nickname);
    } catch (error) {
      // 3. 토큰이 만료되었거나 유효하지 않으면 (401 Unauthorized 등) 로그아웃 처리
      console.error("토큰 재확인 실패:", error);
      get().logout();
    }
  },

  // API 요청 시 사용할 userId 반환 (비로그인 시 null 반환)
  getUserIdForApi: () => {
    const { isLoggedIn, userId } = get();
    // 비로그인 시 히스토리 저장을 막기 위해 null 반환
    return isLoggedIn ? userId : null;
  },
}));
