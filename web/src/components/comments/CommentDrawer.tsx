"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { apiClient, CommentItem as CommentItemType } from "@/lib/api";
import { CommentItem } from "./CommentItem";
import { CommentInput } from "./CommentInput";
import { LogoLoader } from "./LogoLoader";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";

export function CommentDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<CommentItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalComments, setTotalComments] = useState(0);
  const [replyTarget, setReplyTarget] = useState<{ id: string; name: string } | null>(null);
  const [isMiniPlayerActive, setIsMiniPlayerActive] = useState(() => {
    if (typeof window !== "undefined" && typeof (window as any).__isMiniPlayerVisible === "boolean") {
      return (window as any).__isMiniPlayerVisible;
    }
    return true;
  });

  // Synchronize FAB position with MusicPlayer mini player visibility
  useEffect(() => {
    const handler = (e: Event) => {
      const customEvent = e as CustomEvent<boolean>;
      if (typeof customEvent.detail === "boolean") {
        setIsMiniPlayerActive(customEvent.detail);
      }
    };
    window.addEventListener("miniPlayerVisibility", handler);
    return () => window.removeEventListener("miniPlayerVisibility", handler);
  }, []);

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

  // Fetch comments: if open, fetch immediately; otherwise defer to idle to save initial TBT
  useEffect(() => {
    if (isOpen) {
      loadComments(1);
      return;
    }

    const timer = setTimeout(() => {
      loadComments(1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [isOpen, loadComments]);

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
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Floating Action Button (FAB) */}
      <div
        className={cn(
          "fixed right-4 sm:right-6 z-[135] transition-all duration-500 ease-in-out",
          isMiniPlayerActive
            ? "bottom-[80px] sm:bottom-[84px] lg:bottom-6"
            : "bottom-5 sm:bottom-6 lg:bottom-6"
        )}
      >
        <motion.button
          id="btnToggleComments"
          type="button"
          aria-label="Buka Komentar"
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative group w-12 h-12 sm:w-[52px] sm:h-[52px] aspect-square shrink-0 bg-gradient-to-tr from-[#00e599] to-[#00b377] text-gray-950 rounded-full shadow-[0_0_25px_rgba(0,229,153,0.45)] hover:shadow-[0_0_35px_rgba(0,229,153,0.7)] transition-shadow duration-300 flex items-center justify-center cursor-pointer border border-[#00e599]/40"
        >
          <i className="fa-solid fa-comments text-lg sm:text-xl flex items-center justify-center leading-none"></i>
          {totalComments > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-extrabold text-[10px] min-w-5 h-5 rounded-full px-1 flex items-center justify-center border-2 border-[#090d16] shadow-sm select-none">
              {totalComments > 99 ? "99+" : totalComments}
            </span>
          )}
        </motion.button>
      </div>

      {/* Sheet Content Panel */}
      <SheetContent
        id="commentDrawer"
        side="right"
        aria-label="Panel Komentar Komunitas"
        className="p-0 border-l border-gray-800 shadow-2xl z-[310] flex flex-col w-full sm:w-[420px] max-w-full bg-[#090d16]"
      >
        {/* Header */}
        <SheetHeader className="px-5 py-3.5 border-b border-gray-800 flex items-center justify-between bg-[#0d121f] shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00e599]/15 border border-[#00e599]/30 flex items-center justify-center text-[#00e599]">
              <i className="fa-solid fa-comments text-sm"></i>
            </div>
            <div>
              <SheetTitle className="text-sm font-bold text-gray-100 flex items-center space-x-1.5">
                <span>Komentar</span>
                <span className="text-[11px] font-semibold text-gray-400">
                  ({totalComments})
                </span>
              </SheetTitle>
              <SheetDescription className="text-[11px] text-gray-400">
                Diskusi seputar Alight Motion Pro
              </SheetDescription>
            </div>
          </div>
          <SheetClose asChild>
            <Button
              id="btnCloseComments"
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Tutup Komentar"
              className="w-8 h-8 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-400 hover:text-gray-200"
            >
              <i className="fa-solid fa-xmark text-sm"></i>
            </Button>
          </SheetClose>
        </SheetHeader>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5 custom-scrollbar relative overscroll-contain">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <LogoLoader />
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
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page <= 1 || loading}
            onClick={() => loadComments(page - 1)}
            className="h-7 px-2.5 py-1 text-[11px] font-semibold space-x-1"
          >
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
            <span>Sebelumnya</span>
          </Button>

          <span className="font-medium text-gray-400 text-[11px] font-mono">
            Hal {page} dari {totalPages}
          </span>

          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={page >= totalPages || loading}
            onClick={() => loadComments(page + 1)}
            className="h-7 px-2.5 py-1 text-[11px] font-semibold space-x-1"
          >
            <span>Selanjutnya</span>
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </Button>
        </div>

        {/* Bottom Input Form */}
        <CommentInput
          replyTarget={replyTarget}
          onCancelReply={handleCancelReply}
          onSubmit={handleCommentSubmit}
        />
      </SheetContent>
    </Sheet>
  );
}
