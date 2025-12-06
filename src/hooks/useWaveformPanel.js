/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useRef, useState } from "react";

export function useWaveformPanel({
  audioUrl,
  duration,
  selectionStart,
  selectionEnd,
  onChangeStart,
  onChangeEnd,
  onTrimSection,
}) {
  const audioRef = useRef(null);

  // 전체 파형
  const waveformCanvasRef = useRef(null);
  const [peaks, setPeaks] = useState([]);

  // 수정된 파형
  const trimCanvasRef = useRef(null);
  const [trimPeaks, setTrimPeaks] = useState([]);
  const [showTrimPreview, setShowTrimPreview] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);

  const selectionDuration = Math.max(0, selectionEnd - selectionStart);

  // 음원 총길이 파형 계산
  useEffect(() => {
    if (!audioUrl) {
      setPeaks([]);
      setTrimPeaks([]);
      setShowTrimPreview(false);
      return;
    }

    let cancelled = false;

    const loadWaveform = async () => {
      try {
        const res = await fetch(audioUrl);
        const arrayBuffer = await res.arrayBuffer();

        const AudioCtx =
          window.AudioContext || window.webkitAudioContext || null;
        if (!AudioCtx) return;

        const audioCtx = new AudioCtx();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);

        if (cancelled) {
          audioCtx.close();
          return;
        }

        const rawData = audioBuffer.getChannelData(0);
        const sampleCount = 400; // 막대 개수
        const blockSize = Math.max(1, Math.floor(rawData.length / sampleCount));
        const nextPeaks = [];

        for (let i = 0; i < sampleCount; i += 1) {
          let sum = 0;
          for (let j = 0; j < blockSize; j += 1) {
            const idx = i * blockSize + j;
            sum += Math.abs(rawData[idx] || 0);
          }
          nextPeaks.push(sum / blockSize);
        }

        setPeaks(nextPeaks);
        setTrimPeaks([]);
        setShowTrimPreview(false);

        audioCtx.close();
      } catch (e) {
        console.error("파형 분석 실패:", e);
        setPeaks([]);
        setTrimPeaks([]);
        setShowTrimPreview(false);
      }
    };

    loadWaveform();

    return () => {
      cancelled = true;
    };
  }, [audioUrl]);

  // 전체 파형
  useEffect(() => {
    const canvas = waveformCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 100;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, width, height);

    if (!peaks || peaks.length === 0) {
      ctx.fillStyle = "#404040";
      const midY = height / 2;
      ctx.fillRect(0, midY - 1, width, 2);
      return;
    }

    const maxPeak = Math.max(...peaks) || 1;
    const barWidth = width / peaks.length;
    const midY = height / 2;

    const startRatio =
      duration > 0 ? Math.max(0, selectionStart / duration) : 0;
    const endRatio =
      duration > 0 ? Math.min(1, selectionEnd / duration) : 1;

    peaks.forEach((peak, i) => {
      const amp = peak / maxPeak;
      const barHeight = amp * (height - 12);
      const x = i * barWidth;
      const y = midY - barHeight / 2;
      const progress = i / peaks.length;
      const inSelection = progress >= startRatio && progress <= endRatio;

      ctx.fillStyle = inSelection ? "#ff2738" : "#404040";
      ctx.fillRect(x, y, Math.max(1, barWidth * 0.8), barHeight);
    });
  }, [peaks, duration, selectionStart, selectionEnd]);

  // 잘려진 음원 길이 계산
  useEffect(() => {
    if (!showTrimPreview || !peaks.length || duration <= 0) {
      const canvas = trimCanvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext("2d");
        if (ctx) {
          const { width, height } = canvas;
          ctx.clearRect(0, 0, width, height);
        }
      }
      return;
    }

    const startRatio =
      duration > 0 ? Math.max(0, selectionStart / duration) : 0;
    const endRatio =
      duration > 0 ? Math.min(1, selectionEnd / duration) : 1;

    const startIndex = Math.floor(startRatio * peaks.length);
    const endIndex = Math.max(
      startIndex + 1,
      Math.floor(endRatio * peaks.length)
    );

    const slice = peaks.slice(startIndex, endIndex);
    setTrimPeaks(slice);
  }, [showTrimPreview, peaks, duration, selectionStart, selectionEnd]);

  // 잘려진부분 그리기
  useEffect(() => {
    const canvas = trimCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = rect.width || 600;
    const height = rect.height || 60;

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    ctx.clearRect(0, 0, width, height);

    if (!showTrimPreview || !trimPeaks.length) {
      return;
    }

    ctx.fillStyle = "#101010";
    ctx.fillRect(0, 0, width, height);

    const maxPeak = Math.max(...trimPeaks) || 1;
    const barWidth = width / trimPeaks.length;
    const midY = height / 2;

    trimPeaks.forEach((peak, i) => {
      const amp = peak / maxPeak;
      const barHeight = amp * (height - 10);
      const x = i * barWidth;
      const y = midY - barHeight / 2;

      ctx.fillStyle = "#ff2738";
      ctx.fillRect(x, y, Math.max(1, barWidth * 0.8), barHeight);
    });
  }, [trimPeaks, showTrimPreview]);

  // 잘려진 구간만 재생
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      if (audio.currentTime >= selectionEnd) {
        audio.pause();
        audio.currentTime = selectionEnd;
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [selectionEnd]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  const handlePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.currentTime = selectionStart || 0;
      audio.play();
      setIsPlaying(true);
    }
  };

  const handleTrimClick = () => {
    setShowTrimPreview(true);
    if (onTrimSection) onTrimSection();
  };

  // 분/초 UI는 따로, 초로 계산
  const startMin = Math.floor((selectionStart || 0) / 60);
  const startSec = Math.floor((selectionStart || 0) % 60);
  const endMin = Math.floor((selectionEnd || 0) / 60);
  const endSec = Math.floor((selectionEnd || 0) % 60);

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const handleStartMinChange = (e) => {
    const nextMin = Math.max(0, parseInt(e.target.value || "0", 10));
    const total = nextMin * 60 + startSec;
    const clamped = clamp(total, 0, duration || 0);
    const safe = Math.min(clamped, selectionEnd);
    onChangeStart?.(safe);
  };

  const handleStartSecChange = (e) => {
    let nextSec = Math.max(0, parseInt(e.target.value || "0", 10));
    if (nextSec >= 60) nextSec = 59;
    const total = startMin * 60 + nextSec;
    const clamped = clamp(total, 0, duration || 0);
    const safe = Math.min(clamped, selectionEnd);
    onChangeStart?.(safe);
  };

  const handleEndMinChange = (e) => {
    const nextMin = Math.max(0, parseInt(e.target.value || "0", 10));
    const total = nextMin * 60 + endSec;
    const clamped = clamp(total, 0, duration || 0);
    const safe = Math.max(clamped, selectionStart);
    onChangeEnd?.(safe);
  };

  const handleEndSecChange = (e) => {
    let nextSec = Math.max(0, parseInt(e.target.value || "0", 10));
    if (nextSec >= 60) nextSec = 59;
    const total = endMin * 60 + nextSec;
    const clamped = clamp(total, 0, duration || 0);
    const safe = Math.max(clamped, selectionStart);
    onChangeEnd?.(safe);
  };

  return {
    audioRef,
    waveformCanvasRef,
    trimCanvasRef,
    showTrimPreview,
    selectionDuration,
    isPlaying,
    volume,
    setVolume,
    startMin,
    startSec,
    endMin,
    endSec,
    handlePlayPause,
    handleTrimClick,
    handleStartMinChange,
    handleStartSecChange,
    handleEndMinChange,
    handleEndSecChange,
  };
}
