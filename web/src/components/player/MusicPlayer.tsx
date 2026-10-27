"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  PLAYLIST,
  Track,
  getFallbackLyrics,
  parseLrcLyrics,
  LyricLine,
} from "./lyricsData";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Height tracking to lock Tab Lirik exactly to Tab Lagu height without jumping
  const [desktopPlayerHeight, setDesktopPlayerHeight] = useState<number>(580);
  const [modalPlayerHeight, setModalPlayerHeight] = useState<number>(580);
  const desktopPlayerRef = useRef<HTMLDivElement>(null);
  const modalPlayerRef = useRef<HTMLDivElement>(null);
  const desktopLyricsRef = useRef<HTMLDivElement>(null);
  const modalLyricsRef = useRef<HTMLDivElement>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);
  // Safe fallbacks to prevent any client caching ReferenceErrors
  const lyricsContainerRef = desktopLyricsRef;
  const activeLyricRef = useRef<HTMLDivElement | null>(null);

  // Playlist state
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const currentTrack = PLAYLIST[currentTrackIndex];

  // Dynamic Lyrics state fetched from LRCLIB.net (with default fallback)
  const [lyrics, setLyrics] = useState<LyricLine[]>(() =>
    getFallbackLyrics(PLAYLIST[0].id)
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(PLAYLIST[0].duration);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [activeTab, setActiveTab] = useState<"player" | "lyrics">("player");
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMiniPlayerVisible, setIsMiniPlayerVisible] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Auto-hide mini player during scroll on mobile, reappear after 3s of idle or when reaching top/bottom
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileModalOpen) return;

      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const viewportHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;
      const isAtTop = scrollY <= 15;
      const isAtBottom = scrollY + viewportHeight >= fullHeight - 20;

      // When reaching top or bottom of the page, show mini player immediately
      if (isAtTop || isAtBottom) {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current);
        }
        setIsMiniPlayerVisible(true);
        return;
      }

      // Hide mini player while scrolling
      setIsMiniPlayerVisible(false);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Reappear after 1 second of stopping scroll
      scrollTimeoutRef.current = setTimeout(() => {
        setIsMiniPlayerVisible(true);
      }, 1000);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isMobileModalOpen]);

  // Broadcast mini player visibility to other components (e.g. CommentDrawer FAB)
  useEffect(() => {
    const isVisible = isMiniPlayerVisible && !isMobileModalOpen;
    if (typeof window !== "undefined") {
      (window as any).__isMiniPlayerVisible = isVisible;
      window.dispatchEvent(
        new CustomEvent("miniPlayerVisibility", {
          detail: isVisible,
        })
      );
    }
  }, [isMiniPlayerVisible, isMobileModalOpen]);

  // Prevent any horizontal and vertical scroll on the background page when mobile modal is open
  useEffect(() => {
    if (isMobileModalOpen) {
      const prevBodyOverflow = document.body.style.overflow;
      const prevHtmlOverflow = document.documentElement.style.overflow;
      const prevTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        document.body.style.overflow = prevBodyOverflow;
        document.documentElement.style.overflow = prevHtmlOverflow;
        document.body.style.touchAction = prevTouchAction;
      };
    }
  }, [isMobileModalOpen]);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Synchronize canvas video playback with audio play/pause state
  useEffect(() => {
    const vids = [desktopVideoRef.current, modalVideoRef.current].filter(Boolean) as HTMLVideoElement[];
    vids.forEach((v) => {
      if (isPlaying && currentTrack.video) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    });
  }, [isPlaying, currentTrack.video, isMobileModalOpen]);

  // Fetch synced lyrics from LRCLIB API with timestamps for the active track
  useEffect(() => {
    // 1. Immediately apply fallback lyrics to avoid blank screen
    setLyrics(getFallbackLyrics(currentTrack.id));
    setCurrentLyricIndex(0);
    setCurrentTime(0);
    setDuration(currentTrack.duration);

    // 2. Fetch fresh synced lyrics from LRCLIB
    let isMounted = true;
    async function fetchTrackLyrics() {
      try {
        const query = `track=${encodeURIComponent(currentTrack.title)}&artist=${encodeURIComponent(currentTrack.artist)}&duration=${currentTrack.duration}`;
        const res = await fetch(`/api/lyrics?${query}`);
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.lyrics && data.lyrics.length > 0) {
            setLyrics(data.lyrics);
            return;
          }
        }

        // Direct client-side fetch from LRCLIB
        const directRes = await fetch(
          `https://lrclib.net/api/search?track_name=${encodeURIComponent(currentTrack.title)}&artist_name=${encodeURIComponent(currentTrack.artist)}`
        );
        if (directRes.ok) {
          const directData = await directRes.json();
          if (Array.isArray(directData)) {
            const match = directData.find((item: { syncedLyrics?: string }) => Boolean(item.syncedLyrics));
            if (match?.syncedLyrics) {
              const parsed = parseLrcLyrics(match.syncedLyrics, currentTrack.duration);
              if (isMounted && parsed.length > 0) {
                setLyrics(parsed);
              }
            }
          }
        }
      } catch (err) {
        console.warn("Using built-in synced lyrics fallback:", err);
      }
    }

    fetchTrackLyrics();

    // 3. Update audio source and play if already playing
    if (audioRef.current) {
      audioRef.current.src = currentTrack.src;
      audioRef.current.load();
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log("Play interrupted:", e));
      }
    }

    return () => {
      isMounted = false;
    };
  }, [currentTrackIndex]);

  // Sync current lyric index as audio plays
  useEffect(() => {
    if (!lyrics || lyrics.length === 0) return;
    let matchIdx = -1;
    for (let i = 0; i < lyrics.length; i++) {
      const item = lyrics[i];
      const nextItem = lyrics[i + 1];
      const start = item.startTime;
      const end = nextItem ? nextItem.startTime : item.endTime;
      if (currentTime >= start && currentTime < end) {
        matchIdx = i;
        break;
      }
    }

    if (matchIdx === -1 && currentTime >= lyrics[lyrics.length - 1].startTime) {
      matchIdx = lyrics.length - 1;
    }

    if (matchIdx !== -1 && matchIdx !== currentLyricIndex) {
      setCurrentLyricIndex(matchIdx);
    }
  }, [currentTime, currentLyricIndex, lyrics]);

  // Observe and measure Tab Lagu height on both desktop and mobile modal
  useEffect(() => {
    const observeRef = (
      el: HTMLDivElement | null,
      setHeight: (h: number) => void
    ) => {
      if (!el) return null;
      const obs = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const h = entry.borderBoxSize?.[0]?.blockSize || entry.contentRect.height;
          if (h > 50) setHeight(Math.round(h));
        }
      });
      obs.observe(el);
      return obs;
    };

    const dObs = observeRef(desktopPlayerRef.current, setDesktopPlayerHeight);
    const mObs = observeRef(modalPlayerRef.current, setModalPlayerHeight);

    return () => {
      dObs?.disconnect();
      mObs?.disconnect();
    };
  }, [isMobileModalOpen, activeTab]);

  // Auto-scroll active lyric in full lyrics tab
  useEffect(() => {
    if (activeTab === "lyrics") {
      const container = isMobileModalOpen ? modalLyricsRef.current : desktopLyricsRef.current;
      const activeEl = container?.querySelector('[data-active-lyric="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentLyricIndex, activeTab, isMobileModalOpen]);

  // Audio Event Listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || currentTrack.duration);
      audioRef.current.volume = volume;
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Playback prevented:", err));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (audioRef.current) {
      audioRef.current.currentTime = seekTime;
    }
  };

  const handleLyricClick = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
      if (!isPlaying) {
        audioRef.current.play().then(() => setIsPlaying(true));
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    setIsMuted(newVol === 0);
    if (audioRef.current) {
      audioRef.current.volume = newVol;
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = volume > 0 ? volume : 0.8;
      setIsMuted(false);
    } else {
      audioRef.current.volume = 0;
      setIsMuted(true);
    }
  };

  const toggleLoop = () => {
    if (audioRef.current) {
      audioRef.current.loop = !isLoop;
      setIsLoop(!isLoop);
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIdx);
    setCurrentLyricIndex(0);
    setCurrentTime(0);
  };

  const handlePrevTrack = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setCurrentLyricIndex(0);
    } else {
      const prevIdx = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
      setCurrentTrackIndex(prevIdx);
      setCurrentLyricIndex(0);
      setCurrentTime(0);
    }
  };

  const handleTrackEnded = () => {
    if (isLoop) {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((err) => console.log("Loop replay failed:", err));
      }
    } else {
      handleNextTrack();
    }
  };

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Dynamic previous and next track calculated automatically from PLAYLIST
  const prevTrackIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
  const nextTrackIndex = (currentTrackIndex + 1) % PLAYLIST.length;
  const prevTrack = PLAYLIST[prevTrackIndex];
  const nextTrack = PLAYLIST[nextTrackIndex];

  // 3 visible lyrics: previous, active, and next
  const prevLine = currentLyricIndex > 0 ? lyrics[currentLyricIndex - 1] : null;
  const activeLine = lyrics[currentLyricIndex] || lyrics[0];
  const nextLine =
    currentLyricIndex < lyrics.length - 1
      ? lyrics[currentLyricIndex + 1]
      : null;

  // Reusable Full Player Content (shared by Desktop Sidebar and Mobile Popup Modal)
  const renderPlayerBody = (isModal: boolean = false) => {
    const currentPlayerRef = isModal ? modalPlayerRef : desktopPlayerRef;
    const currentLyricsRef = isModal ? modalLyricsRef : desktopLyricsRef;
    const currentTargetHeight = isModal ? modalPlayerHeight : desktopPlayerHeight;

    return (
      <div className={cn("w-full text-left", isModal ? "flex-1 flex flex-col justify-between" : "")}>
      {/* Header Bar (Desktop only, mobile modal has unified top bar) */}
      {!isModal && (
        <div className="flex items-center justify-between p-4 pb-3 border-b border-gray-800/80 mb-0">
          <div className="flex items-center space-x-2 text-left">
            {/* Animated equalizer bars */}
            <div className="flex items-end space-x-0.5 h-3.5">
              <span
                className={cn(
                  "w-0.5 bg-[#00e599] rounded-full transition-all duration-300",
                  isPlaying ? "h-3.5 animate-pulse" : "h-1"
                )}
              />
              <span
                className={cn(
                  "w-0.5 bg-[#00e599] rounded-full transition-all duration-300",
                  isPlaying ? "h-2.5 animate-bounce" : "h-1.5"
                )}
              />
              <span
                className={cn(
                  "w-0.5 bg-[#00e599] rounded-full transition-all duration-300",
                  isPlaying ? "h-3 animate-pulse" : "h-1"
                )}
              />
            </div>
            <span className="text-xs font-bold text-gray-200 uppercase tracking-wider text-left">
              Now Playing
            </span>
          </div>

          {/* Tab Switcher: Player vs Full Lyrics */}
          <div className="flex items-center bg-[#0d121f] p-0.5 rounded-lg border border-gray-800 text-[11px]">
            <button
              type="button"
              onClick={() => setActiveTab("player")}
              className={cn(
                "px-2.5 py-1 rounded-md font-semibold transition cursor-pointer",
                activeTab === "player"
                  ? "bg-[#00e599] text-gray-950 shadow-sm"
                  : "text-gray-400 hover:text-white"
              )}
            >
              Lagu
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("lyrics")}
              className={cn(
                "px-2.5 py-1 rounded-md font-semibold transition cursor-pointer flex items-center space-x-1",
                activeTab === "lyrics"
                  ? "bg-[#00e599] text-gray-950 shadow-sm"
                  : "text-gray-400 hover:text-white"
              )}
            >
              <i className="fa-solid fa-microphone-lines text-[10px]"></i>
              <span>Lirik</span>
            </button>
          </div>
        </div>
      )}

      {/* Container for both tabs with matched height to eliminate jumping */}
      <div className={cn("relative w-full", isModal ? "flex-1 flex flex-col min-h-0" : "")}>
        {/* 1. Tab Lagu (Player) */}
        <div
          ref={currentPlayerRef}
          className={cn(
            "text-left transition-opacity duration-200",
            isModal ? "flex-1 flex flex-col justify-between" : "space-y-3.5",
            activeTab === "player"
              ? "opacity-100 relative"
              : "opacity-0 pointer-events-none invisible absolute inset-x-0 top-0"
          )}
        >
            {/* 1. Album Cover - Full bleed on top, left, right (edges touch borders/screen) */}
            <div
              className={cn(
                "relative overflow-hidden group/cover select-none shrink-0 w-full",
                isModal
                  ? "h-[54dvh] xs:h-[56dvh] sm:h-[58dvh] min-h-[360px] max-h-[580px]"
                  : "aspect-[4/3] sm:aspect-square"
              )}
            >
              {/* Static Cover Image */}
              <Image
                src={currentTrack.cover}
                alt={`${currentTrack.artist} - ${currentTrack.title}`}
                fill
                className={cn(
                  "object-cover object-center transition-transform duration-700 ease-out",
                  isPlaying ? "scale-105" : "scale-100"
                )}
                priority
              />

              {/* Dynamic Canvas Video Loop (Transitions smoothly in when music plays) */}
              {currentTrack.video && (
                <video
                  ref={isModal ? modalVideoRef : desktopVideoRef}
                  key={`${currentTrack.id}-${isModal ? "modal" : "desktop"}`}
                  src={currentTrack.video}
                  muted
                  loop
                  playsInline
                  preload="auto"
                  onCanPlay={(e) => {
                    if (isPlaying) {
                      e.currentTarget.play().catch(() => {});
                    }
                  }}
                  className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-in-out pointer-events-none",
                    isPlaying ? "opacity-100 scale-105" : "opacity-0 scale-100"
                  )}
                />
              )}

              {/* Soft bottom-only gradient fade to card background (#0d121f), lowered so the cover remains bright and clear */}
              <div className="absolute inset-x-0 bottom-0 h-20 sm:h-24 bg-gradient-to-t from-[#0d121f] via-[#0d121f]/75 to-transparent pointer-events-none z-[2]" />
            </div>

            {/* Padded Content below cover (Lyrics, Title, Progress, Controls, Volume - grouped snugly at bottom) */}
            <div className={cn("flex-1 flex flex-col justify-end text-left", isModal ? "px-5 sm:px-6 pb-6 -mt-6 relative z-10 space-y-2.5 sm:space-y-3" : "px-4 pb-4 space-y-3.5")}>
              {/* 2. 3-Line Dynamic Synchronized Lyrics */}
              <div className="py-1 px-0.5 text-left select-none overflow-hidden h-[86px] min-h-[86px] max-h-[86px] shrink-0 flex flex-col justify-between">
                {/* Previous Line */}
                <div
                  onClick={() => prevLine && handleLyricClick(prevLine.time)}
                  className={cn(
                    "h-5 text-xs transition-all duration-300 truncate cursor-pointer text-left flex items-center",
                    prevLine ? "text-gray-500 hover:text-gray-300 font-medium" : "opacity-0 select-none pointer-events-none"
                  )}
                  title={prevLine?.text}
                >
                  <span className="truncate">{prevLine?.text || "—"}</span>
                </div>

                {/* Active Line */}
                <div className="h-11 flex items-center overflow-hidden">
                  <motion.div
                    key={currentLyricIndex}
                    initial={{ opacity: 0, y: 3 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    onClick={() => activeLine && handleLyricClick(activeLine.time)}
                    className="w-full text-sm sm:text-base font-black text-[#00e599] text-left drop-shadow-[0_0_12px_rgba(0,229,153,0.35)] cursor-pointer line-clamp-2 leading-tight select-none"
                    title="Klik untuk loncat ke bait ini"
                  >
                    {activeLine?.text || "..."}
                  </motion.div>
                </div>

                {/* Next Line */}
                <div
                  onClick={() => nextLine && handleLyricClick(nextLine.time)}
                  className={cn(
                    "h-5 text-xs transition-all duration-300 truncate cursor-pointer text-left flex items-center",
                    nextLine ? "text-gray-400 hover:text-gray-200 font-medium" : "opacity-0 select-none pointer-events-none"
                  )}
                  title={nextLine?.text}
                >
                  <span className="truncate">{nextLine?.text || "—"}</span>
                </div>
              </div>

              {/* 3. Song Info Bar (Title & Artist) */}
              <div className="pt-0 text-left">
                <h3 className="text-base sm:text-lg font-extrabold text-white tracking-tight truncate hover:text-[#00e599] transition cursor-pointer text-left leading-tight">
                  {currentTrack.title}
                </h3>
                <p className="text-xs text-gray-400 font-medium truncate mt-0.5 text-left">
                  {currentTrack.artist}
                </p>
              </div>

              {/* 4. Progress Bar & Timestamps */}
              <div className="space-y-1 pt-0">
                <div className="relative w-full h-1.5 bg-gray-800 rounded-full overflow-hidden cursor-pointer group/bar">
                  {/* Visual Progress Fill */}
                  <div
                    className="absolute top-0 left-0 h-full bg-[#00e599] rounded-full group-hover/bar:bg-[#1affaa] transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                  {/* Hidden Native Range for Accessibility */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    aria-label="Seek Waktu Lagu"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-gray-500 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* 5. Main Audio Controls */}
              <div className="flex items-center justify-between pt-0.5">
                {/* Loop / Repeat */}
                <button
                  type="button"
                  aria-label="Ulangi Lagu"
                  onClick={toggleLoop}
                  className={cn(
                    "p-2 text-sm transition active:scale-90 cursor-pointer",
                    isLoop ? "text-[#00e599]" : "text-gray-500 hover:text-gray-300"
                  )}
                  title={isLoop ? "Ulangi Aktif" : "Ulangi Nonaktif"}
                >
                  <i className="fa-solid fa-repeat"></i>
                </button>

                {/* Previous Track */}
                <button
                  type="button"
                  aria-label="Lagu Sebelumnya"
                  onClick={handlePrevTrack}
                  className="p-2 text-gray-400 hover:text-white transition active:scale-90 cursor-pointer"
                  title="Lagu Sebelumnya"
                >
                  <i className="fa-solid fa-backward-step text-base"></i>
                </button>

                {/* Big Play / Pause Button */}
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.94 }}
                  type="button"
                  aria-label={isPlaying ? "Jeda" : "Putar"}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-[#00e599] text-gray-950 flex items-center justify-center shadow-lg shadow-[#00e599]/30 hover:bg-[#1affaa] transition cursor-pointer"
                >
                  <i className={cn("fa-solid text-lg", isPlaying ? "fa-pause" : "fa-play ml-0.5")}></i>
                </motion.button>

                {/* Next Track */}
                <button
                  type="button"
                  aria-label="Lagu Berikutnya"
                  onClick={handleNextTrack}
                  className="p-2 text-gray-400 hover:text-white transition active:scale-90 cursor-pointer"
                  title="Lagu Berikutnya"
                >
                  <i className="fa-solid fa-forward-step text-base"></i>
                </button>

                {/* Open Lyrics Tab Shortcut */}
                <button
                  type="button"
                  aria-label="Lihat Lirik Penuh"
                  onClick={() => setActiveTab("lyrics")}
                  className="p-2 text-gray-500 hover:text-[#00e599] transition active:scale-90 cursor-pointer"
                  title="Buka Lirik Penuh"
                >
                  <i className="fa-solid fa-bars-staggered text-sm"></i>
                </button>
              </div>

              {/* 6. Volume Slider Bar */}
              <div className="flex items-center space-x-2.5 pt-2 px-1 border-t border-gray-800/60">
                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? "Bunyikan" : "Bisukan"}
                  className="text-gray-400 hover:text-white text-xs cursor-pointer"
                >
                  <i
                    className={cn(
                      "fa-solid",
                      isMuted || volume === 0
                        ? "fa-volume-xmark text-red-400"
                        : volume < 0.5
                        ? "fa-volume-low"
                        : "fa-volume-high"
                    )}
                  ></i>
                </button>
                <div className="relative flex-1 h-1 bg-gray-800 rounded-full overflow-hidden group/vol cursor-pointer">
                  <div
                    className="absolute top-0 left-0 h-full bg-gray-400 group-hover/vol:bg-[#00e599] transition-all"
                    style={{ width: `${isMuted ? 0 : volume * 100}%` }}
                  />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.01}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    aria-label="Atur Volume"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
                <span className="text-[10px] text-gray-500 font-mono w-7 text-right">
                  {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
                </span>
              </div>

              {/* 7. Dynamic Previous & Next Track Info Strip (Auto-adapts to playlist changes) */}
              {PLAYLIST.length > 1 && (
                <div className="pt-2.5 px-0.5 border-t border-gray-800/60 flex items-center justify-between text-xs select-none">
                  {/* Previous Song Info */}
                  <button
                    type="button"
                    onClick={handlePrevTrack}
                    className="group/prev flex items-center space-x-2.5 min-w-0 max-w-[48%] text-left hover:text-white transition active:scale-95 cursor-pointer"
                    title={`Lagu Sebelumnya: ${prevTrack.title} - ${prevTrack.artist}`}
                  >
                    {/* Previous Track Cover Thumbnail */}
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-800/90 shadow-sm bg-[#0d121f]">
                      <Image
                        src={prevTrack.cover}
                        alt={`${prevTrack.artist} - ${prevTrack.title}`}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover group-hover/prev:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/prev:bg-black/0 transition-colors" />
                    </div>

                    <div className="min-w-0 truncate text-left">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <i className="fa-solid fa-backward-step text-[8px] text-gray-500 group-hover/prev:text-[#00e599] transition"></i>
                        <span className="block text-[9px] uppercase tracking-wider font-bold leading-tight">
                          Sebelumnya
                        </span>
                      </div>
                      <span className="block text-[11px] font-medium text-gray-300 group-hover/prev:text-white truncate leading-tight mt-0.5">
                        {prevTrack.title}
                      </span>
                    </div>
                  </button>

                  {/* Center Divider Line */}
                  <div className="h-6 w-px bg-gray-800/70 mx-1 shrink-0" aria-hidden="true" />

                  {/* Next Song Info */}
                  <button
                    type="button"
                    onClick={handleNextTrack}
                    className="group/next flex items-center justify-end space-x-2.5 min-w-0 max-w-[48%] text-right hover:text-white transition active:scale-95 cursor-pointer"
                    title={`Lagu Berikutnya: ${nextTrack.title} - ${nextTrack.artist}`}
                  >
                    <div className="min-w-0 truncate text-right">
                      <div className="flex items-center justify-end space-x-1 text-gray-400">
                        <span className="block text-[9px] uppercase tracking-wider font-bold leading-tight">
                          Berikutnya
                        </span>
                        <i className="fa-solid fa-forward-step text-[8px] text-gray-500 group-hover/next:text-[#00e599] transition"></i>
                      </div>
                      <span className="block text-[11px] font-medium text-gray-300 group-hover/next:text-white truncate leading-tight mt-0.5">
                        {nextTrack.title}
                      </span>
                    </div>

                    {/* Next Track Cover Thumbnail */}
                    <div className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-800/90 shadow-sm bg-[#0d121f]">
                      <Image
                        src={nextTrack.cover}
                        alt={`${nextTrack.artist} - ${nextTrack.title}`}
                        width={32}
                        height={32}
                        className="w-full h-full object-cover group-hover/next:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover/next:bg-black/0 transition-colors" />
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Tab Lirik (Lyrics) - Height locked exactly to currentTargetHeight on desktop, full height in modal */}
          <div
            style={isModal ? undefined : { height: `${currentTargetHeight}px` }}
            className={cn(
              "flex flex-col text-left space-y-3 transition-opacity duration-200",
              isModal ? "flex-1 min-h-0 h-full pt-16 px-4 sm:px-6 pb-6" : "p-4 space-y-3",
              activeTab === "lyrics"
                ? "opacity-100 relative"
                : "opacity-0 pointer-events-none invisible absolute inset-x-0 top-0"
            )}
          >
            {/* Lyrics Header with Mini Controls */}
            <div className="shrink-0 flex items-center justify-between p-2 rounded-xl bg-[#0d121f] border border-gray-800">
              <div className="flex items-center space-x-2 min-w-0 text-left">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-800">
                  <Image
                    src={currentTrack.cover}
                    alt={`${currentTrack.artist} - ${currentTrack.title}`}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0 text-left">
                  <span className="text-xs font-bold text-white block truncate text-left">{currentTrack.title}</span>
                  <span className="text-[10px] text-gray-400 block truncate text-left">{currentTrack.artist}</span>
                </div>
              </div>

              <div className="flex items-center space-x-1 shrink-0">
                <button
                  type="button"
                  onClick={handlePrevTrack}
                  aria-label="Lagu Sebelumnya"
                  className="w-7 h-7 rounded-full text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Lagu Sebelumnya"
                >
                  <i className="fa-solid fa-backward-step text-xs"></i>
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label={isPlaying ? "Jeda" : "Putar"}
                  className="w-8 h-8 rounded-full bg-[#00e599] text-gray-950 flex items-center justify-center shadow-md shadow-[#00e599]/30 hover:scale-105 active:scale-95 transition cursor-pointer"
                >
                  <i className={cn("fa-solid text-xs", isPlaying ? "fa-pause" : "fa-play ml-0.5")}></i>
                </button>
                <button
                  type="button"
                  onClick={handleNextTrack}
                  aria-label="Lagu Berikutnya"
                  className="w-7 h-7 rounded-full text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer"
                  title="Lagu Berikutnya"
                >
                  <i className="fa-solid fa-forward-step text-xs"></i>
                </button>
              </div>
            </div>

            {/* Dynamic Scrollable Full Lyrics List (Fills remaining height) */}
            <div
              ref={currentLyricsRef}
              className="flex-1 min-h-0 overflow-y-auto px-1 py-3 space-y-2.5 custom-scrollbar rounded-xl bg-[#0d121f]/40 border border-gray-800/60 relative select-none text-left"
            >
              {lyrics.map((line, idx) => {
                const isActive = idx === currentLyricIndex;
                const isPassed = idx < currentLyricIndex;

                return (
                  <div
                    key={idx}
                    data-active-lyric={isActive ? "true" : undefined}
                    onClick={() => handleLyricClick(line.time)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-left leading-relaxed",
                      isActive
                        ? "text-[#00e599] font-black text-sm drop-shadow-[0_0_10px_rgba(0,229,153,0.3)] bg-[#00e599]/10"
                        : isPassed
                        ? "text-gray-500 hover:text-gray-300 font-medium text-xs hover:bg-gray-800/40"
                        : "text-gray-400 hover:text-gray-200 font-medium text-xs hover:bg-gray-800/40"
                    )}
                  >
                    <span>{line.text}</span>
                  </div>
                );
              })}
            </div>

            {/* Back to Player Button */}
            <button
              type="button"
              onClick={() => setActiveTab("player")}
              className="shrink-0 w-full py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 font-semibold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-compact-disc"></i>
              <span>Kembali ke Pemutar Audio</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Hidden Native Audio Element (stays mounted and active continuously) */}
      <audio
        ref={audioRef}
        src={currentTrack.src}
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleTrackEnded}
        className="hidden"
      />

      {/* 1. Desktop Mode Player: Inline in Sidebar (Hidden on Mobile < lg) */}
      <div className="hidden lg:block w-full bg-[#0d121f] border border-gray-800/80 rounded-3xl overflow-hidden shadow-2xl relative text-left">
        {renderPlayerBody(false)}
      </div>

      {/* 2. Mobile Mode: Floating Sticky Mini Player Bar (Spotify Style, Sticky Bottom = 0, Visible ONLY on < lg) */}
      <div
        className={cn(
          "block lg:hidden fixed bottom-0 left-0 right-0 z-40 p-2 sm:p-3 bg-gradient-to-t from-[#070b13] via-[#070b13]/95 to-transparent transition-all duration-500 ease-in-out",
          isMiniPlayerVisible && !isMobileModalOpen
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsMobileModalOpen(true)}
          className="relative flex items-center justify-between px-3.5 py-2.5 sm:px-4 sm:py-3 bg-[#111726]/95 hover:bg-[#161e30] border border-gray-800/90 rounded-2xl shadow-2xl backdrop-blur-md transition cursor-pointer overflow-hidden group select-none active:scale-[0.99]"
        >
          {/* Left: Album Cover + Title & Artist */}
          <div className="flex items-center space-x-3 min-w-0 flex-1 pr-3 text-left">
            {/* Album Cover Thumbnail */}
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl overflow-hidden shrink-0 border border-gray-800/80 shadow-md bg-[#0d121f]">
              <Image
                src={currentTrack.cover}
                alt={`${currentTrack.artist} - ${currentTrack.title}`}
                width={48}
                height={48}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-500",
                  isPlaying ? "scale-105" : "scale-100"
                )}
              />
            </div>

            {/* Title & Artist */}
            <div className="min-w-0 flex-1 text-left">
              <h4 className="text-sm font-bold text-white truncate tracking-tight leading-tight">
                {currentTrack.title}
              </h4>
              <p className="text-xs text-gray-400 font-medium truncate mt-0.5">
                {currentTrack.artist}
              </p>
            </div>
          </div>

          {/* Right Controls: [Previous Track] [Play/Pause Glow Circle] [Next Track] */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Previous Track */}
            <button
              type="button"
              aria-label="Lagu Sebelumnya"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevTrack();
              }}
              className="p-1.5 text-gray-300 hover:text-white transition active:scale-90 cursor-pointer"
              title="Lagu Sebelumnya"
            >
              <i className="fa-solid fa-backward-step text-base"></i>
            </button>

            {/* Play / Pause Button (Transparent, aligned with Prev and Next) */}
            <button
              type="button"
              aria-label={isPlaying ? "Jeda" : "Putar"}
              onClick={(e) => {
                e.stopPropagation();
                togglePlay();
              }}
              className="p-1.5 text-gray-200 hover:text-white transition active:scale-90 cursor-pointer"
              title={isPlaying ? "Jeda" : "Putar"}
            >
              <i
                className={cn(
                  "text-lg",
                  isPlaying ? "fa-solid fa-pause" : "fa-solid fa-play ml-0.5"
                )}
              ></i>
            </button>

            {/* Next Track */}
            <button
              type="button"
              aria-label="Lagu Berikutnya"
              onClick={(e) => {
                e.stopPropagation();
                handleNextTrack();
              }}
              className="p-1.5 text-gray-300 hover:text-white transition active:scale-90 cursor-pointer"
              title="Lagu Berikutnya"
            >
              <i className="fa-solid fa-forward-step text-base"></i>
            </button>
          </div>

          {/* White Audio Progress Bar (at bottom edge of mini player card) */}
          <div className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-white/20 overflow-hidden rounded-b-2xl">
            <div
              className="h-full bg-white transition-all duration-150 rounded-b-2xl"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 3. Mobile Fullscreen Audio Player Modal (Rendered via Portal to document.body with z-[100]) */}
      {hasMounted && typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isMobileModalOpen && (
              <motion.div
                key="mobile-player-modal"
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 320 }}
                className="fixed inset-0 z-[100] lg:hidden bg-[#0d121f] h-[100dvh] h-full w-full flex flex-col text-left overflow-hidden select-none"
                style={{ touchAction: "none" }}
              >
                {/* Top Unified Floating Header Bar */}
                <div className="absolute top-0 inset-x-0 w-full px-4 pt-3.5 pb-2.5 flex items-center justify-between z-30 bg-gradient-to-b from-black/80 via-black/40 to-transparent">
                  {/* Collapse Button */}
                  <button
                    type="button"
                    onClick={() => setIsMobileModalOpen(false)}
                    className="w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-gray-200 hover:text-white flex items-center justify-center transition active:scale-90 cursor-pointer shadow-lg"
                    aria-label="Tutup Pemutar"
                  >
                    <i className="fa-solid fa-chevron-down text-sm"></i>
                  </button>

                  {/* Center Tab Switcher: [Lagu] [Lirik] */}
                  <div className="flex items-center bg-black/50 backdrop-blur-md p-1 rounded-xl border border-white/10 text-xs shadow-lg">
                    <button
                      type="button"
                      onClick={() => setActiveTab("player")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5",
                        activeTab === "player"
                          ? "bg-[#00e599] text-gray-950 shadow-sm"
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      <i className="fa-solid fa-music text-[10px]"></i>
                      <span>Lagu</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab("lyrics")}
                      className={cn(
                        "px-3.5 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center space-x-1.5",
                        activeTab === "lyrics"
                          ? "bg-[#00e599] text-gray-950 shadow-sm"
                          : "text-gray-300 hover:text-white"
                      )}
                    >
                      <i className="fa-solid fa-microphone-lines text-[10px]"></i>
                      <span>Lirik</span>
                    </button>
                  </div>

                  {/* Right Spacer (Balances collapse button for center tab alignment) */}
                  <div className="w-9 h-9" aria-hidden="true" />
                </div>

                {/* Full Height Content Body - Edge-to-Edge container for seamless hero cover */}
                <div
                  className="flex-1 w-full min-h-0 overflow-y-auto flex flex-col justify-between custom-scrollbar relative"
                  style={{ touchAction: "pan-y" }}
                >
                  {renderPlayerBody(true)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
