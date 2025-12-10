import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// youtube API key
const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

// 유틸리티 함수 (링크 디코딩, 영상 시간 추출)

// 유튜브 URL에서 동영상 ID를 추출하는 함수
const extractVideoId = (url) => {
  try {
    const urlObj = new URL(url);
    // 일반 watch URL 처리
    if (urlObj.hostname.includes("youtube.com")) {
      return urlObj.searchParams.get("v");
    }
    // 짧은 youtu.be URL 처리
    else if (urlObj.hostname.includes("youtu.be")) {
      // pathname에서 '/'를 제거한 나머지가 ID
      return urlObj.pathname.substring(1);
    }
  } catch (e) {
    console.error("URL 파싱 오류:", e); // 디버그용
    return null;
  }
  return null;
};

// ISO 8601 형식 (PT#M#S 등)을 초 단위로 변환하는 함수
const parseIsoDuration = (iso) => {
  let seconds = 0;
  const regex =
    /P(?:(\d+)Y)?(?:(\d+)M)?(?:(\d+)D)?T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const matches = iso.match(regex);

  if (matches) {
    // [4]=시간(H), [5]=분(M), [6]=초(S)
    seconds += parseInt(matches[4] || 0) * 3600;
    seconds += parseInt(matches[5] || 0) * 60;
    seconds += parseInt(matches[6] || 0);
  }
  return seconds;
};

// Data API를 호출하여 동영상 길이를 비동기적으로 가져오는 함수
const fetchVideoDuration = async (videoId) => {
  if (!YOUTUBE_API_KEY) {
    throw new Error("API 키가 설정되지 않았습니다. (.env 파일 확인)");
  }
  const apiUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YOUTUBE_API_KEY}`;

  const response = await fetch(apiUrl);
  const data = await response.json();

  if (data.error) {
    throw new Error(`API 오류: ${data.error.message}`);
  }

  if (data.items && data.items.length > 0) {
    const isoDuration = data.items[0].contentDetails.duration;
    return parseIsoDuration(isoDuration);
  } else {
    throw new Error(
      "API에서 동영상 정보를 찾을 수 없습니다. (영상 삭제 또는 비공개)"
    );
  }
};

export default function RootPage() {
  const [linkInput, setLinkInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setLinkInput(e.target.value);
    if (error) setError(null);
  };

  const handleStart = async () => {
    if (!linkInput) {
      setError("링크를 입력해 주세요.");
      return;
    }

    setError(null);
    setIsLoading(true);

    const videoId = extractVideoId(linkInput);

    if (!videoId) {
      setError(
        "유효한 YouTube 링크 형식이 아닙니다. (예: https://youtu.be/xxx)"
      );
      setIsLoading(false);
      return;
    }

    try {
      // 영상 길이 획득
      const durationSeconds = await fetchVideoDuration(videoId);

      // 데이터 조합 및 URL 인코딩
      const dataToSend = {
        videoUrl: linkInput,
        durationSeconds: durationSeconds,
      };

      const jsonString = JSON.stringify(dataToSend);
      console.log(jsonString);
      const encodedData = encodeURIComponent(jsonString);

      // /home 경로로 네비게이트
      navigate(`/home?data=${encodedData}`);
    } catch (err) {
      console.error("처리 오류:", err);
      // 사용자에게는 일반적인 오류 메시지 제공
      setError(err.message || "동영상 길이를 가져오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen text-white p-8 md:pl-16 md:pr-0 overflow-hidden">
      {/* 배경 그라데이션 원 (데코레이션 요소) */}
      <div
        className="absolute bottom-0 left-0 w-64 h-64 md:w-[400px] md:h-[400px] 
                           bg-linear-to-l from-red-900/60 to-red-700/40 rounded-full 
                           filter blur-3xl opacity-40"
      ></div>
      <div
        className="absolute top-1/4 left-1/3 w-16 h-16 md:w-24 md:h-24 
                           bg-red-500/50 rounded-full filter blur-xl opacity-30"
      ></div>
      <div
        className="absolute top-0 right-0 w-64 h-64 md:w-[400px] md:h-[400px]
                           bg-linear-to-r from-red-900/60 to-red-700/40 rounded-full
                           filter blur-3xl opacity-40 transform translate-x-1/2 -translate-y-1/2"
      ></div>

      {/* 메인 콘텐츠 영역 */}
      <div className="relative z-10 flex-1 flex flex-col justify-center items-center max-w-full">
        {/* 제목 및 설명 */}
        <h1
          className="
                        text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 text-center
                        bg-linear-to-l from-red-500 to-red-900
                        bg-clip-text text-transparent
                    "
        >
          음악추천 서비스
        </h1>

        <p className="text-gray-300 text-base sm:text-xl leading-relaxed mb-10 text-center">
          분석을 원하는 YouTube 링크를 입력해주세요.
        </p>

        {/* 링크 입력 박스 및 버튼 */}
        <div className="flex w-full max-w-xl flex-col items-center">
          <div className="flex w-full rounded-xl shadow-2xl overflow-hidden bg-gray-800">
            {/* 입력 필드 */}
            <input
              type="url"
              placeholder="Search or paste link here..."
              value={linkInput}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) handleStart();
              }}
              disabled={isLoading}
              className="flex-1 px-6 py-4 text-gray-200 **bg-[#1a0000]/80** focus:outline-none placeholder-gray-500"
              style={{ border: "none" }}
            />

            {/* 버튼 */}
            <button
              onClick={handleStart}
              disabled={isLoading}
              className={`
                                w-32 px-4 py-4
                                text-white text-lg font-bold
                                bg-red-700 hover:bg-red-900 transition duration-300
                                ${
                                  isLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }
                            `}
            >
              {isLoading ? "처리 중..." : "Search"}
            </button>
          </div>

          {/* 오류 메시지 영역 */}
          {error && (
            <p className="mt-4 text-sm text-red-400 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}
