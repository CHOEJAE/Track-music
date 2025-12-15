import Vocalicon from "./icons/Vocalicon.jsx";
import Drumicon from "./icons/Drumicon.jsx";
import Bassicon from "./icons/Bassicon.jsx";
import Pianoicon from "./icons/Pianoicon.jsx";

const PARTS = [
  { id: "vocal", label: "보컬", Icon: Vocalicon },
  { id: "drum", label: "드럼", Icon: Drumicon },
  { id: "bass", label: "베이스", Icon: Bassicon },
  { id: "melody", label: "멜로디", Icon: Pianoicon },
];

export default function PartSelector({
  selectedParts,
  onTogglePart,
  onStartSplit,
  isProcessing,
  progress,
  isSplitDone,


  recommendCount,
  onChangeRecommendCount,
}) {
  const handleCheckbox = (id) => onTogglePart(id);

  const handleRecommendCountChange = (e) => {
    const raw = e.target.value;
    onChangeRecommendCount(raw);
  };

  return (
    <section className="panel part-panel">
      <header className="panel-header">
        <h2 className="panel-title">파트 분리</h2>
      </header>

      <ul className="part-list">
        {PARTS.map((part) => {
          const checked = selectedParts.includes(part.id);
          const showIcons = isSplitDone && checked;
          const { Icon } = part;

          return (
            <li key={part.id} className="part-item">
              <label className="part-label">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => handleCheckbox(part.id)}
                />
                <span className="part-icon">
                  <Icon />
                </span>
                <span className="part-text">{part.label}</span>
              </label>

              {showIcons && (
                <div className="part-actions">
                  <button className="icon-button" type="button">
                    
                    <PartPlayicon />
                  </button>
                  <button className="icon-button" type="button">
                    <PartDownloadicon />
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>

      <div className="part-footer">
        {isProcessing && (
          <div className="progress-area">
            <span className="progress-label">처리 중...</span>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="progress-percent">{progress}%</span>
          </div>
        )}

        {/*  추천 개수 입력 */}
        <div className="recommend-count-row">
          <span className="recommend-count-label">추천 개수</span>
          <input
            type="number"
            min="1"
            max="50"
            className="recommend-count-input"
            value={recommendCount}
            onChange={handleRecommendCountChange}
            disabled={isProcessing}
          />
          <span className="recommend-count-unit">곡</span>
        </div>

        <button
          className={`primary-button ${isProcessing ? "primary-button--disabled" : ""}`}
          type="button"
          onClick={onStartSplit}
          disabled={isProcessing}
        >
          {isProcessing ? "처리 중..." : "파트 분리 시작"}
        </button>
      </div>
    </section>
  );
}
