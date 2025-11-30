import { formatTime } from "../utils/time.js";
import PartSelectoricon from "./icons/PartSelectoricon.jsx";
import Recommendationicon from "./icons/Recommendationicon.jsx";
export default function RecommendationSection({ visible, tracks }) {
  if (!visible) return null;

  return (
    <section className="recommend-section">
      <header className="recommend-header">
        <span className="recommend-icon">
          <Recommendationicon/>
        </span>
        <h2>유사한 음악 추천</h2>
      </header>

      <div className="recommend-grid">
        {tracks.map((t) => (
          <article key={t.id} className="track-card">
            <div className="track-card-badge">
              {Math.round(t.similarity * 100)}% 유사
            </div>
            <div className="track-card-artwork">
          <PartSelectoricon/>
            </div>
            <div className="track-card-body">
              <div className="track-card-title">{t.title}</div>
              <div className="track-card-artist">{t.artist}</div>
              <div className="track-card-meta">
                {formatTime(t.durationSeconds)}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
