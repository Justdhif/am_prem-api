"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";

interface VerifyLinkFormProps {
  initialEmail?: string;
}

export function VerifyLinkForm({ initialEmail = "" }: VerifyLinkFormProps) {
  const [email, setEmail] = useState(initialEmail);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("{}");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!link) return;

    setLoading(true);
    setOutput("Memverifikasi magic link...");

    try {
      const res = await apiClient.verifyLink(email, link);
      setOutput(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setOutput(JSON.stringify({ error: err.message || "Gagal menghubungi API" }, null, 2));
    } finally {
      setLoading(false);
    }
  };

  const handleFillSample = () => {
    setEmail("user@gmail.com");
    setLink("https://alightcreative.com/?link=https://alightcreative.com/am/share/&apn=com.alightcreative.motion&oobCode=sample_oob_code_12345");
  };

  return (
    <Card className="space-y-4">
      <CardHeader className="border-b border-gray-800/80 pb-4">
        <div className="flex items-center space-x-2">
          <span className="w-5 h-5 rounded-md bg-[#00e599] text-gray-950 font-black flex items-center justify-center text-[10px] shrink-0">
            2
          </span>
          <CardTitle className="text-sm sm:text-base">
            Uji Coba Verifikasi &amp; Aktivasi Alight Motion Premium
          </CardTitle>
        </div>
        <CardDescription>
          Tempelkan full link yang Anda terima di email untuk mengaktifkan lisensi Premium 1 Tahun resmi.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 pt-1">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Target Email <span className="text-[#00e599]">*</span>
            </label>
            <div className="flex items-center bg-[#0d121f] rounded-xl px-3.5 py-2.5 border border-gray-700/80 focus-within:border-[#00e599] transition">
              <i className="fa-regular fa-envelope text-gray-500 mr-2.5 text-xs"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@gmail.com"
                className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Magic Link / OOB Code dari Email <span className="text-[#00e599]">*</span>
            </label>
            <div className="flex items-start bg-[#0d121f] rounded-xl px-3.5 py-2.5 border border-gray-700/80 focus-within:border-[#00e599] transition">
              <i className="fa-solid fa-link text-gray-500 mr-2.5 mt-1 text-xs shrink-0"></i>
              <textarea
                required
                rows={2}
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://alightcreative.com/?link=... atau oobCode"
                className="bg-transparent border-0 p-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none w-full resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
            <button
              type="button"
              onClick={handleFillSample}
              className="px-3 py-1.5 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs font-medium transition active:scale-95 cursor-pointer"
            >
              <i className="fa-regular fa-paste mr-1 text-[11px]"></i>Isi Contoh Data
            </button>
            <Button type="submit" disabled={loading} size="sm">
              {loading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs mr-1.5"></i>
                  <span>Mengaktivasi...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-shield-halved text-xs mr-1.5"></i>
                  <span>Verifikasi &amp; Aktivasi</span>
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="space-y-1.5 pt-2">
          <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block">
            Response Output
          </span>
          <pre className="bg-[#0d121f] p-3 sm:p-4 rounded-xl text-xs overflow-x-auto border border-gray-800 font-mono text-gray-300 max-h-56 leading-relaxed">
            <code>{output}</code>
          </pre>
        </div>
      </CardContent>
    </Card>
  );
}
