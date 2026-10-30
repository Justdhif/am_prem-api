"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface JsonViewerProps {
  code: string;
  className?: string;
}

export function JsonViewer({ code, className }: JsonViewerProps) {
  // Split tokens by single or double quoted strings
  const parts = code.split(/("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g);

  return (
    <pre className={cn("font-mono text-xs leading-relaxed whitespace-pre text-white", className)}>
      <code>
        {parts.map((part, index) => {
          const isQuoted =
            (part.startsWith('"') && part.endsWith('"')) ||
            (part.startsWith("'") && part.endsWith("'"));

          if (isQuoted) {
            return (
              <span key={index} className="text-[#00e599]">
                {part}
              </span>
            );
          }

          return (
            <span key={index} className="text-white">
              {part}
            </span>
          );
        })}
      </code>
    </pre>
  );
}
