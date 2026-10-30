"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiPicker } from "./EmojiPicker";
import { Button } from "@/components/ui/button";

interface CommentInputProps {
  replyTarget: { id: string; name: string } | null;
  onCancelReply: () => void;
  onSubmit: (payload: {
    name: string;
    isAnonymous: boolean;
    content: string;
    parentId?: string;
  }) => Promise<boolean>;
}

export function CommentInput({
  replyTarget,
  onCancelReply,
  onSubmit,
}: CommentInputProps) {
  const [name, setName] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [hasMounted, setHasMounted] = useState(false);

  const desktopTextareaRef = useRef<HTMLTextAreaElement>(null);
  const mobileTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Mount check for client portal
  useEffect(() => {
    setHasMounted(true);
    try {
      const savedName = localStorage.getItem("am_comment_name");
      if (savedName) setName(savedName);
      const savedAnon = localStorage.getItem("am_comment_anon");
      if (savedAnon === "true") setIsAnonymous(true);
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Automatically open mobile modal when replying on mobile screen
  useEffect(() => {
    if (replyTarget && typeof window !== "undefined" && window.innerWidth < 640) {
      setIsMobileModalOpen(true);
    }
  }, [replyTarget]);

  // Visual Viewport tracking for mobile virtual keyboards (iOS & Android)
  useEffect(() => {
    if (!isMobileModalOpen || typeof window === "undefined") {
      setKeyboardHeight(0);
      return;
    }

    const vv = window.visualViewport;
    if (!vv) return;

    const handleResize = () => {
      const windowH = window.innerHeight;
      const currentH = vv.height;
      const offsetTop = vv.offsetTop;
      const diff = windowH - (currentH + offsetTop);

      // Mobile keyboard is typically > 60px
      if (diff > 60) {
        setKeyboardHeight(diff);
      } else {
        setKeyboardHeight(0);
      }
    };

    handleResize();
    vv.addEventListener("resize", handleResize);
    vv.addEventListener("scroll", handleResize);

    return () => {
      vv.removeEventListener("resize", handleResize);
      vv.removeEventListener("scroll", handleResize);
    };
  }, [isMobileModalOpen]);

  // Auto-focus mobile textarea when modal opens
  useEffect(() => {
    if (isMobileModalOpen) {
      const timer = setTimeout(() => {
        mobileTextareaRef.current?.focus();
      }, 220);
      return () => clearTimeout(timer);
    }
  }, [isMobileModalOpen]);

  const displayName = isAnonymous ? "Anonim" : name.trim() || "User";
  const avatarUrl = isAnonymous
    ? "https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true"
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}&background=00e599&color=0d121f&bold=true`;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || submitting) return;

    // Save author name preference
    try {
      if (!isAnonymous && name.trim()) {
        localStorage.setItem("am_comment_name", name.trim());
      }
      localStorage.setItem("am_comment_anon", isAnonymous ? "true" : "false");
    } catch {
      // ignore
    }

    setSubmitting(true);
    const success = await onSubmit({
      name: isAnonymous ? "Anonim" : name.trim(),
      isAnonymous,
      content: content.trim(),
      parentId: replyTarget?.id,
    });

    if (success) {
      setContent("");
      setShowEmoji(false);
      setIsMobileModalOpen(false);
      if (desktopTextareaRef.current) {
        desktopTextareaRef.current.style.height = "auto";
      }
    }
    setSubmitting(false);
  };

  const handleDesktopTextareaInput = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
  };

  const handleDesktopKeyDown = (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    if (!isMobileModalOpen && desktopTextareaRef.current) {
      desktopTextareaRef.current.focus();
    }
  };

  const handleBackspaceEmoji = () => {
    setContent((prev) => Array.from(prev).slice(0, -1).join(""));
    if (!isMobileModalOpen && desktopTextareaRef.current) {
      desktopTextareaRef.current.focus();
    }
  };

  return (
    <>
      {/* Desktop Composer */}
      <div className="hidden sm:block bg-[#0d121f] px-3 pb-3 pt-2 shrink-0 relative border-t border-gray-800/80">
        {/* Emoji Picker Popup */}
        <AnimatePresence>
          {showEmoji && (
            <EmojiPicker
              onSelectEmoji={handleInsertEmoji}
              onBackspace={handleBackspaceEmoji}
              onClose={() => setShowEmoji(false)}
            />
          )}
        </AnimatePresence>

        {/* Reply Banner */}
        <AnimatePresence>
          {replyTarget && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between pb-2 text-xs text-gray-400 overflow-hidden"
            >
              <div className="flex items-center space-x-1.5">
                <i className="fa-solid fa-reply text-[10px] text-[#00e599]"></i>
                <span>
                  Membalas <strong className="text-[#00e599]">@{replyTarget.name}</strong>
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onCancelReply}
                className="h-auto p-0 text-gray-500 hover:text-white text-xs hover:bg-transparent"
              >
                <i className="fa-solid fa-xmark mr-1"></i>Batal
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Author Name & Anonymous Toggle */}
        <div className="flex items-center justify-between gap-3 pb-2 text-xs border-b border-gray-800/60 mb-2.5">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-700/80 shrink-0">
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={24}
                height={24}
                unoptimized
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="text"
              value={isAnonymous ? "" : name}
              disabled={isAnonymous}
              onChange={(e) => setName(e.target.value)}
              placeholder={isAnonymous ? "Anonim" : "Nama kamu..."}
              maxLength={50}
              className="bg-transparent border-0 p-0 text-xs text-white placeholder-gray-500 focus:outline-none w-full disabled:opacity-50"
            />
          </div>

          <label className="flex items-center space-x-1.5 cursor-pointer select-none shrink-0">
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="rounded bg-gray-800 border-gray-700 text-[#00e599] focus:ring-0 w-3.5 h-3.5 accent-[#00e599]"
            />
            <span className="text-[11px] text-gray-400">Anonim</span>
          </label>
        </div>

        {/* Comment Form Input */}
        <form onSubmit={handleSubmit} className="flex items-end space-x-2">
          <div className="flex-1 bg-[#1a2234] rounded-2xl px-4 py-2 flex items-center border border-transparent focus-within:border-[#00e599]/60 transition min-h-[38px]">
            <textarea
              ref={desktopTextareaRef}
              rows={1}
              value={content}
              onChange={handleDesktopTextareaInput}
              onKeyDown={handleDesktopKeyDown}
              placeholder="Tambahkan komentar..."
              required
              maxLength={1000}
              className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none w-full resize-none leading-relaxed max-h-28 overflow-y-auto block no-scrollbar"
            />
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => setShowEmoji((prev) => !prev)}
            className="w-9 h-9 rounded-full bg-[#1a2234] hover:bg-gray-800 text-gray-400 hover:text-[#00e599] shadow-md shrink-0 mb-0.5 border border-transparent hover:border-gray-700"
            title="Pilih emoji"
          >
            <i className="fa-regular fa-face-smile text-lg"></i>
          </Button>

          <Button
            type="submit"
            size="icon"
            disabled={submitting || !content.trim()}
            className="w-9 h-9 rounded-full bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold shadow-md shrink-0 disabled:opacity-40 mb-0.5"
          >
            {submitting ? (
              <i className="fa-solid fa-spinner fa-spin text-xs"></i>
            ) : (
              <i className="fa-solid fa-arrow-up text-sm"></i>
            )}
          </Button>
        </form>
      </div>

      {/* Mobile Composer Trigger Bar */}
      <div className="block sm:hidden bg-[#0d121f] px-3.5 py-2.5 border-t border-gray-800/80 shrink-0">
        {replyTarget && (
          <div className="flex items-center justify-between pb-2 text-xs text-gray-400">
            <div className="flex items-center space-x-1.5 text-[11px] truncate">
              <i className="fa-solid fa-reply text-[10px] text-[#00e599]"></i>
              <span className="truncate">
                Membalas <strong className="text-[#00e599]">@{replyTarget.name}</strong>
              </span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancelReply}
              className="h-auto p-0 text-gray-500 hover:text-white text-[11px] hover:bg-transparent shrink-0 ml-2"
            >
              <i className="fa-solid fa-xmark mr-1"></i>Batal
            </Button>
          </div>
        )}

        <div
          role="button"
          tabIndex={0}
          onClick={() => setIsMobileModalOpen(true)}
          className="flex items-center space-x-2.5 bg-[#141b2b] hover:bg-[#1a2337] active:scale-[0.99] border border-gray-800 hover:border-gray-700 rounded-full px-3.5 py-2 cursor-pointer transition select-none"
        >
          <div className="w-7 h-7 rounded-full overflow-hidden border border-gray-700 shrink-0">
            <Image
              src={avatarUrl}
              alt="Avatar"
              width={28}
              height={28}
              unoptimized
              className="w-full h-full object-cover"
            />
          </div>
          <span className="flex-1 text-xs text-gray-400 truncate">
            {replyTarget
              ? `Balas @${replyTarget.name}...`
              : content.trim()
              ? content
              : "Tulis komentar..."}
          </span>
          <div className="flex items-center space-x-1.5 shrink-0">
            <span className="w-7 h-7 rounded-full bg-[#1a2337] text-gray-400 flex items-center justify-center text-xs">
              <i className="fa-regular fa-face-smile"></i>
            </span>
            <span className="w-7 h-7 rounded-full bg-[#00e599] text-gray-950 flex items-center justify-center font-bold text-xs shadow-sm shadow-[#00e599]/30">
              <i className="fa-solid fa-arrow-up"></i>
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Bottom Sheet Modal */}
      {hasMounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isMobileModalOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    setIsMobileModalOpen(false);
                    setShowEmoji(false);
                  }}
                  className="fixed inset-0 bg-black/75 backdrop-blur-sm z-[200] touch-none"
                />

                {/* Bottom Sheet Container */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                  style={{
                    bottom: keyboardHeight > 0 ? `${keyboardHeight}px` : "0px",
                  }}
                  className="fixed inset-x-0 z-[201] bg-[#0d121f] border-t border-gray-800 rounded-t-3xl shadow-[0_-12px_45px_rgba(0,0,0,0.85)] flex flex-col max-h-[88dvh] overflow-hidden transition-[bottom] duration-150 ease-out select-none"
                >
                  {/* Top Drag Handle Indicator */}
                  <div className="pt-2 pb-1 flex justify-center">
                    <div className="w-12 h-1 bg-gray-700/80 rounded-full" />
                  </div>

                  {/* Modal Header */}
                  <div className="px-4 py-2 border-b border-gray-800/70 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-[#00e599]/15 border border-[#00e599]/30 flex items-center justify-center text-[#00e599] text-xs">
                        <i className="fa-solid fa-comment-dots"></i>
                      </div>
                      <span className="text-xs font-bold text-gray-200">
                        {replyTarget ? `Balas Komentar` : `Tulis Komentar`}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setIsMobileModalOpen(false);
                        setShowEmoji(false);
                      }}
                      className="w-7 h-7 rounded-full bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-white text-xs"
                      aria-label="Tutup"
                    >
                      <i className="fa-solid fa-xmark"></i>
                    </Button>
                  </div>

                  {/* Modal Body */}
                  <div className="p-3.5 space-y-2.5 overflow-y-auto overscroll-contain relative">
                    {/* Reply target banner */}
                    {replyTarget && (
                      <div className="flex items-center justify-between px-3 py-1.5 bg-[#00e599]/10 border border-[#00e599]/25 rounded-xl text-xs">
                        <div className="flex items-center space-x-1.5 text-[#00e599] font-medium truncate">
                          <i className="fa-solid fa-reply text-[10px]"></i>
                          <span className="truncate">
                            Membalas <strong>@{replyTarget.name}</strong>
                          </span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={onCancelReply}
                          className="h-auto p-0 text-gray-400 hover:text-white text-xs px-1.5 py-0.5 hover:bg-transparent shrink-0 ml-2"
                        >
                          <i className="fa-solid fa-xmark mr-1"></i>Batal
                        </Button>
                      </div>
                    )}

                    {/* Author Name & Anonymous Switch Row */}
                    <div className="flex items-center justify-between gap-2 px-3 py-2 bg-[#141b2b] rounded-xl border border-gray-800">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-700 shrink-0">
                          <Image
                            src={avatarUrl}
                            alt="Avatar"
                            width={24}
                            height={24}
                            unoptimized
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          value={isAnonymous ? "" : name}
                          disabled={isAnonymous}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={isAnonymous ? "Anonim" : "Nama kamu..."}
                          maxLength={50}
                          className="bg-transparent border-0 p-0 text-xs text-white placeholder-gray-500 focus:outline-none w-full disabled:opacity-50"
                        />
                      </div>
                      <label className="flex items-center space-x-1.5 cursor-pointer select-none shrink-0">
                        <input
                          type="checkbox"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="rounded bg-gray-800 border-gray-700 text-[#00e599] focus:ring-0 w-3.5 h-3.5 accent-[#00e599]"
                        />
                        <span className="text-[11px] text-gray-400 font-medium">
                          Anonim
                        </span>
                      </label>
                    </div>

                    {/* Textarea Container with embedded Emoji Trigger & Send Button */}
                    <div className="bg-[#141b2b] rounded-2xl p-3 border border-gray-800 focus-within:border-[#00e599]/60 transition flex flex-col justify-between min-h-[115px]">
                      <textarea
                        ref={mobileTextareaRef}
                        rows={3}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={
                          replyTarget
                            ? `Tulis balasan untuk @${replyTarget.name}...`
                            : "Tulis komentar kamu di sini..."
                        }
                        maxLength={1000}
                        className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none leading-relaxed block no-scrollbar flex-1"
                      />

                      {/* Embedded Inner Action Toolbar */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-gray-800/60 mt-2">
                        <div className="flex items-center space-x-2">
                          {/* Emoji Trigger Button */}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => setShowEmoji((prev) => !prev)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition active:scale-95 ${
                              showEmoji
                                ? "bg-[#00e599]/20 text-[#00e599] border border-[#00e599]/40 shadow-sm shadow-[#00e599]/20"
                                : "bg-[#1f2b42] text-gray-400 hover:text-white"
                            }`}
                            title="Pilih emoji"
                          >
                            <i className="fa-regular fa-face-smile text-base"></i>
                          </Button>

                          {/* Character counter */}
                          <span className="text-[10px] text-gray-500 font-medium select-none">
                            {content.length}/1000
                          </span>
                        </div>

                        {/* Embedded Send Button */}
                        <Button
                          type="button"
                          size="icon"
                          onClick={() => handleSubmit()}
                          disabled={submitting || !content.trim()}
                          className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#00e599] to-[#00b377] text-gray-950 font-bold flex items-center justify-center transition shadow-md shadow-[#00e599]/25 hover:shadow-[#00e599]/40 active:scale-95 disabled:opacity-30 disabled:grayscale shrink-0"
                          title="Kirim Komentar"
                        >
                          {submitting ? (
                            <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                          ) : (
                            <i className="fa-solid fa-arrow-up text-xs"></i>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Emoji Picker Popup (toggled inside modal) */}
                    <AnimatePresence>
                      {showEmoji && (
                        <EmojiPicker
                          onSelectEmoji={handleInsertEmoji}
                          onBackspace={handleBackspaceEmoji}
                          onClose={() => setShowEmoji(false)}
                          className="relative inset-x-0 w-full bg-[#131927] border border-gray-700/80 rounded-2xl shadow-xl p-3 z-[60] flex flex-col max-h-60 select-none"
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
