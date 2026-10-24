"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { NERVOUSNESS_LYRICS } from "./lyricsData";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLyricRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(215); // Default ~3:35
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoop, setIsLoop] = useState(false);
  const [activeTab, setActiveTab] = useState<"player" | "lyrics">("player");
  const [isLiked, setIsLiked] = useState(false);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Sync current lyric index as audio plays
  useEffect(() => {
    const idx = NERVOUSNESS_LYRICS.findIndex((item, i) => {
      const nextTime = NERVOUSNESS_LYRICS[i + 1]?.time ?? Infinity;
      return currentTime >= item.time && currentTime < nextTime;
    });

    if (idx !== -1 && idx !== currentLyricIndex) {
      setCurrentLyricIndex(idx);
    }
  }, [currentTime, currentLyricIndex]);

  // Auto-scroll active lyric in full lyrics tab
  useEffect(() => {
    if (activeTab === "lyrics" && activeLyricRef.current && lyricsContainerRef.current) {
      activeLyricRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentLyricIndex, activeTab]);

  // Audio Event Listeners
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 215);
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

  const handleSkip = (seconds: number) => {
    if (!audioRef.current) return;
    const target = Math.max(0, Math.min(duration, audioRef.current.currentTime + seconds));
    audioRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // 3 visible lyrics: previous, active, and next
  const prevLine = currentLyricIndex > 0 ? NERVOUSNESS_LYRICS[currentLyricIndex - 1] : null;
  const activeLine = NERVOUSNESS_LYRICS[currentLyricIndex] || NERVOUSNESS_LYRICS[0];
  const nextLine =
    currentLyricIndex < NERVOUSNESS_LYRICS.length - 1
      ? NERVOUSNESS_LYRICS[currentLyricIndex + 1]
      : null;

  return (
    <Card className="p-4 sm:p-5 bg-[#131927] border-gray-800/80 shadow-xl overflow-hidden relative group">
      {/* Hidden Native Audio Element */}
      <audio
        ref={audioRef}
        src="/audio/nervousness.mp3"
        preload="metadata"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          if (!isLoop) setIsPlaying(false);
        }}
      />

      {/* Background Ambient Glow */}
      <div className="absolute top-0 right-0 w-44 h-44 bg-[#00e599]/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10"></div>

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-800/80 mb-4">
        <div className="flex items-center space-x-2">
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
          <span className="text-xs font-bold text-gray-200 uppercase tracking-wider">
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

      <AnimatePresence mode="wait">
        {activeTab === "player" ? (
          <motion.div
            key="player"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3.5"
          >
            {/* 1. Album Cover */}
            <div className="relative aspect-video sm:aspect-square w-full rounded-2xl overflow-hidden border border-gray-800 shadow-lg bg-[#0d121f] group/cover">
              <Image
                src="/audio/cover.jpg"
                alt="Joon - nervousness"
                width={400}
                height={400}
                className={cn(
                  "w-full h-full object-cover transition-transform duration-700 ease-out",
                  isPlaying ? "scale-105" : "scale-100 group-hover/cover:scale-105"
                )}
                priority
              />

              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

              {/* Quick Play Overlay Button */}
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Jeda" : "Putar"}
                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/cover:opacity-100 transition-opacity bg-black/40 backdrop-blur-xs cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full bg-[#00e599] text-gray-950 flex items-center justify-center shadow-lg shadow-[#00e599]/40 hover:scale-110 active:scale-95 transition">
                  <i className={cn("fa-solid text-lg", isPlaying ? "fa-pause" : "fa-play ml-0.5")}></i>
                </div>
              </button>
            </div>

            {/* 2. 3-Line Dynamic Synchronized Lyrics (Between Cover & Song Title) */}
            <div className="p-3 rounded-2xl bg-[#0d121f] border border-gray-800/80 shadow-inner space-y-1 text-center select-none overflow-hidden min-h-[96px] flex flex-col justify-center">
              {/* Previous Line */}
              <div
                onClick={() => prevLine && handleLyricClick(prevLine.time)}
                className={cn(
                  "text-[11px] transition-all duration-300 truncate cursor-pointer",
                  prevLine ? "text-gray-500 hover:text-gray-300" : "opacity-0 select-none"
                )}
                title={prevLine?.text}
              >
                {prevLine?.text || "—"}
              </div>

              {/* Active Line (Larger font, Bolder, Neon Mint Glow) */}
              <motion.div
                key={currentLyricIndex}
                initial={{ opacity: 0, y: 3, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
                onClick={() => activeLine && handleLyricClick(activeLine.time)}
                className="text-xs sm:text-[13px] font-black text-[#00e599] drop-shadow-[0_0_12px_rgba(0,229,153,0.35)] cursor-pointer py-0.5 line-clamp-2 px-1 leading-snug"
                title="Klik untuk loncat ke bait ini"
              >
                {activeLine?.text || "..."}
              </motion.div>

              {/* Next Line */}
              <div
                onClick={() => nextLine && handleLyricClick(nextLine.time)}
                className={cn(
                  "text-[11px] transition-all duration-300 truncate cursor-pointer",
                  nextLine ? "text-gray-400 hover:text-gray-200" : "opacity-0 select-none"
                )}
                title={nextLine?.text}
              >
                {nextLine?.text || "—"}
              </div>
            </div>

            {/* 3. Song Info Bar (Title & Artist) */}
            <div className="flex items-center justify-between pt-0.5">
              <div className="min-w-0 pr-2">
                <h3 className="text-base font-bold text-white tracking-tight truncate hover:text-[#00e599] transition cursor-pointer">
                  nervousness
                </h3>
                <p className="text-xs text-gray-400 font-medium truncate flex items-center space-x-1.5 mt-0.5">
                  <span>Joon</span>
                  <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-gray-800 text-gray-400 font-semibold border border-gray-700/60">
                    Official Single
                  </span>
                </p>
              </div>

              {/* Like Button */}
              <button
                type="button"
                aria-label="Sukai Lagu"
                onClick={() => setIsLiked(!isLiked)}
                className="p-2 text-gray-400 hover:text-[#00e599] transition active:scale-90 cursor-pointer"
              >
                <i
                  className={cn(
                    "text-lg",
                    isLiked ? "fa-solid fa-heart text-[#00e599]" : "fa-regular fa-heart"
                  )}
                ></i>
              </button>
            </div>

            {/* 4. Progress Bar & Timestamps */}
            <div className="space-y-1.5 pt-0.5">
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

              {/* Skip -10s */}
              <button
                type="button"
                aria-label="Mundur 10 Detik"
                onClick={() => handleSkip(-10)}
                className="p-2 text-gray-400 hover:text-white transition active:scale-90 cursor-pointer"
                title="Mundur 10s"
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

              {/* Skip +10s */}
              <button
                type="button"
                aria-label="Maju 10 Detik"
                onClick={() => handleSkip(10)}
                className="p-2 text-gray-400 hover:text-white transition active:scale-90 cursor-pointer"
                title="Maju 10s"
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
          </motion.div>
        ) : (
          <motion.div
            key="lyrics"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            {/* Lyrics Header with Mini Play/Pause */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#0d121f] border border-gray-800">
              <div className="flex items-center space-x-2 min-w-0">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-gray-800">
                  <Image
                    src="/audio/cover.jpg"
                    alt="Cover"
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <span className="text-xs font-bold text-white block truncate">nervousness</span>
                  <span className="text-[10px] text-gray-400 block truncate">Joon</span>
                </div>
              </div>

              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? "Jeda" : "Putar"}
                className="w-8 h-8 rounded-full bg-[#00e599] text-gray-950 flex items-center justify-center shadow-md shadow-[#00e599]/30 hover:scale-105 active:scale-95 transition cursor-pointer"
              >
                <i className={cn("fa-solid text-xs", isPlaying ? "fa-pause" : "fa-play ml-0.5")}></i>
              </button>
            </div>

            {/* Dynamic Scrollable Full Lyrics List */}
            <div
              ref={lyricsContainerRef}
              className="h-80 overflow-y-auto px-2 py-3 space-y-3 custom-scrollbar rounded-xl bg-[#0d121f]/60 border border-gray-800/80 relative select-none"
            >
              <div className="text-[10px] text-gray-500 uppercase tracking-widest text-center pb-2 border-b border-gray-800/60 font-semibold">
                Klik lirik untuk loncat ke bait
              </div>

              {NERVOUSNESS_LYRICS.map((line, idx) => {
                const isActive = idx === currentLyricIndex;
                const isPassed = idx < currentLyricIndex;

                return (
                  <div
                    key={idx}
                    ref={isActive ? activeLyricRef : null}
                    onClick={() => handleLyricClick(line.time)}
                    className={cn(
                      "p-2.5 rounded-xl transition-all duration-300 cursor-pointer text-left leading-relaxed",
                      isActive
                        ? "bg-[#00e599]/15 border border-[#00e599]/40 text-[#00e599] font-extrabold text-sm shadow-[0_0_15px_rgba(0,229,153,0.15)] scale-[1.02]"
                        : isPassed
                        ? "text-gray-500 hover:text-gray-300 font-medium text-xs hover:bg-gray-800/40"
                        : "text-gray-400 hover:text-gray-200 font-medium text-xs hover:bg-gray-800/40"
                    )}
                  >
                    <div className="flex items-start space-x-2">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00e599] mt-1.5 shrink-0 animate-ping"></span>
                      )}
                      <span>{line.text}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Back to Player Button */}
            <button
              type="button"
              onClick={() => setActiveTab("player")}
              className="w-full py-2 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-300 font-semibold text-xs transition flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <i className="fa-solid fa-compact-disc"></i>
              <span>Kembali ke Pemutar Audio</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
