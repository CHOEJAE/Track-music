import "../styles/profile.css";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../utils/time.js";


// 임시 데이터 삭제 예정 
// 일단 테이블 형식 생각없이 작성했습니다.
const MOCK_HISTORY = [
  {
    id: 1,
    fileName: "음원 제목1.mp3",
    createdAt: "2025-12-06 21:12",
    duration: 97,
    parts: ["보컬", "드럼", "베이스"],
  },
  {
    id: 2,
    fileName: "음원 제목2.mp3",
    createdAt: "2025-11-27 18:40",
    duration: 180,
    parts: ["보컬", "드럼"],
  },
  {
    id: 3,
    fileName: "음원 제목1.mp3",
    createdAt: "2025-11-26 00:05",
    duration: 142,
    parts: ["베이스"],
  },
];

export default function HistoryPage() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="profile-page">
      <div className="profile-card profile-detail-card">
        <button className="profile-back-button" onClick={handleBack}>
          ←
        </button>

        <h1 className="profile-detail-title">이용 기록</h1>

        <ul className="history-list">
          {MOCK_HISTORY.map((item) => (
            <li key={item.id} className="history-item">
              <div className="history-main">
                <div className="history-title">{item.fileName}</div>
                <div className="history-meta">
                  <span>{item.createdAt}</span>
                  <span> · {formatTime(item.duration)}</span>
                </div>
              </div>
              <div className="history-tags">
                {item.parts.map((p) => (
                  <span key={p} className="history-tag">
                    {p}
                  </span>
                ))}
              </div>
            </li>
          ))}
        </ul>

      </div>
    </div>
  );
}
