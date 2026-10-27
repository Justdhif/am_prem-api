"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { MultiCodeBlock, CodeSnippet } from "./MultiCodeBlock";
import { cn } from "@/lib/utils";

export interface EndpointParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface ResponseSample {
  status: number;
  statusText: string;
  payload: string;
  isError?: boolean;
}

interface EndpointCardProps {
  id: string;
  method: "POST" | "GET";
  path: string;
  title: string;
  description: string;
  parameters?: EndpointParam[];
  requestSnippets?: CodeSnippet[];
  responses: ResponseSample[];
  tip?: string;
}

export function EndpointCard({
  id,
  method,
  path,
  title,
  description,
  parameters,
  requestSnippets,
  responses,
  tip,
}: EndpointCardProps) {
  const [activeResponseIndex, setActiveResponseIndex] = useState(0);
  const [copiedPath, setCopiedPath] = useState(false);

  const activeResponse = responses[activeResponseIndex] || responses[0];

  const handleCopyPath = () => {
    navigator.clipboard.writeText(path);
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  return (
    <div
      id={id}
      className="p-5 sm:p-6 rounded-2xl bg-[#121826] border border-gray-800 shadow-xl space-y-5 scroll-mt-32 text-left transition hover:border-gray-700/80"
    >
      {/* Endpoint Header */}
      <div className="space-y-2 border-b border-gray-800/80 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex items-center space-x-2.5">
            <Badge variant={method === "POST" ? "methodPost" : "methodGet"}>
              {method}
            </Badge>
            <code className="text-white font-mono text-xs sm:text-sm font-bold bg-[#0d121f] px-2.5 py-1 rounded-lg border border-gray-800">
              {path}
            </code>
            <button
              type="button"
              onClick={handleCopyPath}
              className="p-1.5 text-gray-500 hover:text-white transition active:scale-95 cursor-pointer text-xs"
              title="Salin path endpoint"
            >
              <i className={cn(copiedPath ? "fa-solid fa-check text-[#00e599]" : "fa-regular fa-copy")}></i>
            </button>
          </div>
        </div>

        <h3 className="text-base sm:text-lg font-bold text-white tracking-tight pt-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Parameter Schema Table */}
      {parameters && parameters.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center space-x-2 text-xs font-bold text-gray-300">
            <i className="fa-solid fa-sliders text-[#00e599] text-xs"></i>
            <span>Parameter Request Body</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-800 bg-[#0d121f]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121826]/80 text-gray-400 border-b border-gray-800 font-semibold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-3.5 py-2.5">Field</th>
                  <th className="px-3.5 py-2.5">Tipe</th>
                  <th className="px-3.5 py-2.5">Wajib</th>
                  <th className="px-3.5 py-2.5">Deskripsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/80 text-gray-300 font-mono text-[11px]">
                {parameters.map((param) => (
                  <tr key={param.name} className="hover:bg-gray-800/30 transition">
                    <td className="px-3.5 py-2.5 font-bold text-white">
                      {param.name}
                    </td>
                    <td className="px-3.5 py-2.5 text-[#00e599]/90">
                      {param.type}
                    </td>
                    <td className="px-3.5 py-2.5 font-sans">
                      {param.required ? (
                        <span className="text-amber-400 font-semibold text-[10px] bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/25">
                          Required
                        </span>
                      ) : (
                        <span className="text-gray-500 font-normal text-[10px] bg-gray-800 px-2 py-0.5 rounded-full">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="px-3.5 py-2.5 font-sans text-gray-400 leading-relaxed">
                      {param.description}
                      {param.example && (
                        <span className="block text-[11px] text-gray-500 font-mono mt-0.5">
                          Contoh: <code className="text-gray-300">{param.example}</code>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tip / Note Box */}
      {tip && (
        <div className="p-3.5 rounded-xl bg-[#00e599]/10 border border-[#00e599]/25 text-[#00e599] text-xs flex items-start space-x-2.5">
          <i className="fa-solid fa-circle-info text-sm shrink-0 mt-0.5"></i>
          <span className="text-gray-300 text-[11px] leading-relaxed">
            <strong className="text-[#00e599]">Tips Praktis:</strong> {tip}
          </span>
        </div>
      )}

      {/* Multi-language Request Samples */}
      {requestSnippets && requestSnippets.length > 0 && (
        <div className="space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Contoh Request
          </span>
          <MultiCodeBlock snippets={requestSnippets} />
        </div>
      )}

      {/* Response Samples with Status Code Switcher */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Contoh Response
          </span>

          {/* Response Status Tabs */}
          <div className="flex items-center space-x-1.5">
            {responses.map((res, idx) => {
              const isSelected = idx === activeResponseIndex;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveResponseIndex(idx)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition cursor-pointer select-none border",
                    isSelected
                      ? res.isError
                        ? "bg-red-500/15 text-red-400 border-red-500/30"
                        : "bg-[#00e599]/15 text-[#00e599] border-[#00e599]/30"
                      : "text-gray-500 border-gray-800 hover:text-gray-300 bg-[#0d121f]"
                  )}
                >
                  <span>{res.status} {res.statusText}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl border border-gray-800 bg-[#0d121f] p-3.5 sm:p-4 overflow-x-auto custom-scrollbar">
          <pre
            className={cn(
              "font-mono text-xs leading-relaxed whitespace-pre",
              activeResponse.isError ? "text-red-400" : "text-[#00e599]"
            )}
          >
            <code>{activeResponse.payload}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
