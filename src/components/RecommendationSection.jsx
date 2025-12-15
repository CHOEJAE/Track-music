import Recommendationicon from "./icons/Recommendationicon.jsx";
import Music from "./icons/Music.jsx";

import Vocalicon from "./icons/Vocalicon.jsx";
import Drumicon from "./icons/Drumicon.jsx";
import Bassicon from "./icons/Bassicon.jsx";
import Pianoicon from "./icons/Pianoicon.jsx";

import useYouTubeMore from "../hooks/useYouTubeMore";

//00:00 형식
function mmss(sec) {
  const n = Math.max(0, Math.floor(Number(sec) || 0));
  const m = String(Math.floor(n / 60)).padStart(2, "0");
  const s = String(n % 60).padStart(2, "0");
  return `${m}:${s}`;
}

// 악기 아이콘 
function getPartIcon(instrument) {
  const first = Array.isArray(instrument) ? instrument[0] : instrument;
  const v = String(first || "").trim().toLowerCase();

  if (v === "vocals" || v === "vocal") return Vocalicon;
  if (v === "drums" || v === "drum") return Drumicon;
  if (v === "bass") return Bassicon;
  if (v === "piano" || v === "melody") return Pianoicon;

  return null;
}

export default function RecommendationSection({ visible, tracks }) {
  const { openYouTubeMore } = useYouTubeMore();

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
          const similarityText =
            t?.similarity != null ? `${Math.round(t.similarity * 100)}% 유사` : "추천";

          const hasRange =
            Number.isFinite(Number(t?.startSec)) && Number.isFinite(Number(t?.endSec));
          const rangeText = hasRange ? `${mmss(t.startSec)} - ${mmss(t.endSec)}` : "";

          const Icon = getPartIcon(t?.instrument);

          const handleMoreClick = () => {
            openYouTubeMore({
              title: t?.title,
              artist: t?.artist,
              youtubeVideoId: t?.youtubeVideoId,
            });
          };

          return (
            <article key={t?.id ?? `${t?.title}-${t?.artist}`} className="track-card">
              <div className="track-card-artwork">
                {/* 아이콘 00% 유사 부분*/}
                <div
                  className="track-card-badge"
                  style={{ display: "flex", alignItems: "center", gap: 6 }}
                >
                  {Icon ? <Icon size={14} /> : null}
                  <span>{similarityText}</span>
                </div>

                {t?.albumCoverUrl ? (
                  <img
                    src={t.albumCoverUrl}
                    alt={`${t?.title || "음원"} 앨범 커버`}
                    className="track-card-img"
                  />
                ) : (
                  <div className="track-card-placeholder">
                    <Music />
                  </div>
                )}
              </div>

              <div className="track-card-body">
                <div className="track-card-title">{t?.title || "음원 제목"}</div>
                <div className="track-card-artist">{t?.artist || "작곡가 정보 없음"}</div>

                {/* 구간 , 더보기 부분 */}
                <div className="track-card-footer" style={{ display: "flex", gap: 10 }}>
                  {rangeText ? (
                    <span
                      className="track-card-range"
                      style={{ marginRight: "auto", fontSize: 12, opacity: 0.85 }}
                    >
                      {rangeText}
                    </span>
                  ) : (
                    <span style={{ marginRight: "auto" }} />
                  )}

                  <button type="button" className="track-card-more" onClick={handleMoreClick}>
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
