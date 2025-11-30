import { useRef, useState } from "react";
import PartSelectoricon from "./icons/PartSelectoricon";
export default function UploadDropzone({ onFileSelect }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      onFileSelect(file);
    }
  };

  return (
    <section className="hero-section">
      <h1 className="hero-title">AI 음악 파트 분리 & 추천 서비스</h1>
      <p className="hero-subtitle">
        음악의 특정 파트를 분리하고, 유사한 사운드의 음악을 추천받으세요
      </p>

      <div
        className={`dropzone ${isDragging ? "dropzone--active" : ""}`}
        onClick={handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="dropzone-inner">
          <div className="dropzone-icon">
            <PartSelectoricon/>
          </div>
          <div className="dropzone-title">
            음원 파일을 드래그하거나 클릭하여 업로드
          </div>
          <div className="dropzone-desc">
            MP3, WAV 파일 지원 (최대 100MB)
          </div>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="audio/*"
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
      </div>
    </section>
  );
}
