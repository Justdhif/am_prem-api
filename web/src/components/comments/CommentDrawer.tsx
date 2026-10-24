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
      if (data && data.success) {
        setComments(data.comments || []);
        const currentPage = data.page ?? data.pagination?.page ?? targetPage;
        const totalP = data.totalPages ?? data.pagination?.totalPages ?? 1;
        const totalC = data.totalComments ?? data.pagination?.totalComments ?? (data.comments?.length || 0);
        setPage(currentPage);
        setTotalPages(totalP);
        setTotalComments(totalC);
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
  }): Promise<boolean> => {
    const res = await apiClient.postComment(payload);
    if (res.ok && res.data?.success) {
      setReplyTarget(null);
      await loadComments(page);
      return true;
    }
    return false;
  };

  return (
    <>
      {/* Floating Action Button (FAB) Bottom Right */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          id="btnToggleComments"
          type="button"
          aria-label="Buka Komentar"
          onClick={() => setIsOpen(true)}
          className="relative group p-3.5 bg-gradient-to-tr from-[#00e599] to-[#00b377] text-gray-950 rounded-full shadow-[0_0_25px_rgba(0,229,153,0.45)] hover:shadow-[0_0_35px_rgba(0,229,153,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border border-[#00e599]/40"
        >
          <i className="fa-solid fa-comments text-xl"></i>
          {totalComments > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] min-w-5 h-5 rounded-full px-1 flex items-center justify-center border-2 border-[#090d16] shadow-sm animate-pulse">
              {totalComments > 99 ? "99+" : totalComments}
            </span>
          )}
        </button>
      </div>

      {/* Backdrop */}
      <div
        id="commentBackdrop"
        aria-hidden="true"
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/65 backdrop-blur-sm z-50 transition-opacity duration-300",
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Right Drawer */}
      <div
        id="commentDrawer"
        role="dialog"
        aria-modal="true"
        aria-label="Panel Komentar Komunitas"
        className={cn(
          "fixed top-0 right-0 h-full w-full sm:w-[420px] max-w-full bg-[#090d16] border-l border-gray-800 shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between bg-[#0d121f] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00e599]/15 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
              <i className="fa-solid fa-comments text-sm"></i>
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-100 flex items-center space-x-1.5">
                <span>Komentar</span>
                <span className="text-[11px] font-semibold text-gray-400">
                  ({totalComments})
                </span>
              </h2>
              <p className="text-[11px] text-gray-400">Diskusi seputar Alight Motion Pro</p>
            </div>
          </div>
          <button
            id="btnCloseComments"
            type="button"
            aria-label="Tutup Komentar"
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-gray-200 transition flex items-center justify-center cursor-pointer"
          >
            <i className="fa-solid fa-xmark text-sm"></i>
          </button>
        </div>

        {/* Comment List Container */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 custom-scrollbar relative">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <LogoLoader />
              <p className="text-xs text-gray-400 mt-2 font-medium">Memuat komentar...</p>
            </div>
          ) : comments.length === 0 ? (
            <div className="py-16 text-center text-gray-400 text-xs">
              <i className="fa-regular fa-comment-dots text-3xl mb-2 text-gray-400 block"></i>
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
