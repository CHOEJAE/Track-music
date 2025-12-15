/* eslint-disable no-unused-vars */
import { useCallback } from "react";

const YT_SEARCH_ENDPOINT = "https://www.googleapis.com/youtube/v3/search";

function pickBestYouTubeVideo(items) {
  if (!Array.isArray(items) || items.length === 0) return null;

  let best = null;
  let bestScore = -Infinity;

  for (const it of items) {
    const videoId = it?.id?.videoId;
    const title = String(it?.snippet?.title ?? "").toLowerCase();
    const channel = String(it?.snippet?.channelTitle ?? "").toLowerCase();
    if (!videoId) continue;

    // 점수제로 해서 해당 영상이 공식영상일 가능성을 판단하고 계산
    // 만약 공식 음원이 아닐경우, 점수제로 낮춰서 해당 영상을 선택x
    let score = 0;
    if (title.includes("official video")) score += 6;
    if (title.includes("official audio")) score += 5;
    if (title.includes("provided to youtube")) score += 4;
    if (channel.includes("topic")) score += 3;
    if (channel.includes("vevo")) score += 2;

    if (title.includes("lyrics")) score -= 1;
    if (title.includes("cover")) score -= 2;
    if (title.includes("live")) score -= 1;

    if (score > bestScore) {
      bestScore = score;
      best = videoId;
    }
  }

  return best;
}

async function findYouTubeVideoIdBySearch(query, apiKey) {
  if (!apiKey) return null;

  const q = encodeURIComponent(query);
  const url =
    `${YT_SEARCH_ENDPOINT}?part=snippet&type=video&maxResults=5&videoCategoryId=10` +
    `&q=${q}&key=${encodeURIComponent(apiKey)}`;

  const res = await fetch(url);
  if (!res.ok) return null;

  const data = await res.json();
  const items = data?.items ?? [];
  return pickBestYouTubeVideo(items) || items?.[0]?.id?.videoId || null;
}

export default function useYouTubeMore() {
  const openYouTubeMore = useCallback(async ({ title, artist, youtubeVideoId }) => {
    const open = (url) => {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      //무시
    };

    //videoId 있으면 즉시 영상 재생
    if (youtubeVideoId) {
      open(`https://www.youtube.com/watch?v=${youtubeVideoId}`);
      return;
    }

    //없으면 검색으로 찾기
    const query = `${title || ""} ${artist || ""}`.trim();
    if (!query) {
      open("https://www.youtube.com/");
      return;
    }

    const fallback = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

    try {
      const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
      const found = await findYouTubeVideoIdBySearch(query, apiKey);

      if (found) open(`https://www.youtube.com/watch?v=${found}`);
      else open(fallback);
    } catch {
      open(fallback);
    }
  }, []);

  return { openYouTubeMore };
}
