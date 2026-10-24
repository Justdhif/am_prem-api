"use client";

import { useEffect, useState, useCallback } from "react";
import { apiClient, CommentItem as CommentItemType } from "@/lib/api";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { LogoLoader } from "./LogoLoader";
import { cn } from "@/lib/utils";

export function CommentDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);

  const loadComments = useCallback(async (targetPage = 1) => {
    setLoading(true);
    try {
      const data = await apiClient.getComments(targetPage);
      if (data.success) {
        setComments(data.comments || []);
        setPage(data.pagination.page);
        setTotalPages(data.pagination.totalPages || 1);
        setTotalComments(data.pagination.totalComments || 0);
      }
    } catch (err) {
      console.error("Failed to load comments", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadComments(1);
  }, [loadComments]);

  const handleReplyClick = (id: string, name: string) => {
    setReplyTarget({ id, name });
  };

  const handleCancelReply = () => {
    setReplyTarget(null);
  };

  const handleCommentSubmit = async (payload: {
    name: string;
    isAnonymous: boolean;
    content: string;
    parentId?: string;
  }) => {
    try {
      const res = await apiClient.postComment(payload);
      if (res.ok && res.data.success) {
        setReplyTarget(null);
        await loadComments(payload.parentId ? page : 1);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Failed to post comment", e);
      return false;
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "lg:hidden fixed inset-0 w-full h-full bg-black/80 backdrop-blur-md z-[99] transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Floating Action Button (Mobile Only) */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-5 sm:right-8 z-40 flex items-center space-x-2 px-4 py-3 rounded-full bg-[#00e599] hover:bg-[#1affaa] text-gray-950 font-bold text-xs sm:text-sm shadow-xl shadow-[#00e599]/30 transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <i className="fa-solid fa-comment-dots text-base"></i>
        <span>Komentar</span>
        <span className="px-2 py-0.5 rounded-full bg-gray-950/20 text-gray-950 text-xs font-black">
          {totalComments}
        </span>
      </button>

      {/* Comment Drawer (Desktop Sidebar & Mobile Slide-up Sheet) */}
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 z-[100] max-w-lg mx-auto w-full h-[85vh] max-h-[760px] bg-[#0d121f] text-white rounded-t-3xl border-t border-x border-gray-800/80 shadow-2xl flex flex-col transition-transform duration-300 ease-out",
          "lg:static lg:transform-none lg:translate-y-0 lg:z-auto lg:max-w-none lg:w-[380px] xl:w-[420px] lg:h-[calc(100vh-6.5rem)] lg:max-h-[850px] lg:rounded-2xl lg:border lg:border-gray-800/80 lg:shadow-xl lg:sticky lg:top-20 lg:shrink-0",
          isOpen ? "translate-y-0" : "translate-y-full lg:translate-y-0"
        )}
      >
        {/* Header Sheet */}
        <div className="px-4 pt-2.5 pb-2 border-b border-gray-800/80 shrink-0 select-none">
          <div
            onClick={() => setIsOpen(false)}
            className="w-10 h-1 bg-gray-600 rounded-full mx-auto mb-2 cursor-pointer lg:hidden"
          />
          <div className="relative flex items-center justify-center lg:justify-between">
            <h3 className="font-bold text-sm sm:text-base text-white flex items-center">
              <span>{totalComments}</span>&nbsp;komentar
            </h3>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="lg:hidden absolute right-0 p-1 text-gray-400 hover:text-white transition cursor-pointer"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>
          </div>
        </div>

        {/* Scrollable Comments Feed */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 overscroll-contain flex flex-col">
          {loading ? (
            <LogoLoader text="Memuat komentar..." />
          ) : comments.length === 0 ? (
            <div className="m-auto text-center py-16 text-gray-500 text-xs">
              <i className="fa-regular fa-comment-dots text-3xl block mb-2 text-gray-600"></i>
              Belum ada komentar. Jadilah yang pertama berkomentar!
            </div>
          ) : (
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                onReply={handleReplyClick}
              />
            ))
          )}
        </div>

        {/* Pagination Bar */}
        <div className="px-3.5 py-2 border-t border-gray-800/80 bg-[#0d121f] flex items-center justify-between text-xs text-gray-400 select-none shrink-0">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => loadComments(page - 1)}
            className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none text-gray-300 text-[11px] font-semibold transition flex items-center space-x-1 cursor-pointer"
          >
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
            <span>Sebelumnya</span>
          </button>

          <span className="font-medium text-gray-400 text-[11px]">
            Hal {page} dari {totalPages}
          </span>

          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => loadComments(page + 1)}
            className="px-2.5 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-30 disabled:pointer-events-none text-gray-300 text-[11px] font-semibold transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Selanjutnya</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>

        {/* Bottom Input Form */}
        <CommentInput
          replyTarget={replyTarget}
          onCancelReply={handleCancelReply}
          onSubmit={handleCommentSubmit}
        />
      </div>
    </>
  );
}
