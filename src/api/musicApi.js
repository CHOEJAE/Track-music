
import api from "./client";

//파일 업로드 ,분리 세션 생성
export async function uploadMusicFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/music/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
}

//분리 세션 상태 조회
export async function getSeparationSession(sessionId) {
  const res = await api.get(`/music/session/${sessionId}`);

  return res.data;
}

//추천 요청
export async function requestRecommendation({
  sessionId,
  userId,
  instrument,    
  startSec,
  endSec,
}) {
  const res = await api.post("/music/recommend", {
    sessionId,
    userId,
    instrument,
    startSec,
    endSec,
  });


  return res.data;
}
