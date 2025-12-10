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


export async function requestRecommendation({
  youtubeUrl,
  instrument,
  startSec,
  endSec,
  userId, //선택? history때문에 일단은 넣어놨습니다.
}) {
  const res = await api.post("/music/recommend", {
    youtubeUrl,
    instrument,
    startSec,
    endSec,
    userId, 
  });

  return res.data;
}