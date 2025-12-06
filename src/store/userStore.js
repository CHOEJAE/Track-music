import { create } from "zustand";

// 토큰 키
const TOKEN_KEY = "accessToken";

// 사용자 인증 및 상태 관리 스토어 (로그인 상태, userId, 토큰, 닉네임)
export const userStore = create((set, get) => ({
  // 1. 상태 정의
  isLoggedIn: !!localStorage.getItem(TOKEN_KEY), // 토큰 유무로 초기 로그인 상태 결정
  userId: null,
  accessToken: localStorage.getItem(TOKEN_KEY) || null, // 토큰 로드
  nickname: null,

  // 2. 액션 정의

  // 로그인 성공 시 상태 갱신 및 토큰 저장
  login: (authData) => {
    set({
      isLoggedIn: true,
      userId: authData.userId,
      accessToken: authData.token,
      nickname: authData.nickname,
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
    });
    localStorage.removeItem(TOKEN_KEY);
  },

  // API 요청 시 사용할 userId 반환 (비로그인 시 null 반환)
  getUserIdForApi: () => {
    const { isLoggedIn, userId } = get();
    // 비로그인 시 히스토리 저장을 막기 위해 null 반환
    return isLoggedIn ? userId : null;
  },
}));
