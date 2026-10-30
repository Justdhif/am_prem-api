"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CommentItem as CommentItemType } from "@/lib/api";
import { Button } from "@/components/ui/button";

interface CommentItemProps {
  comment: CommentItemType;
  onReply: (id: string, name: string) => void;
}

export function CommentItem({ comment, onReply }: CommentItemProps) {
  const avatarUrl =
    comment.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      comment.name || "Anonim"
    )}&background=1f2b42&color=94a3b8&bold=true`;

  return (
    <motion.div
      id={`comment-${comment.id}`}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      className="flex items-start space-x-3 text-xs"
    >
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-gray-700/80 shrink-0 mt-0.5">
        <Image
          src={avatarUrl}
          alt={comment.name || "Avatar"}
          width={36}
          height={36}
          unoptimized
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="font-semibold text-gray-400 text-xs">
            {comment.name || "Anonim"}
          </span>

          {comment.isAnonymous && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#1f2937] text-[#9ca3af] font-normal border border-gray-700/60">
              Anonim
            </span>
          )}

          {comment.replyToName && (
            <span className="text-[10px] text-gray-500 font-normal">
              &gt; <span className="text-gray-400 font-semibold">{comment.replyToName}</span>
            </span>
          )}
        </div>

        <p className="text-xs sm:text-sm text-gray-100 font-normal mt-0.5 leading-relaxed break-words whitespace-pre-line">
          {comment.content}
        </p>

        <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-gray-500">
          <span>{comment.formattedTime || "Baru saja"}</span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onReply(comment.id, comment.name || "Anonim")}
            className="h-auto p-0 font-bold text-gray-400 hover:text-white text-[11px] hover:bg-transparent"
          >
            Balas
          </Button>
        </div>

        {/* Nested Replies */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-3 pl-3 sm:pl-4 space-y-3 border-l border-gray-800/80">
            {comment.replies.map((reply) => (
              <CommentItem key={reply.id} comment={reply} onReply={onReply} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
