import Recommendationicon from "./icons/Recommendationicon.jsx";
import Music from "./icons/Music.jsx";


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

          const handleMoreClick = () => {
            let url = "";

            if (t.youtubeVideoId) {
              //유튜브 ID가 있으면 해당 영상으로 바로 이동?가능하도록?
              url = `https://www.youtube.com/watch?v=${t.youtubeVideoId}`;
            } else {
              //없다는 가정으로 제목 아티스트로 유튜브 검색
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
              {/*앨범 이미지*/}
              <div className="track-card-artwork">
                {/*유사도 뱃지 */}
                <div className="track-card-badge">{similarityText}</div>

                {t.albumCoverUrl ? (
                  <img
                    src={t.albumCoverUrl}
                    alt={`${t.title} 앨범 커버`}
                    className="track-card-img"
                  />
                ) : (
                  <div className="track-card-placeholder">
                    <Music/>
                  </div>
                )}
              </div>

              {/*음원제목, 작곡가 */}
              <div className="track-card-body">
                <div className="track-card-title">
                  {t.title || "음원 제목"}
                </div>
                <div className="track-card-artist">
                  {t.artist || "작곡가 정보 없음"}
                </div>

                {/*음원 전체 길이는 일단 표시x, 더보기 버튼 오른쪽 지정 */}
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
