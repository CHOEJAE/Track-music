// src/pages/TrackPage.jsx
import { useEffect, useMemo, useState } from "react";
import UploadDropzone from "../components/UploadDropzone.jsx";
import WaveformPanel from "../components/WaveformPanel.jsx";
import PartSelector from "../components/PartSelector.jsx";
import RecommendationSection from "../components/RecommendationSection.jsx";

export default function TrackPage() {
  const [file, setFile] = useState(null);

  const [duration, setDuration] = useState(0);
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const [isTrimmed, setIsTrimmed] = useState(false);

  const [selectedParts, setSelectedParts] = useState(["vocal", "drum"]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isSplitDone, setIsSplitDone] = useState(false);

  const [showDoneToast, setShowDoneToast] = useState(false);

  // 🔹 파일 선택 시 모든 관련 상태 초기화
  const handleFileSelect = (newFile) => {
    setFile(newFile);

    setDuration(0);
    setSelectionStart(0);
    setSelectionEnd(0);
    setIsTrimmed(false);

    setIsProcessing(false);
    setProgress(0);
    setIsSplitDone(false);
    setShowDoneToast(false);
  };

  // 🔹 file -> audioUrl 파생 (state 사용 X, setState 없음)
  const audioUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  // 🔹 object URL 정리용 effect (cleanup 전용, setState 없음)
  useEffect(() => {
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [audioUrl]);

  // 오디오 메타데이터 로딩 -> 실제 길이 설정
  const handleLoadedMetadata = (e) => {
    const d = e.target.duration || 0;
    setDuration(d);
    setSelectionStart(0);
    setSelectionEnd(d);
  };

  // 파트 토글
  const handleTogglePart = (id) => {
    setSelectedParts((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  // 구간 자르기
  const handleTrimSection = () => {
    if (selectionEnd <= selectionStart) return;
    setIsTrimmed(true);
  };

  // 파트 분리 시작 (가짜 진행바)
  const handleStartSplit = () => {
    if (!file) {
      alert("먼저 음원 파일을 업로드해주세요.");
      return;
    }
    if (selectedParts.length === 0) {
      alert("분리할 파트를 한 개 이상 선택해주세요.");
      return;
    }

    setIsProcessing(true);
    setIsSplitDone(false);
    setProgress(0);
    setShowDoneToast(false);

    let current = 0;
    const interval = setInterval(() => {
      current += 8;
      if (current >= 100) {
        current = 100;
        clearInterval(interval);
        setIsProcessing(false);
        setIsSplitDone(true);
        setShowDoneToast(true);

        setTimeout(() => setShowDoneToast(false), 3000);
      }
      setProgress(current);
    }, 250);
  };

  // 추천 리스트 
  const recommendedTracks = useMemo(
    () => [
      {
        id: 1,
        title: "Dynamite",
        artist: "BTS",
        similarity: 0.94,
        durationSeconds: 199,
      },
      {
        id: 2,
        title: "Butter",
        artist: "BTS",
        similarity: 0.89,
        durationSeconds: 164,
      },
      {
        id: 3,
        title: "Permission to Dance",
        artist: "BTS",
        similarity: 0.87,
        durationSeconds: 187,
      },
      {
        id: 4,
        title: "My Universe",
        artist: "Coldplay & BTS",
        similarity: 0.85,
        durationSeconds: 228,
      },
      {
        id: 5,
        title: "Sample Track",
        artist: "WebBrain AI",
        similarity: 0.92,
        durationSeconds: 210,
      },
    ],
    []
  );

  return (
    <div className="page-container">
      {!file && <UploadDropzone onFileSelect={handleFileSelect} />}

      {file && (
        <>
          {/* 실제 오디오 길이만 읽기 */}
          {audioUrl && (
            <audio
              src={audioUrl}
              style={{ display: "none" }}
              onLoadedMetadata={handleLoadedMetadata}
            />
          )}

          <div className="editor-layout">
            <WaveformPanel
              fileName={file.name}
              audioUrl={audioUrl}
              duration={duration}
              selectionStart={selectionStart}
              selectionEnd={selectionEnd}
              onChangeStart={setSelectionStart}
              onChangeEnd={setSelectionEnd}
              onTrimSection={handleTrimSection}
              isTrimmed={isTrimmed}
            />

            <PartSelector
              selectedParts={selectedParts}
              onTogglePart={handleTogglePart}
              onStartSplit={handleStartSplit}
              isProcessing={isProcessing}
              progress={progress}
              isSplitDone={isSplitDone}
            />
          </div>

          <RecommendationSection
            visible={isSplitDone}
            tracks={recommendedTracks}
          />
        </>
      )}

      {showDoneToast && (
         <div className="split-toast">
          <div className="split-toast-inner">
            <div className="split-toast-title">파트 분리 완료</div>
            <div className="split-toast-message">
              음원이 성공적으로 분리되었습니다.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
