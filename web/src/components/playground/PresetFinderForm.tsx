"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

export function PresetFinderForm() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("{}");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setOutput("Memindai komentar & deskripsi video...");

    try {
      const res = await apiClient.findPreset(url);
      setOutput(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setOutput(JSON.stringify({ error: err.message || "Gagal menghubungi API" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleFillTikTokSample = () => {
    setUrl("https://vt.tiktok.com/ZSxxxxxxx/");
  };

  const handleFillYouTubeSample = () => {
    setUrl("https://youtu.be/dQw4w9WgXcQ");
  };

  return (
    <Card className="space-y-4">
      <CardHeader className="border-b border-gray-800/80 pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-md bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-[10px] shrink-0">
            3
          </span>
          <CardTitle className="text-sm sm:text-base">
            Uji Coba Multi-Platform Find Preset (TikTok &amp; YouTube)
          </CardTitle>
        </div>
        <CardDescription>
          Tempelkan link video TikTok atau YouTube. Sistem akan memindai deskripsi dan komentar untuk menemukan link preset (alightcreative / drive) atau info join saluran.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              URL Video TikTok / YouTube <span className="text-[#00e599]">*</span>
            </label>
            <div className="flex items-start bg-[#0d121f] rounded-xl px-3.5 py-2.5 border border-gray-700/80 focus-within:border-[#00e599] transition">
              <i className="fa-brands fa-tiktok text-gray-500 mr-2.5 mt-1 text-xs shrink-0"></i>
              <textarea
                required
                rows={2}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://vt.tiktok.com/ZSxxxxxxx/ atau https://youtu.be/xxxx atau https://youtube.com/watch?v=xxxx"
                className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={handleFillTikTokSample}
                className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <i className="fa-brands fa-tiktok text-[11px]"></i>
                <span>Contoh TikTok</span>
              </button>
              <button
                type="button"
                onClick={handleFillYouTubeSample}
                className="px-2.5 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition active:scale-95 cursor-pointer flex items-center space-x-1"
              >
                <i className="fa-brands fa-youtube text-[11px] text-red-400"></i>
                <span>Contoh YouTube</span>
              </button>
            </div>
            <Button type="submit" disabled={loading} size="sm">
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs mr-1.5"></i>
                  <span>Memindai...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-magnifying-glass text-xs mr-1.5"></i>
                  <span>Cari Preset</span>
                </>
              )}
            </Button>
          </div>
        </form>

        <motion.div
          layout
          className="space-y-1.5 pt-2"
        >
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Response Output
          </span>
          <pre className="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs overflow-x-auto border border-gray-800 font-mono text-gray-300 max-h-56 leading-relaxed transition-all">
            <code>{output}</code>
          </pre>
        </motion.div>
      </CardContent>
    </Card>
  );
}
