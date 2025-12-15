import Recommendationicon from "./icons/Recommendationicon.jsx";
import Music from "./icons/Music.jsx";
import { formatTime } from "../utils/time.js";

import Vocalicon from "./icons/Vocalicon.jsx";
import Drumicon from "./icons/Drumicon.jsx";
import Bassicon from "./icons/Bassicon.jsx";
import Pianoicon from "./icons/Pianoicon.jsx";

const PART_ICON = {
  vocal: Vocalicon,
  drum: Drumicon,
  bass: Bassicon,
  melody: Pianoicon,
};

function instrumentToPart(instrument) {
  const v = String(instrument || "").toLowerCase();
  if (v === "vocals" || v === "vocal") return "vocal";
  if (v === "drums" || v === "drum") return "drum";
  if (v === "bass") return "bass";
  if (v === "piano" || v === "melody") return "melody";
  return null;
}

export default function RecommendationSection({ visible, tracks }) {
  if (!visible || !Array.isArray(tracks) || tracks.length === 0) return null;

  return (
    <section className="recommend-section">
      <header className="recommend-header">
        <span className="recommend-icon">
          <Recommendationicon />
        </span>
        <h2>유사한 음악 추천</h2>
      </header>

      <div className="recommend-grid">
        {tracks.map((t) => {
          const percent =
            t.similarity != null
              ? Math.round(Number(t.similarity) * 100)
              : null;

          //카드별 파트 아이콘 선택 
          const partKey = t.partId || instrumentToPart(t.instrument);
          const Icon = partKey ? PART_ICON[partKey] : null;

          const handleMoreClick = () => {
            let url = "";
            if (t.youtubeVideoId) {
              url = `https://www.youtube.com/watch?v=${t.youtubeVideoId}`;
            } else {
              const q = encodeURIComponent(`${t.title || ""} ${t.artist || ""}`.trim());
              url = `https://www.youtube.com/results?search_query=${q}`;
            }
            if (url) window.open(url, "_blank", "noopener,noreferrer");
          };

          return (
            <article key={t.id} className="track-card">
              <div className="track-card-artwork">

                <div className="track-card-badge">
                  {Icon && (
                    <span className="badge-icon">
                      <Icon />
                    </span>
                  )}
                  <span className="badge-text">
                    {percent != null ? `${percent}% 유사` : "추천"}
                  </span>
                </div>

                {t.albumCoverUrl ? (
                  <img
                    src={t.albumCoverUrl}
                    alt={`${t.title} 앨범 커버`}
                    className="track-card-img"
                  />
                ) : (
                  <div className="track-card-placeholder">
                    <Music />
                  </div>
                )}
              </div>

              <div className="track-card-body">
                <div className="track-card-title">{t.title || "음원 제목"}</div>
                <div className="track-card-artist">{t.artist || "작곡가 정보 없음"}</div>

                <div className="track-card-footer">
                  <div className="track-card-range">
                    {Number.isFinite(Number(t.startSec)) && Number.isFinite(Number(t.endSec))
                      ? `${formatTime(Number(t.startSec))} - ${formatTime(Number(t.endSec))}`
                      : ""}
                  </div>

                  <button
                    type="button"
                    className="track-card-more"
                    onClick={handleMoreClick}
                  >
                    더보기
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
