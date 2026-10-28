"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiPicker } from "./EmojiPicker";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const displayName = isAnonymous ? "Anonim" : name.trim() || "User";
  const avatarUrl = isAnonymous
    ? "https://ui-avatars.com/api/?name=Anonim&background=1f2b42&color=94a3b8&bold=true"
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(
        displayName
      )}&background=00e599&color=0d121f&bold=true`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || submitting) return;

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
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
    setSubmitting(false);
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 112)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInsertEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleBackspaceEmoji = () => {
    setContent((prev) => Array.from(prev).slice(0, -1).join(""));
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="bg-[#0d121f] px-3 pb-3 pt-2 shrink-0 relative border-t border-gray-800/80">
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
            <button
              type="button"
              onClick={onCancelReply}
              className="text-gray-500 hover:text-white text-xs cursor-pointer flex items-center"
            >
              <i className="fa-solid fa-xmark mr-1"></i>Batal
            </button>
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
            ref={textareaRef}
            rows={1}
            value={content}
            onChange={handleTextareaInput}
            onKeyDown={handleKeyDown}
            placeholder="Tambahkan komentar..."
            required
            maxLength={1000}
            className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-400 focus:outline-none w-full resize-none leading-relaxed max-h-28 overflow-y-auto block no-scrollbar"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowEmoji((prev) => !prev)}
          className="w-9 h-9 rounded-full bg-[#1a2234] hover:bg-gray-800 text-gray-400 hover:text-[#00e599] flex items-center justify-center transition shadow-md shrink-0 active:scale-95 mb-0.5 border border-transparent hover:border-gray-700 cursor-pointer"
          title="Pilih emoji"
        >
          <i className="fa-regular fa-face-smile text-lg"></i>
        </button>

        <button
          type="submit"
          disabled={submitting || !content.trim()}
          className="w-9 h-9 rounded-full bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold flex items-center justify-center transition shadow-md shrink-0 active:scale-95 disabled:opacity-40 mb-0.5 cursor-pointer"
        >
          {submitting ? (
            <i className="fa-solid fa-spinner fa-spin text-xs"></i>
          ) : (
            <i className="fa-solid fa-arrow-up text-sm"></i>
          )}
        </button>
      </form>
    </div>
  );
}
