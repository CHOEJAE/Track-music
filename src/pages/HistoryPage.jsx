import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { userStore } from "../store/userStore";
// import { MOCK_HISTORY } from "../components/mockHistory"; // 임시 히스토리 데이터 (서버 연동되서 사용 안함)
import useYouTubeMore from "../hooks/useYouTubeMore";

const HISTORY_URL = import.meta.env.VITE_API_BASE_URL + "/api/history/user";

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

  const isReadyToRender = !loading;

  if (!isReadyToRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500 text-lg font-medium">
        이용 기록을 확인 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-5 pb-5 border-b border-red-700">
          {nickname}님의 이용 기록
        </h1>

        {history.length === 0 ? (
          <div className="bg-zinc-900 border-l-4 border-red-600 p-6 rounded-lg mt-8 text-gray-300">
            <p className="font-medium">
              {nickname}님, 아직 이용 기록이 없습니다.
            </p>
            <p className="text-sm text-gray-500 mt-1">
              새로운 분석을 시도해 보세요!
            </p>
          </div>
        ) : (
          /* 테이블 */
          <div className="overflow-x-auto shadow-2xl rounded-xl bg-zinc-900 border border-red-900/50">
            <table className="w-full border-collapse rounded-lg overflow-hidden">
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
                    날짜 (date)
                  </th>
                  <th className="px-4 py-3 text-center text-xs text-red-400">
                    결과
                  </th>
                </tr>
              </thead>

              <tbody>
                {history.map((item, index) => (
                  <Fragment key={item.id}>
                    <tr
                      // 확장 여부에 따라 hover 클래스를 조건부로 적용
                      className={`border-b border-zinc-800 transition duration-150 ${
                        expandedRow === item.id
                          ? "bg-zinc-900"
                          : "hover:bg-zinc-700"
                      }`}
                    >
                      <td className="px-4 py-3 text-sm">{index + 1}</td>
                      <td className="px-4 py-3 text-red-400 text-sm">
                        <a
                          href={item.youtubeUrl}
                          className="hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          링크
                        </a>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {item.startSec}s ~ {item.endSec}s
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-wrap gap-1">
                          {item.instrument.map((inst) => (
                            <span
                              key={inst}
                              className="px-2 py-0.5 text-xs font-medium bg-red-800/70 text-white rounded-full"
                            >
                              {inst}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-400">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleRow(item.id)}
                          className="text-sm text-red-400 hover:text-red-300 transition duration-150"
                        >
                          {expandedRow === item.id ? "접기 ▲" : "펼치기 ▼"}
                        </button>
                      </td>
                    </tr>

                    {expandedRow === item.id && (
                      <tr className="bg-zinc-950/70">
                        <td colSpan={6} className="px-6 py-4">
                          <h3 className="text-red-400 font-semibold mb-1 border-zinc-800 pb-2">
                            추천 결과
                          </h3>

                          {/* 결과 팝업창 미니 헤더 */}
                          <div className="flex justify-between items-center text-xs font-semibold text-gray-500 mb-2 px-4 border-b border-zinc-700 pb-1">
                            <span className="flex-1 text-left">
                              노래 정보 (제목/가수)
                            </span>
                            <span className="w-16 text-right pr-7">유사도</span>
                            <span className="w-10 text-right">링크</span>
                          </div>

                          <ul className="space-y-2">
                            {item.recommendedMusic.map((song, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between items-center bg-zinc-900 px-4 py-2 rounded border border-red-900/50 shadow-md"
                              >
                                {/* 노래 정보 */}
                                <span className="flex-1 min-w-0 pr-2">
                                  <span className="text-white font-medium block truncate">
                                    {song.title}
                                  </span>
                                  <span className="text-gray-400 text-xs block">
                                    {song.artist}
                                  </span>
                                </span>

                                {/* 유사도 */}
                                <span className="text-red-300 font-bold text-sm shrink-0 pr-7 w-16 text-right">
                                  {(song.similarity * 100).toFixed(1)}%
                                </span>

                                {/* 유튜브 링크 */}
                                <button
                                  type="button"
                                  className="text-red-400 hover:underline text-sm font-semibold shrink-0 w-10 text-right"
                                  onClick={() =>
                                    openYouTubeMore({
                                      title: song.title,
                                      artist: song.artist,
                                      youtubeVideoId: song.youtubeVideoId,
                                    })
                                  }
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
        )}
      </div>
    </div>
  );
}
