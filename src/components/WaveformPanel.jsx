import { useEffect, useRef, useState } from "react";
import { formatTime } from "../utils/time.js";
import Playicon from "./icons/Playicon.jsx";
import Stopicon from "./icons/Stopicon.jsx";
import Scissorsicon from "./icons/Scissorsicon.jsx";

export default function WaveformPanel({
  fileName,
  audioUrl,
  duration,
  selectionStart,
  selectionEnd,
  onChangeStart,
  onChangeEnd,
  onTrimSection,
  isTrimmed,
}) {
  //음원 길이
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  //선택 구간 길이
  const selectionDuration = Math.max(0, selectionEnd - selectionStart);

  //음원 관련 코드
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.currentTime >= selectionEnd) {
        audio.pause();
        audio.currentTime = selectionEnd;
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [selectionEnd]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  // 재생 / 일시정지 함수
  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = selectionStart || 0;
      audio.play();
      setIsPlaying(true);
    }
  };

  const totalLabel = isTrimmed
    ? `총 길이: ${formatTime(selectionDuration)}`
    : `총 길이: ${formatTime(duration)}`;

  return (
    <section className="panel waveform-panel">
      <audio ref={audioRef} src={audioUrl} />

      <header className="panel-header">
        <div className="file-info">
          <div className="file-name">{fileName}</div>
          <div className="file-meta">{totalLabel}</div>
        </div>
      </header>

      <div className="waveform-box">
        <div
          className={`waveform-bg ${isTrimmed ? "waveform-bg--trimmed" : ""}`}
        />
        <div className="waveform-range-labels">
          <span>{formatTime(selectionStart)}</span>
          <span>{formatTime(selectionEnd)}</span>
        </div>
      </div>

      {/* 선택 구간 컨트롤 */}
      <div className="selection-controls">
        <div className="selection-row">
          <span className="selection-label">선택 구간</span>
        </div>

        <div className="selection-row">
          <span className="selection-sub-label">시작</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={selectionStart}
            onChange={(e) =>
              onChangeStart(Math.min(Number(e.target.value), selectionEnd))
            }
          />
        </div>

        <div className="selection-row">
          <span className="selection-sub-label">끝</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={selectionEnd}
            onChange={(e) =>
              onChangeEnd(Math.max(Number(e.target.value), selectionStart))
            }
          />
        </div>

        <div className="selection-footer">
          <button
            className="play-button"
            type="button"
            onClick={handlePlayPause}
          >
            {isPlaying ? <Stopicon /> : <Playicon />}
            <span className="play-time">
              {formatTime(selectionDuration)}
            </span>
          </button>

          <button
            className="secondary-button"
            type="button"
            onClick={onTrimSection}
          >
            <Scissorsicon /> 구간 자르기
          </button>
        </div>
      </div>
    </section>
  );
}
