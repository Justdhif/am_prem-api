# Design Specification: Restrukturisasi Proyek (api & web)

## 1. Ringkasan & Tujuan
Merestrukturisasi repositori proyek menjadi 2 sub-project independen dalam satu repository:
1. **`api/`**: Service backend Express.js (Clean Architecture) yang saat ini berjalan, mempertahankan seluruh domain logic, use case, gateway, automated tests, dan endpoint.
2. **`web/`**: Aplikasi frontend modern berbasis **Next.js (App Router, TypeScript, `src/` directory)** dengan **Tailwind CSS** dan komponen **shadcn/ui** yang mengadopsi seluruh fungsionalitas dan tampilan dashboard Alight Motion Pro.

---

## 2. Pendekatan Arsitektur (Pendekatan A: Simple Subfolders)
Struktur root direktori:
```text
alight_motion-prem/
├── api/                  # Express.js Backend (Clean Architecture)
│   ├── src/
│   │   ├── application/
│   │   ├── domain/
│   │   ├── infrastructure/
│   │   └── presentation/
│   ├── test/
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
├── web/                  # Next.js Frontend (App Router, TypeScript, shadcn/ui)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/        # shadcn/ui components (card, button, input, textarea, tabs, badge, etc.)
│   │   │   ├── layout/    # Header, Footer
│   │   │   ├── dashboard/ # HeroStats, StepsCard, FaqSection, WhatsAppBanner
│   │   │   ├── docs/      # EndpointCard, CodeBlock, CopyCurlButton
│   │   │   ├── playground/# SendLinkForm, VerifyLinkForm, PresetFinderForm
│   │   │   └── comments/  # CommentDrawer, CommentList, CommentItem, CommentInput, EmojiPicker
│   │   └── lib/
│   │       ├── api.ts     # Client fetcher ke backend API (menggunakan NEXT_PUBLIC_API_URL)
│   │       └── utils.ts   # Helper cn() dari shadcn
│   ├── public/
│   │   └── logo.jpg
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── .env.example
├── docs/
└── README.md
```

---

## 3. Rencana Komponen Frontend (`web/`)
- **UI Components (shadcn/ui style)**:
  - `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
  - `Button`
  - `Input` & `Textarea`
  - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
  - `Badge` (metode HTTP & badge `[Anonim]`)
  - `Checkbox` (toggle Anonim)
  - `Toast` (notifikasi copy cURL & komentar)
  - `Sheet` / `Dialog` (mobile comment drawer & emoji keyboard)
- **Desain & Tema**:
  - Estetika khas Alight Motion: Midnight Dark (`#0d121f` & `#131927`) dengan aksen Neon Mint (`#00e599`).
  - Font: Plus Jakarta Sans & JetBrains Mono untuk code snippet.
- **Koneksi ke Backend**:
  - Konfigurasi `NEXT_PUBLIC_API_URL` (default: `http://localhost:3000`).
  - Interaksi form playground (`/api/am/send-link`, `/api/am/verify`, `/api/am/preset/find`).
  - Fetching stats (`/api/am/stats`) & komentar (`/api/comments`) realtime dengan pagination dan animated SVG logo loader.

---

## 4. Rencana Migrasi Backend (`api/`)
- Memindahkan file proyek backend saat ini ke folder `api/`.
- Memperbarui path script (`build`, `start`, `test`) di `api/package.json`.
- Di backend Express, endpoint `/dashboard` dan `/` dapat tetap menyediakan HTML fallback sederhana atau melakukan redirect ke URL frontend Next.js.
- CORS dikonfigurasi agar frontend Next.js (misal port 3000 atau 3001) dapat memanggil endpoint API tanpa kendala.

---

## 5. Verifikasi & Pengujian
1. Menjalankan `npm test` di `api/` untuk memastikan seluruh automated tests backend lulus 100%.
2. Menjalankan `npm run build` di `api/` untuk memastikan TypeScript backend berhasil ter-compile.
3. Menjalankan `npm run build` di `web/` untuk memastikan Next.js App Router dan komponen shadcn/ui ter-compile tanpa error.
4. Verifikasi fungsionalitas (Docs, Playground tester, Comment drawer with replies & emoji picker, Preset finder).
