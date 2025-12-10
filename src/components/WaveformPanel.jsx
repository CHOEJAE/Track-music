/* eslint-disable react-hooks/set-state-in-effect */
import { formatTime } from "../utils/time.js";
import Playicon from "./icons/Playicon.jsx";
import Stopicon from "./icons/Stopicon.jsx";
import Scissorsicon from "./icons/Scissorsicon.jsx";
import VolumeControlIcon from "./icons/Volume_control.jsx";
import { useWaveformPanel } from "../hooks/useWaveformPanel.js";

// 사용하지않을것으로 확인하고, 추후 삭제 예정

export default function WaveformPanel(props) {
  const {
    fileName,
    audioUrl,
    duration,
    selectionStart,
    selectionEnd,
  } = props;

  const {
    audioRef,
    waveformCanvasRef,
    trimCanvasRef,
    showTrimPreview,
    selectionDuration,
    isPlaying,
    volume,
    setVolume,
    startMin,
    startSec,
    endMin,
    endSec,
    handlePlayPause,
    handleTrimClick,
    handleStartMinChange,
    handleStartSecChange,
    handleEndMinChange,
    handleEndSecChange,
  } = useWaveformPanel(props);

  const totalLabel = `총 길이: ${formatTime(duration)}`;

  return (
    <section className="panel waveform-panel">
      <audio ref={audioRef} src={audioUrl} />

      <header className="panel-header">
        <div className="file-info">
          <div className="file-name">{fileName}</div>
          <div className="file-meta">{totalLabel}</div>
        </div>
      </header>

      {/* 전체 파형 */}
      <div className="waveform-box">
        <canvas ref={waveformCanvasRef} className="waveform-canvas" />
        <div className="waveform-range-labels">
          <span>{formatTime(0)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 잘라낸 구간 파형 */}
      {showTrimPreview && (
        <div className="waveform-trimmed-box">
          <div className="waveform-trimmed-header">
            수정된 구간  ({formatTime(selectionDuration)})
          </div>
          <canvas
            ref={trimCanvasRef}
            className="waveform-trimmed-canvas"
          />
        </div>
      )}

      {/* 선택 구간 + 볼륨 */}
      <div className="selection-controls">
        <div className="selection-row selection-row--top">
          <span className="selection-label">선택 구간</span>
          <div className="volume-control">
            <span className="volume-icon">
              <VolumeControlIcon />
            </span>
            <input
              className="volume-slider"
              type="range"
              min={0}
              max={100}
              value={Math.round(volume * 100)}
              onChange={(e) => setVolume(Number(e.target.value) / 100)}
            />
          </div>
        </div>

        {/* 시작 (분/초) */}
        <div className="selection-row">
          <span className="selection-sub-label">시작</span>
          <div className="selection-time-inputs">
            <input
              type="number"
              min={0}
              className="selection-number-input"
              value={startMin}
              onChange={handleStartMinChange}
            />
            <span className="selection-time-separator">분</span>
            <input
              type="number"
              min={0}
              max={59}
              className="selection-number-input"
              value={startSec}
              onChange={handleStartSecChange}
            />
            <span className="selection-time-separator">초</span>
          </div>
          <span className="selection-time-label">
            {formatTime(selectionStart)}
          </span>
        </div>

        {/* 끝 (분/초) */}
        <div className="selection-row">
          <span className="selection-sub-label">끝</span>
          <div className="selection-time-inputs">
            <input
              type="number"
              min={0}
              className="selection-number-input"
              value={endMin}
              onChange={handleEndMinChange}
            />
            <span className="selection-time-separator">분</span>
            <input
              type="number"
              min={0}
              max={59}
              className="selection-number-input"
              value={endSec}
              onChange={handleEndSecChange}
            />
            <span className="selection-time-separator">초</span>
          </div>
          <span className="selection-time-label">
            {formatTime(selectionEnd)}
          </span>
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
            onClick={handleTrimClick}
          >
            <Scissorsicon /> 구간 자르기
          </button>
        </div>
      </div>
    </section>
  );
}
