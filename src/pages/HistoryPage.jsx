import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { userStore } from "../store/userStore";
// import { MOCK_HISTORY } from "../components/mockHistory"; // 임시 히스토리 데이터 (서버 연동되서 사용 안함)
import useYouTubeMore from "../hooks/useYouTubeMore";
import ListMusicIcon from "../components/icons/ListMusicicon";
import Leftarrow from "../components/icons/Leftarrow";
import Rightarrow from "../components/icons/Rightarrow";

const HISTORY_URL = import.meta.env.VITE_API_BASE_URL + "/api/history/user";
const ITEMS_PER_PAGE = 15;

// ISO 날짜를 'YYYY-MM-DD HH:MM' 형식으로 포맷하는 헬퍼 함수
const formatDate = (isoString) => {
  try {
    const date = new Date(isoString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
      .replace(/\. /g, "-")
      .replace(/\.$/, "")
      .replace(" ", " ");
  } catch {
    return "날짜 오류";
  }
};

export default function HistoryPage() {
  const userId = userStore((state) => state.userId);
  const nickname = userStore((state) => state.nickname);
  const token = userStore((state) => state.accessToken);

  const [history, setHistory] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openYouTubeMore } = useYouTubeMore();

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const userIdForApi = userId;

    // console.log(
    //   "useEffect 실행됨. token:",
    //   token ? "존재함" : "없음",
    //   "userIdForApi:",
    //   userIdForApi
    // );

    const fetchHistory = async () => {
      setLoading(true);

      // 로그인 정보 없으면 API 요청 없이 로딩 종료 (history는 []로 유지됨)
      if (!userIdForApi || !token) {
        console.log("로그인 정보 없음. API 요청 생략.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${HISTORY_URL}/${userIdForApi}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHistory(response.data);
        setCurrentPage(1);
      } catch (error) {
        console.error("히스토리 불러오기 실패:", error);
        setHistory([]); // 실패 시 빈 배열로 설정
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [userId, token]);

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  // --- 페이지네이션(15개만 띄우고 이동할수 있게)로직 ---
  const totalItems = history.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  // 현재 페이지에 표시할 항목
  const currentHistory = history.slice(startIndex, endIndex);

  // 페이지 이동 함수
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // 페이지 이동 시, 확장된 행을 닫습니다.
    setExpandedRow(null);
    // 페이지 맨 위로 스크롤
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isReadyToRender = !loading;

  if (!isReadyToRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500 text-lg font-medium">
        이용 기록을 확인 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="flex justify-start border-b border-red-700 mb-4">
          <ListMusicIcon className="mt-2.5 mr-2" />
          <h1 className="text-3xl font-bold text-white mb-3 pb-3">
            {nickname} 님의 이용 기록
          </h1>
        </div>

        {/* 히스토리 없음 */}
        {history.length === 0 ? (
          <div className="bg-zinc-900 border-l-4 animate-form border-red-600 p-6 rounded-lg mt-8 text-gray-300">
            <p className="font-medium">
              {nickname}님, 아직 이용 기록이 없습니다.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              새로운 분석을 시도해 보세요!
            </p>
          </div>
        ) : (
          <div className="mt-8">
            {/* 테이블 */}
            <div className="overflow-x-auto animate-confirm shadow-2xl rounded-xl bg-zinc-900 border border-red-900/50">
              <table className="w-full border-collapse">
                <thead className="bg-zinc-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs text-red-400">
                      No.
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-red-400">
                      사용 링크
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-red-400">
                      구간
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-red-400">
                      악기
                    </th>
                    <th className="px-4 py-3 text-left text-xs text-red-400">
                      날짜
                    </th>
                    <th className="px-4 py-3 text-center text-xs text-red-400">
                      결과
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {currentHistory.map((item, index) => (
                    <Fragment key={item.id}>
                      <tr
                        className={`border-b border-zinc-800 transition ${
                          expandedRow === item.id
                            ? "bg-zinc-900"
                            : "hover:bg-zinc-700"
                        }`}
                      >
                        <td className="px-4 py-3 text-sm">
                          {startIndex + index + 1}
                        </td>

                        <td className="px-4 py-3 text-red-400 text-sm">
                          <a
                            href={item.youtubeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline"
                          >
                            링크
                          </a>
                        </td>

                        <td className="px-4 py-3 text-sm">
                          {item.startSec}s ~ {item.endSec}s
                        </td>

                        <td className="px-4 py-3 text-sm">
                          <div className="flex flex-wrap gap-1">
                            {item.instrument.map((inst) => {
                              const lower = inst.toLowerCase();
                              const display =
                                lower === "piano" || lower === "other"
                                  ? "melody"
                                  : inst;
                              return (
                                <span
                                  key={inst}
                                  className="px-2 py-0.5 text-xs bg-red-800/70 text-white rounded-full"
                                >
                                  {display}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-gray-400">
                          {formatDate(item.date)}
                        </td>

                        <td className="px-4 py-3 text-center">
                          <button
                            onClick={() => toggleRow(item.id)}
                            className="text-sm text-red-400 hover:text-red-300"
                          >
                            {expandedRow === item.id ? "접기 ▲" : "펼치기 ▼"}
                          </button>
                        </td>
                      </tr>

                      {expandedRow === item.id && (
                        <tr className="bg-zinc-950/70">
                          <td colSpan={6} className="px-6 py-4">
                            <h3 className="text-red-400 font-semibold mb-2">
                              추천 결과
                            </h3>

                            <ul className="space-y-2">
                              {item.recommendedMusic.map((song, idx) => (
                                <li
                                  key={idx}
                                  className="flex justify-between items-center bg-zinc-900 px-4 py-2 rounded border border-red-900/50"
                                >
                                  <div className="flex-1 min-w-0">
                                    <p className="text-white font-medium truncate">
                                      {song.title}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      {song.artist}
                                    </p>
                                  </div>

                                  <span className="text-red-300 text-sm font-bold w-16 text-right">
                                    {(song.similarity * 100).toFixed(1)}%
                                  </span>

                                  <button
                                    onClick={() =>
                                      openYouTubeMore({
                                        title: song.title,
                                        artist: song.artist,
                                        youtubeVideoId: song.youtubeVideoId,
                                      })
                                    }
                                    className="text-red-400 hover:underline text-sm w-10 text-right"
                                  >
                                    듣기
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 영역 */}
            {totalPages > 1 && (
              <div className="flex justify-center space-x-2 mt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-2 py-1 bg-zinc-700 rounded disabled:opacity-50"
                >
                  <Leftarrow />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 mr-2 rounded text-white font-bold ${
                        currentPage === page ? "bg-red-800 rounded-2xl" : " "
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-2 py-1 ml-2 bg-zinc-700 rounded disabled:opacity-50"
                >
                  <Rightarrow />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
