"use client";

import { useState } from "react";
import { SendLinkForm } from "./SendLinkForm";
import { VerifyLinkForm } from "./VerifyLinkForm";
import { PresetFinderForm } from "./PresetFinderForm";
import { cn } from "@/lib/utils";

export function PlaygroundTab() {
  const [activeSubTab, setActiveSubTab] = useState<"send" | "verify" | "preset">("send");
  const [lastEmail, setLastEmail] = useState("");

  return (
    <div className="space-y-6">
      {/* Tester Banner */}
      <div className="p-4 rounded-xl bg-[#00e599]/10 border border-[#00e599]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-gray-300">
        <div className="flex items-center space-x-2.5">
          <i className="fa-solid fa-flask text-base text-[#00e599] shrink-0"></i>
          <div>
            <span className="font-bold text-white block">API Playground Tester</span>
            <span className="text-gray-400 text-[11px]">
              Kirim request langsung ke server backend tanpa perlu membuka cURL atau Postman.
            </span>
          </div>
        </div>
      </div>

      {/* Sub Navigation Pills */}
      <div className="flex items-center space-x-2 border-b border-gray-800 pb-3 overflow-x-auto no-scrollbar">
        <button
          type="button"
          onClick={() => setActiveSubTab("send")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer shrink-0 active:scale-95",
            activeSubTab === "send"
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/80"
          )}
        >
          <span className="w-4 h-4 rounded-full bg-gray-950/20 text-center text-[10px] font-black leading-4 inline-block">1</span>
          <span>1. Kirim Magic Link</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("verify")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer shrink-0 active:scale-95",
            activeSubTab === "verify"
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/80"
          )}
        >
          <span className="w-4 h-4 rounded-full bg-gray-950/20 text-center text-[10px] font-black leading-4 inline-block">2</span>
          <span>2. Verifikasi &amp; Aktivasi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("preset")}
          className={cn(
            "px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-2 cursor-pointer shrink-0 active:scale-95",
            activeSubTab === "preset"
              ? "bg-[#00e599] text-gray-950 shadow-md shadow-[#00e599]/20"
              : "text-gray-400 hover:text-white hover:bg-gray-800/80"
          )}
        >
          <span className="w-4 h-4 rounded-full bg-gray-950/20 text-center text-[10px] font-black leading-4 inline-block">3</span>
          <span>3. Cari Preset (VT/YT)</span>
        </button>
      </div>

      {/* Sub Tab Contents */}
      {activeSubTab === "send" && (
        <SendLinkForm onSuccessEmail={(em) => setLastEmail(em)} />
      )}
      {activeSubTab === "verify" && (
        <VerifyLinkForm initialEmail={lastEmail} />
      )}
      {activeSubTab === "preset" && (
        <PresetFinderForm />
      )}
    </div>
  );
}
