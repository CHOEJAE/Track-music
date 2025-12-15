import api from "./client";

// 파일 업로드 , 분리 세션 생성
export async function uploadMusicFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/music/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

// 분리 세션 상태 조회
export async function getSeparationSession(sessionId) {
  const res = await api.get(`/music/session/${sessionId}`);
  return res.data;
}

// 추천 요청
export async function requestRecommendation({
  youtubeUrl,
  instrument, 
  startSec,
  endSec,
  userId,
  topK, //없을시, 기본값
}) {
  const instrumentArray = Array.isArray(instrument)
    ? instrument
    : typeof instrument === "string"
    ? [instrument]
    : [];

//공백 제거
  const normalizedInstrument = instrumentArray
    .map((v) => String(v).trim().toLowerCase())
    .filter(Boolean);

  const payload = {
    youtubeUrl,
    instrument: normalizedInstrument, // 서버측 형태:  string[]
    startSec: Number(startSec),
    endSec: Number(endSec),
    userId,
  };

  if (topK !== undefined && topK !== null) {
    payload.topK = Number(topK);
  }

  const res = await api.post("/music/recommend", payload);
  return res.data;
}
