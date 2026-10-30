"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface GitHubProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface GitHubProfileData {
  username: string;
  displayName: string;
  profileUrl: string;
  avatarUrl: string;
  bio: string;
  stats: {
    repos: string;
    followers: string;
    following: string;
  };
}

const DEFAULT_PROFILE: GitHubProfileData = {
  username: "Justdhif",
  displayName: "Nadhif Ararya",
  profileUrl: "https://github.com/Justdhif",
  avatarUrl: "https://avatars.githubusercontent.com/u/155049684?v=4",
  bio: "try to be better",
  stats: {
    repos: "19",
    followers: "7",
    following: "7",
  },
};

export function GitHubProfileModal({ isOpen, onClose }: GitHubProfileModalProps) {
  const [isDesktop, setIsDesktop] = useState(false);
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<GitHubProfileData>(DEFAULT_PROFILE);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 640);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Fetch live GitHub profile data when modal opens
  useEffect(() => {
    if (!isOpen) return;
    let isMounted = true;

    fetch("/api/github", { cache: "no-store" })
      .then((res) => res.json())
      .then((resData) => {
        if (isMounted && resData?.success && resData.data) {
          setProfile(resData.data);
        }
      })
      .catch((err) => {
        console.warn("[GitHubModal] Fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profile.profileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onClose={onClose}
        containerClassName={
          isDesktop ? "items-center justify-center p-4 sm:p-6" : "items-end justify-center p-0"
        }
        className={
          isDesktop
            ? "w-full max-w-md bg-[#0d121f] border border-gray-800 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.9)] flex flex-col overflow-hidden select-none"
            : "w-full bg-[#0d121f] border-t border-gray-800 rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.9)] flex flex-col max-h-[90dvh] overflow-hidden select-none"
        }
        initial={isDesktop ? { opacity: 0, scale: 0.94, y: 12 } : { y: "100%" }}
        animate={isDesktop ? { opacity: 1, scale: 1, y: 0 } : { y: 0 }}
        exit={isDesktop ? { opacity: 0, scale: 0.94, y: 12 } : { y: "100%" }}
        transition={
          isDesktop
            ? { duration: 0.22, ease: "easeOut" }
            : { type: "spring", damping: 28, stiffness: 320 }
        }
      >
        {/* Mobile Drag Indicator Handle */}
        {!isDesktop && (
          <div className="pt-2.5 pb-1 flex justify-center">
            <div className="w-12 h-1 bg-gray-700/80 rounded-full" />
          </div>
        )}

        {/* Dialog Header */}
        <DialogHeader
          className={
            isDesktop
              ? "px-6 py-4 border-b border-gray-800/80 flex items-center justify-between shrink-0"
              : "px-4 py-3 border-b border-gray-800/80 flex items-center justify-between shrink-0"
          }
        >
          <div className="flex items-center space-x-2.5">
            <div
              className={`rounded-xl bg-black border border-[#00e599]/40 flex items-center justify-center text-[#00e599] shadow-sm shadow-[#00e599]/25 ${
                isDesktop ? "w-8 h-8 text-lg" : "w-8 h-8 text-base"
              }`}
            >
              <i className="fa-brands fa-github"></i>
            </div>
            <div>
              <DialogTitle className={isDesktop ? "text-sm font-bold text-gray-100" : "text-xs font-bold text-gray-100"}>
                Profil GitHub
              </DialogTitle>
              <DialogDescription className={isDesktop ? "text-xs text-gray-400 font-mono" : "text-[11px] text-gray-400 font-mono"}>
                @{profile.username}
              </DialogDescription>
            </div>
          </div>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={
                isDesktop
                  ? "w-8 h-8 rounded-xl bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white"
                  : "w-7 h-7 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white"
              }
              aria-label="Tutup Dialog"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </Button>
          </DialogClose>
        </DialogHeader>

        {/* Dialog Body Content */}
        <div
          className={
            isDesktop
              ? "p-6 space-y-5"
              : "p-4 space-y-4 overflow-y-auto overscroll-contain custom-scrollbar"
          }
        >
          {/* Hero Profile Info */}
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="relative">
              <div
                className={`rounded-full bg-gradient-to-tr from-[#00e599] to-[#00b377] p-1 shadow-lg shadow-[#00e599]/25 ${
                  isDesktop ? "w-20 h-20" : "w-16 h-16"
                }`}
              >
                <div className="w-full h-full rounded-full overflow-hidden bg-[#0d121f]">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.displayName}
                    width={isDesktop ? 80 : 64}
                    height={isDesktop ? 80 : 64}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div
                className={`absolute rounded-full bg-black border border-[#00e599]/50 flex items-center justify-center text-[#00e599] shadow-md ${
                  isDesktop
                    ? "-bottom-1 -right-1 w-6 h-6 text-xs"
                    : "-bottom-0.5 -right-0.5 w-5 h-5 text-[10px]"
                }`}
              >
                <i className="fa-brands fa-github"></i>
              </div>
            </div>

            <div>
              <h4 className={isDesktop ? "text-base font-bold text-white flex items-center justify-center" : "text-sm font-bold text-white flex items-center justify-center"}>
                <span>{profile.displayName}</span>
              </h4>
              <p className="text-xs text-gray-400 font-mono mt-0.5">
                @{profile.username}
              </p>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="text-xs text-gray-300 leading-relaxed max-w-sm text-center">
                &ldquo;{profile.bio}&rdquo;
              </div>
            )}
          </div>

          {/* 3-Column Stats (Repos | Pengikut | Mengikuti) without card styling */}
          <div className="grid grid-cols-3 py-1.5 sm:py-2 text-center divide-x divide-gray-800/80">
            <div className="flex flex-col items-center justify-center space-y-1 px-1">
              <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                <i className="fa-solid fa-book-bookmark text-[10px] text-amber-400"></i>
                <span>Repositori</span>
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white font-mono">
                {profile.stats.repos}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 px-1">
              <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                <i className="fa-solid fa-users text-[10px] text-[#00e599]"></i>
                <span>Pengikut</span>
              </span>
              <span className="text-sm sm:text-base font-extrabold text-[#00e599] font-mono">
                {profile.stats.followers}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center space-y-1 px-1">
              <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                <i className="fa-solid fa-user-plus text-[10px] text-blue-400"></i>
                <span>Mengikuti</span>
              </span>
              <span className="text-sm sm:text-base font-extrabold text-white font-mono">
                {profile.stats.following}
              </span>
            </div>
          </div>
        </div>

        {/* Dialog Actions Footer */}
        <DialogFooter
          className={
            isDesktop
              ? "px-6 py-4 border-t border-gray-800/80 flex items-center gap-3 shrink-0"
              : "p-3 border-t border-gray-800/80 flex items-center gap-2 shrink-0"
          }
        >
          <Button
            type="button"
            variant="secondary"
            onClick={handleCopyLink}
            className="flex-1 h-auto py-2.5 px-3 rounded-xl bg-gray-800/90 hover:bg-gray-700 text-gray-200 font-semibold text-xs border border-gray-700/60"
          >
            <i className={copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-clone"}></i>
            <span>{copied ? "Link Tersalin!" : "Salin Link"}</span>
          </Button>

          <Link
            href={profile.profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-[2] py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#00e599] to-[#00b377] hover:brightness-105 active:scale-98 text-gray-950 font-bold text-xs transition shadow-lg shadow-[#00e599]/25 flex items-center justify-center space-x-2"
          >
            <i className="fa-brands fa-github text-sm"></i>
            <span>Buka di GitHub</span>
            <i className="fa-solid fa-arrow-up-right-from-square text-[11px]"></i>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
