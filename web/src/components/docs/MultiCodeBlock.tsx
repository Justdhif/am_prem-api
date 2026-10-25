"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export interface CodeSnippet {
  language: "curl" | "javascript" | "python" | "php";
  label: string;
  code: string;
}

interface MultiCodeBlockProps {
  snippets: CodeSnippet[];
  className?: string;
}

export function MultiCodeBlock({ snippets, className }: MultiCodeBlockProps) {
  const [activeLang, setActiveLang] = useState<string>(snippets[0]?.language || "curl");
  const [copied, setCopied] = useState(false);

  const currentSnippet = snippets.find((s) => s.language === activeLang) || snippets[0];

  const handleCopy = async () => {
    if (!currentSnippet) return;
    try {
      await navigator.clipboard.writeText(currentSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error("Failed to copy", e);
    }
  };

  return (
    <div className={cn("rounded-xl border border-gray-800 bg-[#0d121f] overflow-hidden shadow-md", className)}>
      {/* Header bar with language switcher tabs & copy button */}
      <div className="flex items-center justify-between px-3 py-2 bg-[#121826]/90 border-b border-gray-800/80">
        <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
          {snippets.map((s) => {
            const isActive = s.language === activeLang;
            return (
              <button
                key={s.language}
                type="button"
                onClick={() => setActiveLang(s.language)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer select-none",
                  isActive
                    ? "bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="px-2.5 py-1 rounded-lg bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-[11px] font-medium transition active:scale-95 flex items-center space-x-1.5 border border-gray-700/60 cursor-pointer shrink-0 ml-2"
          title="Salin cuplikan kode"
        >
          <i
            className={cn(
              "text-[10px]",
              copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy"
            )}
          ></i>
          <span>{copied ? "Tersalin!" : "Salin"}</span>
        </button>
      </div>

      {/* Code body */}
      <div className="p-3.5 sm:p-4 overflow-x-auto custom-scrollbar">
        <pre className="font-mono text-xs leading-relaxed text-gray-300 whitespace-pre">
          <code>{currentSnippet?.code}</code>
        </pre>
      </div>
    </div>
  );
}
