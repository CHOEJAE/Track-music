import { useEffect, useState, useCallback } from "react";
import {
  uploadMusicFile,
  getSeparationSession,
  requestRecommendation,
} from "../api/musicApi.js";
import { userStore } from "../store/userStore.js";

const POLL_INTERVAL_MS = 2500;

const PART_TO_INSTRUMENT = {
  vocal: "vocals",
  drum: "drums",
  bass: "bass",
  melody: "piano",
};

export default function useTrackPage() {
  // 업로드 관련
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [duration, setDuration] = useState(0);

  // 선택 구간
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);

  // 분리 세션, 상태 확인
  const [sessionId, setSessionId] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSeparating, setIsSeparating] = useState(false);
  const [splitToast, setSplitToast] = useState("");

  // 파트 선택
  const [selectedParts, setSelectedParts] = useState(["vocal"]);

  // 유사한 음악 추천칸
  const [recommendedTracks, setRecommendedTracks] = useState([]);

  // 유저 정보 (로그인 되면 userId 사용 외에값은 null/0) 예상
  const { getUserIdForApi } = userStore();

  // 오디오 데이터
  useEffect(() => {
    if (!audioUrl) {
      setDuration(0);
      setSelectionStart(0);
      setSelectionEnd(0);
      return;
    }

    const audio = new Audio();
    audio.src = audioUrl;

    const handleLoaded = () => {
      const dur = Number.isFinite(audio.duration) ? audio.duration : 0;
      setDuration(dur);
      setSelectionStart(0);
      setSelectionEnd(dur);
    };

    audio.addEventListener("loadedmetadata", handleLoaded);
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoaded);
      audio.src = "";
    };
  }, [audioUrl]);

  // 잘린구간 상태
  const pollSeparationSession = useCallback(
    async (currentSessionId) => {
      if (!currentSessionId) return;

      setIsSeparating(true);
      try {
        while (true) {
          const data = await getSeparationSession(currentSessionId);

          if (data.status === "completed") {
            setSplitToast(
              "음원 분리가 완료되었습니다. 하이라이트 구간을 선택해 주세요!"
            );
            break;
          }

          if (data.status === "failed") {
            setSplitToast(
              "음원 분리에 실패했습니다. 다른 파일로 다시 시도해 주세요."
            );
            break;
          }

          await new Promise((resolve) =>
            setTimeout(resolve, POLL_INTERVAL_MS)
          );
        }
      } catch (e) {
        console.error(e);
        setSplitToast("세션 상태 확인 중 오류가 발생했습니다.");
      } finally {
        setIsSeparating(false);
        setTimeout(() => setSplitToast(""), 4000);
      }
    },
    []
  );

  //파일 선택 시, 프론트 상태 세팅으로 백엔드쪽 업로드
  const handleFileSelect = async (selectedFile) => {
    if (!selectedFile) return;

    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }

    const objectUrl = URL.createObjectURL(selectedFile);

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setAudioUrl(objectUrl);
    setSessionId(null);
    setRecommendedTracks([]);
    setSplitToast("");

    try {
      setIsUploading(true);
      const {
        status,
        sessionId: newSessionId,
        message,
      } = await uploadMusicFile(selectedFile);

      if (status !== "success" || !newSessionId) {
        console.error("업로드 실패:", message);
        alert("음원 업로드에 실패했습니다.");
        return;
      }

      setSessionId(newSessionId);
      setSplitToast("AI가 음원을 분리 중입니다.");

      await pollSeparationSession(newSessionId);
    } catch (err) {
      console.error(err);
      alert("서버와 통신 중 오류가 발생했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  //PartSelector 파트 
  const handleTogglePart = (partId) => {
    setSelectedParts((prev) =>
      prev.includes(partId)
        ? prev.filter((id) => id !== partId)
        : [...prev, partId]
    );
  };

  //파트 분리 기반 추천 시작 버튼 부분
  const handleStartSplit = async () => {
    if (!sessionId) {
      alert("먼저 음원을 업로드해서 분리 세션을 만든 뒤 시도해 주세요.");
      return;
    }

    if (!duration || selectionEnd <= selectionStart) {
      alert("유효한 하이라이트 구간을 먼저 선택해 주세요.");
      return;
    }

    const primaryPart = selectedParts[0] || "vocal";
    const instrument = PART_TO_INSTRUMENT[primaryPart] || "vocals";

    const userId = getUserIdForApi();

    try {
      setIsSeparating(true);
      setSplitToast("추천 음악을 찾고 있습니다…");

      const { status, results } = await requestRecommendation({
        sessionId,
        userId,
        instrument,
        startSec: selectionStart,
        endSec: selectionEnd,
      });

      if (status !== "success" || !Array.isArray(results)) {
        alert("추천 결과를 가져오지 못했습니다.");
        return;
      }

      const mapped = results.map((item, idx) => {
        const start = item.startSec ?? item.start_sec ?? 0;
        const end = item.endSec ?? item.end_sec ?? 0;
        const dur = Math.max(0, end - start);

        return {
          id: item.id ?? idx,
          title: item.title ?? item.songName ?? "제목 미상",
          artist: item.artist ?? "알 수 없음",
          durationSeconds: dur,
          similarity: item.similarity ?? 0,
        };
      });

      setRecommendedTracks(mapped);
      setSplitToast("추천 결과가 준비되었습니다.");
    } catch (e) {
      console.error(e);
      alert("추천 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSeparating(false);
      setTimeout(() => setSplitToast(""), 4000);
    }
  };

  // PartSelector쪽으로 넘겨줄 상태
  const isProcessingForPartSelector = isSeparating || !sessionId;

  return {
    file,
    fileName,
    audioUrl,
    duration,
    selectionStart,
    selectionEnd,
    isUploading,
    isSeparating,
    splitToast,
    selectedParts,
    recommendedTracks,

    isProcessingForPartSelector,


    handleFileSelect,
    handleTogglePart,
    handleStartSplit,
    setSelectionStart,
    setSelectionEnd,
  };
}
