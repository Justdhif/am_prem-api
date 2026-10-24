# Alight Motion Pro VIP Automation & API Monorepo

Project monorepo yang memisahkan backend service REST API dan web view frontend modern berbasis Next.js App Router dengan komponen shadcn/ui.

---

## 📁 Struktur Monorepo

```text
alight_motion-prem/
├── api/                  # Backend Express.js (Clean Architecture)
│   ├── src/
│   │   ├── application/  # Use cases, DTOs
│   │   ├── domain/       # Entities, Gateway & Repository interfaces
│   │   ├── infrastructure/ # External Firebase, TikTok, YouTube gateways, Postgres/File repos
│   │   └── presentation/ # Express controllers, routes, middlewares
│   ├── test/             # 8 Automated Clean Architecture Test Suites
│   ├── package.json
│   └── tsconfig.json
│
├── web/                  # Frontend Next.js (App Router, TypeScript, shadcn/ui)
│   ├── src/
│   │   ├── app/          # layout.tsx, page.tsx, globals.css
│   │   ├── components/   # shadcn/ui, layout, docs, playground, comments
│   │   └── lib/          # apiClient, cn utils
│   ├── public/           # Static logos & icons
│   ├── package.json
│   └── tailwind.config.ts
│
├── docs/                 # Specifications & Implementation Plans
└── package.json          # Root script orchestrator
```

---

## 🚀 Panduan Memulai (Getting Started)

### 1. Instalasi Dependensi
Jalankan instalasi dependensi pada masing-masing sub-project:
```bash
# Install backend dependencies
cd api && npm install

# Install frontend dependencies
cd ../web && npm install
```

### 2. Menjalankan Mode Development
Dari root direktori, Anda dapat menjalankan:

```bash
# Menjalankan Express API (port 3000)
npm run dev:api

# Menjalankan Next.js Web View (port 3001 atau 3000)
npm run dev:web
```

### 3. Menjalankan Automated Tests & Build
```bash
# Menjalankan 8 automated test suites backend API
npm run test:api

# Build kedua sub-project
npm run build:api
npm run build:web
```

---

## 🎨 Fitur Web View (`web/`)
- **Desain Khas Alight Motion**: Midnight Navy (`#0d121f` & `#131927`) dengan aksen Neon Mint (`#00e599`).
- **Komponen shadcn/ui**: Card, Button, Input, Textarea, Tabs, Badge (`[Anonim]`, method HTTP), Checkbox.
- **Tab Docs**: Dokumentasi API lengkap, dark CodeBlock dengan tombol copy cURL, contoh perintah bot WA, dan FAQ.
- **Tab Playground**: Form interaktif langsung untuk Kirim Link, Verifikasi & Aktivasi, serta Multi-Platform Preset Finder (TikTok & YouTube).
- **TikTok-style Comment Drawer**: Floating button (FAB) di mobile, sticky sidebar di desktop, balasan bertingkat (threaded), popup emoji picker, dan animated SVG logo loader.

---

## 🛡️ Lisensi & Hak Cipta
Crafted with 💚 by **Justdhif** &copy; 2026.
