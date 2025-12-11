/* eslint-disable no-unused-vars */
import { useState } from "react";
import "../styles/track.css";
// import Header from "../components/Header.jsx";
import PartSelector from "../components/PartSelector.jsx";
import RecommendationSection from "../components/RecommendationSection.jsx";
import useTrackPage from "../hooks/useTrackPage.js";
import { formatTime } from "../utils/time.js";

/**
 * 유튜브 일반 URL을 embed URL로 변환했습니다.
 */
function toEmbedUrl(originalUrl) {
  if (!originalUrl) return "";
  try {
    const url = new URL(originalUrl);
    let videoId = "";

    // https://youtu.be/<id>
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.replace("/", "");
    } else {
      // https://www.youtube.com/watch?v=<id>
      const v = url.searchParams.get("v");
      if (v) videoId = v;
    }

    if (!videoId) {
      return originalUrl;
    }

    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    // IFrame API를 사용하기 위한 코드
    return `https://www.youtube.com/embed/${videoId}?enablejsapi=1&origin=${encodeURIComponent(
      origin
    )}`;
  } catch {
    return originalUrl;
  }
}

export default function TrackPage() {
  // 상단 입력창에서만 사용하는 로컬 상태
  const [linkInput, setLinkInput] = useState("");

  const {
    videoUrl,
    duration,
    startMin,
    startSec,
    endMin,
    endSec,
    splitToast,
    selectedParts,
    recommendedTracks,
    isProcessingForPartSelector,
    setVideoFromLink,
    handleStartMinChange,
    handleStartSecChange,
    handleEndMinChange,
    handleEndSecChange,
    handleTogglePart,
    handleStartSplit,
  } = useTrackPage();

  const handleApplyLink = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) {
      alert("유튜브 링크를 입력해 주세요.");
      return;
    }
    setVideoFromLink(trimmed);
  };

  const embedUrl = toEmbedUrl(videoUrl);

  return (
    <>
      <main className="track-page">
        {/* 상단 유튜브 링크 입력 영역 */}
        {videoUrl && (
          <>
            <section className="editor-layout">
              {/* 유튜브 플레이어 , 시간 설정 */}
              <div className="youtube-panel">
                <div className="youtube-frame-wrapper">
                  {embedUrl && (
                    <iframe
                      id="youtube-main-player"
                      className="youtube-frame"
                      src={embedUrl}
                      title="YouTube player"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  )}
                </div>

                <div className="time-controls">
                  <div className="time-row">
                    <span className="label">전체 길이</span>
                    <span className="time-value">
                      {duration > 0
                        ? `${formatTime(duration)} (${Math.floor(
                            duration
                          )}초)`
                        : "영상 길이를 불러오는 중입니다..."}
                    </span>
                  </div>

                  <div className="time-row">
                    <span className="label">시작 시각</span>
                    <div className="time-input-group">
                      <input
                        type="number"
                        min="0"
                        className="time-number-input"
                        value={startMin}
                        onChange={(e) =>
                          handleStartMinChange(e.target.value)
                        }
                      />
                      <span className="time-unit-label">분</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        className="time-number-input"
                        value={startSec}
                        onChange={(e) =>
                          handleStartSecChange(e.target.value)
                        }
                      />
                      <span className="time-unit-label">초</span>
                    </div>
                    <span className="time-value">
                      {formatTime(startMin * 60 + startSec)}
                    </span>
                  </div>

                  <div className="time-row">
                    <span className="label">종료 시각</span>
                    <div className="time-input-group">
                      <input
                        type="number"
                        min="0"
                        className="time-number-input"
                        value={endMin}
                        onChange={(e) =>
                          handleEndMinChange(e.target.value)
                        }
                      />
                      <span className="time-unit-label">분</span>
                      <input
                        type="number"
                        min="0"
                        max="59"
                        className="time-number-input"
                        value={endSec}
                        onChange={(e) =>
                          handleEndSecChange(e.target.value)
                        }
                      />
                      <span className="time-unit-label">초</span>
                    </div>
                    <span className="time-value">
                      {formatTime(endMin * 60 + endSec)}
                    </span>
                  </div>
                </div>
              </div>

              {/* 파트 선택 ,파트 분리 시작 버튼 */}
              <PartSelector
                selectedParts={selectedParts}
                onTogglePart={handleTogglePart}
                isProcessing={isProcessingForPartSelector}
                onStartSplit={handleStartSplit}
              />
            </section>

            {/* 추천 결과 리스트 */}
            <RecommendationSection
              visible={recommendedTracks.length > 0}
              tracks={recommendedTracks}
            />
          </>
        )}

        {/* 상단 토스트 메시지 */}
        {splitToast && (
          <div className="split-toast">
            <span className="split-toast-dot" />
            <span className="split-toast-text">{splitToast}</span>
          </div>
        )}
      </main>
    </>
  );
}
