"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  embedUrl?: string;
  autoPlay?: boolean;
  className?: string;
  aspectRatio?: string;
  onEnded?: () => void;
}

// Helper to detect YouTube embed or watch URL
function getYouTubeEmbedUrl(url?: string): string | null {
  if (!url) return null;
  if (url.includes("youtube.com/embed/")) return url;

  // youtu.be/xxxx
  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_\-]{11})/i);
  if (shortMatch) {
    return `https://www.youtube.com/embed/${shortMatch[1]}?autoplay=0&rel=0`;
  }

  // youtube.com/watch?v=xxxx or youtube.com/shorts/xxxx
  const longMatch = url.match(/youtube\.com\/(?:watch\?v=|shorts\/|live\/)([a-zA-Z0-9_\-]{11})/i);
  if (longMatch) {
    return `https://www.youtube.com/embed/${longMatch[1]}?autoplay=0&rel=0`;
  }

  return null;
}

export function VideoPlayer({
  src,
  poster,
  title,
  embedUrl,
  autoPlay = false,
  className,
  aspectRatio,
  onEnded,
}: VideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isDraggingSeek, setIsDraggingSeek] = useState(false);

  // Periksa apakah video berupa embed YouTube
  const youtubeEmbed = embedUrl || getYouTubeEmbedUrl(src);

  // Format detik ke format mm:ss (atau hh:mm:ss jika lebih dari 1 jam)
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

    if (h > 0) {
      return `${pad(h)}:${pad(m)}:${pad(s)}`;
    }
    return `${pad(m)}:${pad(s)}`;
  };

  // Toggle Play / Pause (Hanya via tombol Play/Pause)
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused || video.ended) {
      video.play().catch(() => {});
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  }, []);

  // Toggle Mute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isMuted) {
      video.muted = false;
      video.volume = volume || 1;
      setIsMuted(false);
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  };

  // Ubah Volume slider
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    if (videoRef.current) {
      videoRef.current.volume = newVol;
      videoRef.current.muted = newVol === 0;
      setIsMuted(newVol === 0);
    }
  };

  // Toggle Fullscreen
  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Siklus Kecepatan Putar (1x -> 1.25x -> 1.5x -> 2x -> 0.75x)
  const cyclePlaybackRate = () => {
    const rates = [1, 1.25, 1.5, 2, 0.75];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    setPlaybackRate(nextRate);
    if (videoRef.current) {
      videoRef.current.playbackRate = nextRate;
    }
  };

  // Toggle Loop
  const toggleLoop = () => {
    const nextLoop = !isLooping;
    setIsLooping(nextLoop);
    if (videoRef.current) {
      videoRef.current.loop = nextLoop;
    }
  };

  // Seek video berdasarkan posisi klik / drag progress bar
  const seekToPosition = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    const bar = progressBarRef.current;
    const video = videoRef.current;
    if (!bar || !video || !duration) return;

    const rect = bar.getBoundingClientRect();
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    video.currentTime = pos * duration;
    setCurrentTime(pos * duration);
  };

  const handleSeekPointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingSeek(true);
    seekToPosition(e);

    const onPointerMove = (moveEvent: MouseEvent) => {
      seekToPosition(moveEvent);
    };

    const onPointerUp = () => {
      setIsDraggingSeek(false);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
    };

    window.addEventListener("mousemove", onPointerMove);
    window.addEventListener("mouseup", onPointerUp);
  };

  // Auto hide controls saat mouse tidak aktif (idle 2.5s saat playing)
  const triggerActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 2500);
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    } else {
      triggerActivity();
    }
  }, [isPlaying, triggerActivity]);

  // Listener fullscreen change dari browser
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    document.addEventListener("webkitfullscreenchange", handleFsChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFsChange);
      document.removeEventListener("webkitfullscreenchange", handleFsChange);
    };
  }, []);

  // Update progress, duration, & buffer
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isDraggingSeek) {
      setCurrentTime(video.currentTime);
    }

    if (video.buffered.length > 0) {
      for (let i = video.buffered.length - 1; i >= 0; i--) {
        if (video.buffered.start(i) <= video.currentTime) {
          setBuffered(video.buffered.end(i));
          break;
        }
      }
    }
  };

  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (!video) return;
    setDuration(video.duration || 0);
    video.playbackRate = playbackRate;
    video.loop = isLooping;
  };

  const playedPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
  const bufferedPercent = duration > 0 ? (buffered / duration) * 100 : 0;

  // Jika URL adalah YouTube embed, render responsive iframe player
  if (youtubeEmbed) {
    return (
      <div
        className={cn(
          "relative w-full rounded-2xl overflow-hidden bg-black shadow-2xl border border-gray-800",
          aspectRatio || (src.includes("/shorts/") ? "aspect-[9/16] max-w-md mx-auto" : "aspect-video"),
          className
        )}
      >
        <iframe
          src={youtubeEmbed}
          title={title || "YouTube Video"}
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // HTML5 Custom Video Player untuk video direct MP4 / WebM / TikTok
  return (
    <div
      ref={containerRef}
      onMouseMove={triggerActivity}
      onMouseEnter={() => setShowControls(true)}
      onClick={triggerActivity}
      className={cn(
        "relative group bg-black rounded-2xl overflow-hidden select-none flex items-center justify-center",
        className
      )}
    >
      {/* HTML5 Video Element */}
      <video
        ref={videoRef}
        key={src}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        controls={false}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsBuffering(false);
          setIsPlaying(true);
        }}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => {
          setIsPlaying(false);
          setShowControls(true);
          onEnded?.();
        }}
        onClick={triggerActivity}
        className="w-full h-auto max-h-[580px] object-contain block cursor-default"
      />

      {/* Buffering Indicator */}
      {isBuffering && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 pointer-events-none">
          <div className="w-12 h-12 rounded-full border-3 border-[#00e599] border-t-transparent animate-spin"></div>
        </div>
      )}

      {/* Play Overlay Button */}
      {!isPlaying && (
        <button
          type="button"
          onClick={togglePlay}
          aria-label="Putar video"
          className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-200 z-10 active:scale-90 cursor-pointer shadow-2xl"
        >
          <i className="fa-solid fa-play ml-1 text-[#00e599] text-xl sm:text-2xl"></i>
        </button>
      )}

      {/* Custom Control Bar Overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-20 pt-10 pb-2.5 px-3 sm:px-4 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 flex flex-col space-y-2 pointer-events-auto",
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Timeline / Progress Scrub Bar */}
        <div
          ref={progressBarRef}
          onMouseDown={handleSeekPointerDown}
          className="relative h-2 sm:h-2.5 w-full flex items-center cursor-pointer group/seek py-1"
        >
          {/* Background Track */}
          <div className="w-full h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden relative group-hover/seek:h-2 transition-all">
            {/* Buffer Track */}
            <div
              style={{ width: `${bufferedPercent}%` }}
              className="absolute top-0 left-0 bottom-0 bg-white/35 rounded-full transition-all"
            />
            {/* Played Track */}
            <div
              style={{ width: `${playedPercent}%` }}
              className="absolute top-0 left-0 bottom-0 bg-[#00e599] rounded-full"
            />
          </div>

          {/* Scrub Thumb */}
          <div
            style={{ left: `${playedPercent}%` }}
            className="absolute w-3.5 h-3.5 rounded-full bg-white border-2 border-[#00e599] shadow-lg -translate-x-1/2 scale-0 group-hover/seek:scale-100 transition-transform pointer-events-none"
          />
        </div>

        {/* Action Controls Row */}
        <div className="flex items-center justify-between gap-2 text-white text-xs sm:text-sm">
          {/* Left Controls: Play/Pause, Volume, Time */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-white hover:text-[#00e599] active:scale-95 cursor-pointer"
              title={isPlaying ? "Jeda" : "Putar"}
              aria-label={isPlaying ? "Jeda video" : "Putar video"}
            >
              <i className={cn("text-sm", isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play")}></i>
            </button>

            {/* Volume Control & Slider */}
            <div className="flex items-center space-x-1.5 group/vol">
              <button
                type="button"
                onClick={toggleMute}
                className="w-8 h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-gray-300 hover:text-white active:scale-95 cursor-pointer"
                title={isMuted ? "Bunyikan" : "Bisukan"}
              >
                <i
                  className={cn(
                    "text-xs sm:text-sm",
                    isMuted || volume === 0
                      ? "fa-solid fa-volume-xmark text-red-400"
                      : volume < 0.5
                      ? "fa-solid fa-volume-low"
                      : "fa-solid fa-volume-high text-[#00e599]"
                  )}
                ></i>
              </button>

              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                aria-label="Volume video"
                className="w-14 sm:w-20 h-1 bg-white/20 accent-[#00e599] rounded-lg cursor-pointer transition-all"
              />
            </div>

            {/* Current Time / Duration Monospace Display */}
            <div className="text-[11px] sm:text-xs text-gray-300 font-mono tracking-tight shrink-0 select-none">
              <span className="text-white font-semibold">{formatTime(currentTime)}</span>
              <span className="text-gray-500 mx-1">/</span>
              <span className="text-gray-400">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed, Loop, Fullscreen */}
          <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
            {/* Playback Rate Badge Button */}
            <button
              type="button"
              onClick={cyclePlaybackRate}
              className="px-2 py-1 rounded-md text-[10px] sm:text-[11px] font-bold text-gray-300 hover:text-white hover:bg-white/10 border border-white/10 transition cursor-pointer active:scale-95"
              title="Kecepatan putar"
            >
              {playbackRate}x
            </button>

            {/* Loop Toggle Button */}
            <button
              type="button"
              onClick={toggleLoop}
              className={cn(
                "w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center transition active:scale-95 cursor-pointer text-xs",
                isLooping
                  ? "text-[#00e599] bg-[#00e599]/15"
                  : "text-gray-400 hover:text-white hover:bg-white/10"
              )}
              title={isLooping ? "Ulangi: Aktif" : "Ulangi: Nonaktif"}
            >
              <i className="fa-solid fa-repeat"></i>
            </button>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg hover:bg-white/10 flex items-center justify-center transition text-gray-300 hover:text-white active:scale-95 cursor-pointer text-xs sm:text-sm"
              title={isFullscreen ? "Keluar layar penuh (F)" : "Layar penuh (F)"}
            >
              <i className={cn(isFullscreen ? "fa-solid fa-compress" : "fa-solid fa-expand")}></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
