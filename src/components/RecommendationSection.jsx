import Recommendationicon from "./icons/Recommendationicon.jsx";
import Music from "./icons/Music.jsx";

import Vocalicon from "./icons/Vocalicon.jsx";
import Drumicon from "./icons/Drumicon.jsx";
import Bassicon from "./icons/Bassicon.jsx";
import Pianoicon from "./icons/Pianoicon.jsx";

//Resoponse에서 오는 instrument 아이콘 매핑
const INSTRUMENT_ICON_MAP = {
  vocals: Vocalicon,
  drums: Drumicon,
  bass: Bassicon,
  piano: Pianoicon,
};

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
          const similarityText =
            t.similarity != null
              ? `${Math.round(t.similarity * 100)}% 유사`
              : "추천";

          // instrument 값으로 아이콘 선택
          const Icon = t.instrument
            ? INSTRUMENT_ICON_MAP[t.instrument]
            : null;

          const handleMoreClick = () => {
            let url = "";

            if (t.youtubeVideoId) {
              // 유튜브 ID가 있으면 해당 영상으로 바로 이동
              url = `https://www.youtube.com/watch?v=${t.youtubeVideoId}`;
            } else {
              // ID가 없으면 제목 , 아티스트로 유튜브 검색
              const q = encodeURIComponent(
                `${t.title || ""} ${t.artist || ""}`.trim()
              );
              url = `https://www.youtube.com/results?search_query=${q}`;
            }

            if (url) {
              window.open(url, "_blank", "noopener,noreferrer");
            }
          };

          return (
            <article key={t.id} className="track-card">
              {/* 앨범 이미지 */}
              <div className="track-card-artwork">
                {/* 악기 아이콘 , 유사도 뱃지 */}
                <div className="track-card-badge">
                  {Icon && (
                    <span className="track-card-badge-icon">
                      <Icon />
                    </span>
                  )}
                  <span className="track-card-badge-text">
                    {similarityText}
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

              {/* 음원제목, 작곡가 */}
              <div className="track-card-body">
                <div className="track-card-title">
                  {t.title || "음원 제목"}
                </div>
                <div className="track-card-artist">
                  {t.artist || "작곡가 정보 없음"}
                </div>

                {/* 음원 전체 길이는 표시 X, 더보기 버튼만 */}
                <div className="track-card-footer">
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
