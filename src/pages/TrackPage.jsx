import "../styles/track.css";
import UploadDropzone from "../components/UploadDropzone.jsx";
import WaveformPanel from "../components/WaveformPanel.jsx";
import PartSelector from "../components/PartSelector.jsx";
import RecommendationSection from "../components/RecommendationSection.jsx";
import useTrackPage from "../hooks/useTrackPage.js";

export default function TrackPage() {
  const {
    file,
    fileName,
    audioUrl,
    duration,
    selectionStart,
    selectionEnd,
    isUploading,
    splitToast,
    selectedParts,
    recommendedTracks,
    isProcessingForPartSelector,
    handleFileSelect,
    handleTogglePart,
    handleStartSplit,
    setSelectionStart,
    setSelectionEnd,
  } = useTrackPage();

  return (
    <main className="track-page">
      {/* 업로드 카드 부분 */}
      {!file && (
        <section className="upload-section">
          <UploadDropzone
            onFileSelect={handleFileSelect}
            isUploading={isUploading}
          />
        </section>
      )}

      {/* 업로드 후 편집 UI */}
      {file && (
        <>
          <section className="editor-layout">
            {/*파형, 구간 선택 */}
            <WaveformPanel
              fileName={fileName}
              audioUrl={audioUrl}
              duration={duration}
              selectionStart={selectionStart}
              selectionEnd={selectionEnd}
              onChangeStart={setSelectionStart}
              onChangeEnd={setSelectionEnd}
              onTrimSection={() => {
                // 잘라낸 파형 부분과 재생만 처리
              }}
              isTrimmed={false}
            />

            {/*파트 선택 ,버튼 */}
            <PartSelector
              selectedParts={selectedParts}
              onTogglePart={handleTogglePart}
              isProcessing={isProcessingForPartSelector}
              onStartSplit={handleStartSplit}
            />
          </section>

          {/* 추천 결과 리스트 */}
          <RecommendationSection tracks={recommendedTracks} />
        </>
      )}

      {/* 상단 메시지 */}
      {splitToast && (
        <div className="split-toast">
          <span className="split-toast-dot" />
          <span className="split-toast-text">{splitToast}</span>
        </div>
      )}
    </main>
  );
}
