import { useState, useCallback, useEffect } from "react";
import { requestRecommendation } from "../api/musicApi.js";
import { userStore } from "../store/userStore.js";

const PART_TO_INSTRUMENT = {
  vocal: "vocals",
  drum: "drums",
  bass: "bass",
  melody: "piano",
};

const TOAST_HIDE_MS = 4000;

const DEFAULT_TOPK = 5;
const MIN_TOPK = 1;
const MAX_TOPK = 50;

function clampTopK(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return DEFAULT_TOPK;
  const int = Math.floor(n);
  return Math.max(MIN_TOPK, Math.min(MAX_TOPK, int));
}

export default function useTrackPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState(0); // 전체 길이(초)

  // 선택 구간 (초 단위)
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(30);

  // 보컬/드럼/베이스/멜로디
  const [selectedParts, setSelectedParts] = useState(["vocal"]);

  // 추천 개수
  const [recommendCount, setRecommendCount] = useState(DEFAULT_TOPK);

  // 추천 결과
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  // 상단 토스트 메시지
  const [splitToast, setSplitToast] = useState("");

  // 파트 분리 시작 로딩
  const [isProcessingForPartSelector, setIsProcessingForPartSelector] =
    useState(false);

  // 분/초 값
  const startMin = Math.floor(selectionStart / 60);
  const startSec = Math.floor(selectionStart % 60);
  const endMin = Math.floor(selectionEnd / 60);
  const endSec = Math.floor(selectionEnd % 60);

  // 추천 개수 입력
  const handleRecommendCountChange = useCallback((value) => {
    setRecommendCount(clampTopK(value));
  }, []);

  //링크 적용
  const setVideoFromLink = useCallback((url) => {
    setVideoUrl(url);
    setDuration(0);
    setSelectionStart(0);
    setSelectionEnd(30);
    setRecommendedTracks([]);

    setSplitToast("유튜브 링크가 적용되었습니다.");
    setTimeout(() => setSplitToast(""), 2000);
  }, []);

  // YouTube IFrame API 영상 길이 자동으로 가져오기
  useEffect(() => {
    if (!videoUrl) return;

    let player = null;

    const createPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      player = new window.YT.Player("youtube-main-player", {
        events: {
          onReady: (event) => {
            const tryGetDuration = () => {
              const dur = event.target.getDuration();
              if (dur && dur > 0) {
                const d = Number(dur);
                setDuration(d);
                setSelectionStart(0);
                setSelectionEnd(Math.min(30, d));
              } else {
                setTimeout(tryGetDuration, 1000);
              }
            };
            tryGetDuration();
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      window.onYouTubeIframeAPIReady = () => {
        createPlayer();
      };
      document.body.appendChild(tag);
    }

    return () => {
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [videoUrl]);

  // URL 초기 값 세팅
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const encoded = params.get("data");
      if (!encoded) return;

      const decoded = decodeURIComponent(encoded);
      const payload = JSON.parse(decoded);

      if (!payload || !payload.videoUrl) return;

      const url = payload.videoUrl;
      const d = Number(payload.durationSeconds);

      setVideoUrl(url);

      if (Number.isFinite(d) && d > 0) {
        setDuration(d);
        setSelectionStart(0);
        setSelectionEnd(Math.min(30, d));
      } else {
        setDuration(0);
        setSelectionStart(0);
        setSelectionEnd(30);
      }

      setRecommendedTracks([]);

      setSplitToast("외부에서 곡 정보가 전달되었습니다.");
      setTimeout(() => setSplitToast(""), 2000);
    } catch (err) {
      console.error("초기 data 파라미터 파싱 실패:", err);
    }
  }, []);

  // 시작/종료 시간
  const handleStartMinChange = useCallback(
    (value) => {
      const m = Number(value);
      if (!Number.isFinite(m) || m < 0) return;
      const total = m * 60 + startSec;

      const clamped =
        duration > 0
          ? Math.max(0, Math.min(total, duration))
          : Math.max(0, total);

      setSelectionStart(clamped);
    },
    [startSec, duration]
  );

  const handleStartSecChange = useCallback(
    (value) => {
      let s = Number(value);
      if (!Number.isFinite(s) || s < 0) return;
      if (s >= 60) s = 59;

      const total = startMin * 60 + s;

      const clamped =
        duration > 0
          ? Math.max(0, Math.min(total, duration))
          : Math.max(0, total);

      setSelectionStart(clamped);
    },
    [startMin, duration]
  );

  const handleEndMinChange = useCallback(
    (value) => {
      const m = Number(value);
      if (!Number.isFinite(m) || m < 0) return;
      const total = m * 60 + endSec;

      const clamped =
        duration > 0
          ? Math.max(0, Math.min(total, duration))
          : Math.max(0, total);

      setSelectionEnd(clamped);
    },
    [endSec, duration]
  );

  const handleEndSecChange = useCallback(
    (value) => {
      let s = Number(value);
      if (!Number.isFinite(s) || s < 0) return;
      if (s >= 60) s = 59;

      const total = endMin * 60 + s;

      const clamped =
        duration > 0
          ? Math.max(0, Math.min(total, duration))
          : Math.max(0, total);

      setSelectionEnd(clamped);
    },
    [endMin, duration]
  );

  // 파트 선택 토글
  const handleTogglePart = useCallback((partId) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  }, []);

  // 유튜브 링크 , 구간 , 파트 요청
  const handleStartSplit = useCallback(async () => {
    if (!videoUrl) {
      alert("먼저 유튜브 링크를 설정해 주세요.");
      return;
    }

    if (!duration || duration <= 0) {
      alert("영상 길이를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    if (selectionEnd <= selectionStart) {
      alert("시작/종료 시간을 올바르게 입력해 주세요.");
      return;
    }

    if (selectedParts.length === 0) {
      alert("최소 1개 이상의 파트를 선택해 주세요.");
      return;
    }

    const topK = clampTopK(recommendCount);

    setIsProcessingForPartSelector(true);
    setSplitToast("AI가 유사한 음악을 추천 중입니다...");

    try {
      const store = userStore.getState();
      const userId =
        typeof store.getUserIdForApi === "function"
          ? store.getUserIdForApi()
          : null;

      const startSecVal = selectionStart;
      const endSecVal = selectionEnd;

      const allResults = [];

      // 선택된 각 파트 추천 요청
      for (const partId of selectedParts) {
        const instrument = PART_TO_INSTRUMENT[partId];
        if (!instrument) continue;

        // instrument 배열형태로 ,topK 전달
        const res = await requestRecommendation({
          youtubeUrl: videoUrl,
          instrument: [instrument],
          startSec: startSecVal,
          endSec: endSecVal,
          topK,
          userId,
        });

        const rawList = res?.results || res?.recommendations || res || [];

        const normalized = rawList.map((item, index) => {
          const start = item.startSec ?? item.start_sec ?? startSecVal;
          const end = item.endSec ?? item.end_sec ?? endSecVal;

          const dur =
            item.durationSeconds ??
            (Number(end) - Number(start) || endSecVal - startSecVal);

          const instValue = item.instrument ?? instrument;
          const instNormalized = Array.isArray(instValue) ? instValue[0] : instValue;

          return {
            id: item.id ?? `${partId}-${index}`,

            //아이콘 매칭
            partId,

            title:
              item.title ||
              item.songName ||
              item.song_name ||
              "제목 정보 없음",
            artist: item.artist || "아티스트 정보 없음",
            similarity: item.similarity ?? null,

            // 문자열 형태
            instrument: instNormalized || instrument,

            startSec: start,
            endSec: end,
            durationSeconds: dur,
            albumCoverUrl: item.albumCoverUrl || item.album_cover_url || null,
            youtubeVideoId: item.youtubeVideoId || item.youtube_video_id || null,
          };
        });

        allResults.push(...normalized);
      }

  
      const topN = allResults
        .slice()
        .sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0))
        .slice(0, topK);

      setRecommendedTracks(topN);
      setSplitToast("추천 결과가 생성되었습니다.");
    } catch (err) {
      console.error("추천 요청 중 오류:", err);
      setSplitToast("추천 요청 중 오류가 발생했습니다.");
    } finally {
      setIsProcessingForPartSelector(false);
      setTimeout(() => setSplitToast(""), TOAST_HIDE_MS);
    }
  }, [
    videoUrl,
    duration,
    selectionStart,
    selectionEnd,
    selectedParts,
    recommendCount,
  ]);

  return {
    videoUrl,
    duration,
    selectionStart,
    selectionEnd,
    startMin,
    startSec,
    endMin,
    endSec,
    splitToast,
    selectedParts,
    recommendedTracks,
    isProcessingForPartSelector,

    
    recommendCount,
    handleRecommendCountChange,

    setVideoFromLink,
    handleStartMinChange,
    handleStartSecChange,
    handleEndMinChange,
    handleEndSecChange,
    handleTogglePart,
    handleStartSplit,
  };
}
