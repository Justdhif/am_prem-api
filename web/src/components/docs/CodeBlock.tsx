"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  curlSnippet?: string;
  isSuccessResponse?: boolean;
  className?: string;
}

export function CodeBlock({
  code,
  curlSnippet,
  isSuccessResponse,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!curlSnippet) return;
    try {
      await navigator.clipboard.writeText(curlSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <div className="relative group">
      <pre
        className={cn(
          "bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs overflow-x-auto border border-gray-800/80 font-mono leading-relaxed",
          isSuccessResponse ? "text-[#00e599]" : "text-gray-300",
          className
        )}
      >
        <code>{code}</code>
      </pre>

      {curlSnippet && (
        <button
          type="button"
          onClick={handleCopy}
          className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-medium transition active:scale-95 flex items-center space-x-1 border border-gray-700/60 shadow-sm cursor-pointer"
          title="Salin perintah cURL"
        >
          <i
            className={cn(
              "text-[10px]",
              copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy"
            )}
          ></i>
          <span>{copied ? "Tersalin!" : "Salin cURL"}</span>
        </button>
      )}
    </div>
  );
}
