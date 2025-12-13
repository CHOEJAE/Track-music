import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import { userStore } from "../store/userStore";
import { MOCK_HISTORY } from "../components/mockHistory"; // 임시 히스토리 데이터

const HISTORY_URL = import.meta.env.VITE_API_BASE_URL + "/api/history/user";

export default function HistoryPage() {
  const getUserIdForApi = userStore((state) => state.getUserIdForApi);
  const nickname = userStore((state) => state.nickname);
  const token = userStore((state) => state.accessToken);

  const [history, setHistory] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userIdForApi = getUserIdForApi();

    const fetchHistory = async () => {
      setLoading(true);

      // 로그인 정보 없으면 MOCK 바로 사용
      if (!userIdForApi || !token) {
        console.log("로그인 정보 없음. MOCK 데이터 사용");
        setHistory(MOCK_HISTORY);
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
        console.error("히스토리 불러오기 실패. MOCK 데이터 대체", error);
        setHistory(MOCK_HISTORY);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [getUserIdForApi, token]);

  const toggleRow = (index) => {
    setExpandedRow((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-red-500 text-lg font-medium">
        히스토리 불러오는 중...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-red-500 mb-2 pb-2 border-b border-red-700">
          {nickname}님의 이용 기록
        </h1>

        {history.length === 0 ? (
          <div className="bg-zinc-900 border-l-4 border-red-600 p-6 rounded-lg mt-8 text-gray-300">
            <p className="font-medium">
              {nickname}님, 아직 이용 기록이 없습니다.
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
                    YouTube
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
                {history.map((item) => (
                  <Fragment key={item.index}>
                    <tr className="border-b border-zinc-800 hover:bg-zinc-800 transition duration-150">
                      <td className="px-4 py-3 text-sm">{item.index}</td>
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
                        {item.createdAt}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => toggleRow(item.index)}
                          className="text-sm text-red-400 hover:text-red-300 transition duration-150"
                        >
                          {expandedRow === item.index ? "접기 ▲" : "펼치기 ▼"}
                        </button>
                      </td>
                    </tr>

                    {expandedRow === item.index && (
                      <tr className="bg-zinc-950/70">
                        <td colSpan={6} className="px-6 py-4">
                          <h3 className="text-red-400 font-semibold mb-3 border-b border-zinc-800 pb-2">
                            추천 결과
                          </h3>
                          <ul className="space-y-2">
                            {/* item.results.recommendedSongs만 사용 */}
                            {item.results.recommendedSongs.map((song, idx) => (
                              <li
                                key={idx}
                                className="flex justify-between bg-zinc-900 px-4 py-2 rounded border border-red-900/50 shadow-md"
                              >
                                <span>
                                  <span className="text-white font-medium">
                                    {song.title}
                                  </span>
                                  <span className="text-gray-400">
                                    {" "}
                                    - {song.artist}
                                  </span>
                                </span>
                                <a
                                  href={song.link}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-red-400 hover:underline text-sm font-semibold"
                                >
                                  듣기
                                </a>
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
