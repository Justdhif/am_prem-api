"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
                  "px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer select-none relative",
                  isActive
                    ? "bg-[#00e599]/15 text-[#00e599] border border-[#00e599]/30"
                    : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60 border border-transparent"
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={handleCopy}
          className="h-7 px-2.5 py-1 text-[11px] font-medium transition active:scale-95 flex items-center space-x-1.5 border border-gray-700/60 shrink-0 ml-2"
          title="Salin cuplikan kode"
        >
          <i
            className={cn(
              "text-[10px]",
              copied ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy"
            )}
          ></i>
          <span>{copied ? "Tersalin!" : "Salin"}</span>
        </Button>
      </div>

      {/* Code body with smooth transition */}
      <div className="p-3.5 sm:p-4 overflow-x-auto custom-scrollbar min-h-[90px]">
        <AnimatePresence mode="wait">
          <motion.pre
            key={activeLang}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="font-mono text-xs leading-relaxed text-gray-300 whitespace-pre"
          >
            <code>{currentSnippet?.code}</code>
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}
