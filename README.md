<div align="center">

  <img src="public/logo.jpg" alt="Alight Motion Logo" width="100" style="border-radius: 20%; box-shadow: 0 4px 20px rgba(0, 229, 153, 0.3);" />

  # Alight Motion Pro Engine & REST API
  
  **Enterprise-grade REST API Service, Interactive Playground & Documentation built with Clean Architecture, TypeScript, Drizzle ORM, Neon PostgreSQL, and Express.**

  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-v20+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
  [![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-0.38+-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
  [![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Serverless-00E599?style=for-the-badge&logo=postgresql&logoColor=0d121f)](https://neon.tech/)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)
  [![Tests](https://img.shields.io/badge/Tests-100%25_Passing-00E599?style=for-the-badge&logo=jest&logoColor=black)](https://github.com/Justdhif/am_prem-api)
  [![License: ISC](https://img.shields.io/badge/License-ISC-informational?style=for-the-badge)](LICENSE)

  <br />

  [🌐 Live Web Dashboard](https://am-prem-api.vercel.app/) • [📖 Dokumentasi API](#-api-specification) • [💬 Kontak WhatsApp](https://wa.me/447762422507) • [🎵 TikTok Profil](https://www.tiktok.com/@justdhifbieber)

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Web Dashboard, Playground & Comments](#-web-dashboard-playground--comments)
- [API Specification](#-api-specification)
  - [1. Request Verification Link](#1-request-verification-link)
  - [2. Verify Link & Activate Pro](#2-verify-link--activate-pro)
  - [3. TikTok & YouTube Alight Preset Finder (2 Prioritas)](#3-tiktok--youtube-alight-preset-finder-2-prioritas)
  - [4. Multi-Command Bot Adapter](#4-multi-command-bot-adapter)
  - [5. Comment System Endpoints](#5-comment-system-endpoints)
- [Environment Configuration](#-environment-configuration)
- [Getting Started](#-getting-started)
- [Production Deployment](#-production-deployment)
- [Security & Rate Limiting](#-security--rate-limiting)
- [Author & Credits](#-author--credits)

---

## 💡 Overview

**Alight Motion Pro Engine & REST API** adalah backend microservice mandiri yang dirancang untuk mengotomatisasi siklus aktivasi lisensi **Alight Motion Pro 1 Tahun**, **ekstraksi tautan preset video TikTok**, serta penyediaan **interactive web playground & threaded community comments**. 

Dibangun dengan prinsip ketat **Clean Architecture (Uncle Bob)** dan **Domain-Driven Design (DDD)**, codebase ini memisahkan aturan bisnis inti dari framework dan driver database eksternal. Layanan ini terintegrasi langsung dengan cloud database **Neon Serverless PostgreSQL** menggunakan **Drizzle ORM** untuk pelacakan statistik aktivasi dan komentar secara persisten, realtime, serta type-safe.

---

## ✨ Key Features

| Fitur | Deskripsi | Status |
| :--- | :--- | :---: |
| ⚡ **Automated 2-Step Activation** | Pengiriman Firebase Magic Link & aktivasi lisensi tahunan Pro secara programmatic | `Active` |
| 🧪 **Interactive Web Playground** | Uji coba langsung endpoint `send-link`, `verify`, & `find preset` di browser dengan live latency (ms) | `Active` |
| 🔍 **Multi-Platform Preset Finder** | Ekstraksi tautan preset AM (`alight.link`, Drive, Mediafire) & ajakan Join Saluran dari TikTok & YouTube (caption, deskripsi, komentar) | `Active` |
| 💬 **TikTok-Style Comments** | Threaded replies (`> replyTo`), 9 kategori emoji keyboard lengkap, auto-expanding input, & toggle anonim | `Active` |
| 🥞 **Drizzle ORM & PostgreSQL** | Database pooling cloud dengan Drizzle ORM type-safe queries, auto-migration, dan local fallback | `Active` |
| 📱 **Dual-Tab Web Dashboard** | Tab navigasi **Docs** & **Playground** dengan Server-Side Rendered (SSR) stats dan kartu panduan persisten | `Active` |
| 🤖 **Bot-Ready Interface** | Adapter serbaguna untuk bot WhatsApp (`!amprem`, `!am`, `!ampreset`, `!amstats`, `!amhelp`) | `Active` |
| 🛡️ **Zero-Trust Security** | Sanitasi kredensial, IP spoofing rotatif, rate-limiting bertingkat, dan input validation via Zod | `Active` |

---

## 🏛️ System Architecture

Proyek ini menerapkan arsitektur **Hexagonal / Ports and Adapters (Clean Architecture)**:

```mermaid
graph TD
  subgraph Presentation ["Lapisan 4: Presentation Layer"]
    C[Express Controllers]
    R[Express Routers]
    V[Dashboard SSR View]
    M[Rate Limiter & Auth Middlewares]
  end

  subgraph Application ["Lapisan 2: Application Layer (Use Cases)"]
    UC1[SendVerificationLinkUseCase]
    UC2[VerifyMagicLinkUseCase]
    UC3[FindAlightPresetUseCase]
    UC4[GetStatsUseCase]
    UC5[HandleBotCommandUseCase]
    UC6[CommentUseCases]
  end

  subgraph Domain ["Lapisan 1: Domain Core (Enterprise Rules)"]
    E1[User Entity]
    E2[Stats Entity]
    E3[Preset Entity]
    E4[Comment Entity]
    IR1[IStatsRepository]
    IR2[ISessionRepository]
    IR3[ICommentRepository]
    IG1[IFirebaseAuthGateway]
    IG2[IAlightGateway]
    IG3[ITikTokGateway]
  end

  subgraph Infrastructure ["Lapisan 3: Infrastructure Layer (External Adapters)"]
    DB[(Drizzle ORM + Neon PostgreSQL)]
    FS[(Local JSON Fallback)]
    EXT1[Firebase Identity Toolkit]
    EXT2[Alight Creative CloudFunctions]
    EXT3[TikTok Scraper API]
    CFG[Config Manager]
  end

  Presentation --> Application
  Application --> Domain
  Infrastructure --> Domain
  Infrastructure -.-> Application
```

### File Hierarchy
```text
src/
├── domain/                                  # Pure Domain Entities & Contracts
│   ├── entities/ (User, Stats, Preset, Session, Comment)
│   ├── repositories/ (IStatsRepository, ISessionRepository, ICommentRepository)
│   └── gateways/ (IFirebaseAuthGateway, IAlightGateway, ITikTokGateway)
├── application/                             # Application Business Logic
│   ├── dto/ (Input / Output Data Transfer Objects)
│   └── usecases/ (SendLink, Verify, FindPreset, GetStats, BotCommands, Comments)
├── infrastructure/                          # Concrete Drivers & External APIs
│   ├── database/ (Drizzle Schema, Pg Connection Pool)
│   ├── external/ (Firebase, Alight Creative, TikTok Scrapers, IPSpoofer)
│   ├── repositories/ (PostgresStatsRepository, PostgresCommentRepository, InMemorySession)
│   └── container.ts (Dependency Injection Container)
├── presentation/                            # HTTP Transport Layer
│   ├── controllers/ (AlightMotionController, CommentController)
│   ├── middlewares/ (RateLimiter, ErrorHandler, ApiKeyAuth)
│   ├── schemas/ (Zod Validation Schemas)
│   ├── views/ (Minimalist SSR Dashboard, Logo Assets)
│   └── routes/ (REST Endpoints)
├── app.ts                                   # Express App Configuration
└── index.ts                                 # Server & Serverless Entrypoint
```

---

## 🛠️ Tech Stack

- **Core Engine:** TypeScript 5.8, Node.js v20+ (ES Modules)
- **HTTP Server:** Express.js 4 with Helmet & CORS
- **Database & ORM:** Drizzle ORM (`drizzle-orm`) + Neon Serverless PostgreSQL (`pg` pool with SSL)
- **Validation:** Zod Schema Validation
- **Styling:** Tailwind CSS CDN (Custom Alight Mint `#00e599` theme)
- **Testing:** Node.js native test runner & Axios integration suite (`npm test`)

---

## 🖥️ Web Dashboard, Playground & Comments

Dashboard dapat diakses langsung tanpa autentikasi di:
`http://localhost:3000/` atau `http://localhost:3000/dashboard`

### 1. Dua Tab Utama (Docs vs Playground)
- **Tab Docs:**
  - Penjelasan lengkap alur aktivasi 2 langkah.
  - Dokumentasi seluruh endpoint REST API (`POST /api/am/send-link`, `POST /api/am/verify`, `POST /api/am/preset/find`, `POST /api/am/command`).
  - Contoh payload JSON dan tombol **Salin cURL** sekali klik.
- **Tab Playground:**
  - **Card 1: Kirim Magic Link:** Form input email, live request button, tombol contoh data, reset, dan response viewer dengan badge HTTP status & latency (ms).
  - **Card 2: Verifikasi & Aktivasi Pro:** Form email dan magic link/oobCode dengan textarea **auto break-line & auto-expand** untuk menangani tautan panjang tanpa terpotong.
  - **Card 3: Cari Preset TikTok & YouTube:** Form URL TikTok & YouTube dengan auto break-line input, pemindaian caption, deskripsi, komentar, dan 2 prioritas (Link Langsung & Join Saluran).
- **Card Panduan Bantuan & FAQ:** Selalu tampil di bawah kontainer tab sehingga dapat diakses kapan saja dari kedua tab.

### 2. TikTok-Style Comment System
- **Desktop:** Tampil sebagai sidebar container di sebelah kanan konten utama.
- **Mobile:** Tampil sebagai bottom sheet interaktif ala aplikasi TikTok yang dapat dibuka dari floating action button (FAB).
- **Threaded Replies:** Balasan komentar disejajarkan secara rapi dengan badge target `> nama_komentar`.
- **Keyboard Emoji Lengkap:** 9 kategori standar Unicode (Wajah & Emosi, Orang & Tubuh, Hewan & Alam, Makanan & Minuman, Aktivitas & Olahraga, Kendaraan & Tempat, Benda & Objek, Simbol & Hati, Bendera), lengkap dengan fitur pencarian dan tombol backspace.
- **Fitur Anonim & Avatar:** Toggle opsi anonim dan avatar yang ter-generate dinamis sesuai nama pengguna.

---

## 📡 API Specification

Base URL: `http://localhost:3000/api/am` atau `https://your-domain.vercel.app/api/am`

### 1. Request Verification Link
Mengirimkan tautan resmi verifikasi akun Firebase Alight Motion ke email target.

- **Endpoint:** `POST /api/am/send-link`
- **Headers:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "email": "creator@gmail.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Link verifikasi Alight Motion berhasil dikirim ke creator@gmail.com. Silakan periksa inbox atau spam.",
    "sessionId": "am_sess_1729580000000",
    "formattedText": "*乂 ALIGHT MOTION PRO 乂*\n\n• *Status:* Link Terkirim ✉️...",
    "data": {
      "email": "creator@gmail.com",
      "sessionId": "am_sess_1729580000000"
    }
  }
  ```

---

### 2. Verify Link & Activate Pro
Memvalidasi parameter `oobCode` dari tautan email dan mengaktifkan lisensi tahunan Pro Alight Motion.

- **Endpoint:** `POST /api/am/verify`
- **Headers:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "link": "https://alightcreative.com/?link=https://alightcreative.com/login?mode%3DsignIn%26oobCode%3Dabcdef123456",
    "email": "creator@gmail.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "isPremium": true,
    "message": "Alight Motion Pro berhasil diaktifkan!",
    "formattedText": "*🎉 ALIGHT MOTION PRO AKTIF 🎉*\n\n• *Email:* creator@gmail.com...",
    "data": {
      "uid": "wXYZ12345FirebaseUID",
      "email": "creator@gmail.com",
      "status": "ACTIVE",
      "membershipStatus": "PREMIUM_ACTIVE",
      "tier": "Alight Motion Pro",
      "subscription": "Yearly License"
    }
  }
  ```

---

### 3. TikTok & YouTube Alight Preset Finder (2 Prioritas)
Memindai tautan preset Alight Motion dari caption, **deskripsi video** (YouTube), serta kolom komentar & balasan (TikTok & YouTube).

Fitur ini menerapkan **2 Tingkat Prioritas**:
1. **Prioritas 1 (Link Preset Langsung):** Mendeteksi `alight.link`, `alightcreative.com`, Google Drive (`drive.google.com`), Mediafire, Sfile, dan shortlink.
2. **Prioritas 2 (Ajakan Join Saluran / Join SL):** Mendeteksi saluran WhatsApp (`whatsapp.com/channel/...`), Telegram, link bio, serta teks *"join saluran"* / *"join sl"* ketika kreator mempromosikan preset lewat saluran.

- **Endpoint:** `POST /api/am/preset/find`
- **Headers:** `Content-Type: application/json`
- **Payload (TikTok atau YouTube):**
  ```json
  {
    "url": "https://youtu.be/xxxxxx atau https://vt.tiktok.com/xxxx/"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Berhasil menemukan 1 link preset Alight Motion dan 1 saluran kreator!",
    "data": {
      "platform": "youtube",
      "totalPresetsFound": 2,
      "totalCommentsScanned": 35,
      "directPresets": [
        {
          "url": "https://alightcreative.com/am/share/u/xxxx/p/yyyy",
          "type": "alight_creative",
          "priority": "preset_link",
          "source": "description",
          "label": "Alight Creative",
          "isCreator": true
        }
      ],
      "channelInvites": [
        {
          "url": "https://whatsapp.com/channel/0029Vb9Bq88KGGGFFoqPEX3Y/112",
          "type": "whatsapp_channel",
          "priority": "join_saluran",
          "source": "comment",
          "label": "Saluran WhatsApp (Join Saluran)",
          "isCreator": true
        }
      ],
      "presets": [ ... ],
      "formattedText": "*乂 YOUTUBE ALIGHT MOTION PRESET FINDER 乂*\n..."
    }
  }
  ```

---

### 4. Multi-Command Bot Adapter
Adapter khusus untuk bot chat (WhatsApp / Telegram / Discord) yang menerima input teks perintah.

- **Endpoint:** `POST /api/am/command`
- **Headers:** `Content-Type: application/json`
- **Payload:**
  ```json
  {
    "text": "!amprem user@gmail.com",
    "senderId": "628123456789@s.whatsapp.net"
  }
  ```
- **Supported Bot Commands:**
  - `!amprem <email>` : Mengirim link aktivasi
  - `!am <link>` : Memverifikasi dan mengaktifkan Pro
  - `!ampreset <url>` : Mencari preset dari video TikTok
  - `!amstats` : Memeriksa statistik server
  - `!amhelp` : Menampilkan petunjuk penggunaan

---

### 5. Comment System Endpoints
Endpoint pengelola komentar interaktif berbasis Drizzle ORM:

- **Ambil Tree Komentar:** `GET /api/comments`
- **Kirim Komentar / Balasan:** `POST /api/comments`
  ```json
  {
    "parentId": "optional_parent_comment_uuid",
    "name": "User Name",
    "content": "Komentar teks",
    "isAnonymous": false
  }
  ```

> [!NOTE]
> Statistik aktivasi (total & hari ini) serta pusat bantuan dan FAQ kini ter-render secara langsung melalui Server-Side Rendering (SSR) pada web UI tanpa perlu melakukan request endpoint polling terpisah.

---

## ⚙️ Environment Configuration

Buat file `.env` di root project berdasarkan [`.env.example`](.env.example):

```env
# Server
PORT=3000
NODE_ENV=development

# Database (Neon Serverless PostgreSQL via Drizzle ORM)
DATABASE_URL=postgresql://neondb_owner:password@ep-sample-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require

# Firebase Identity Toolkit
FIREBASE_API_KEY=your_firebase_api_key_here
FIREBASE_IDT_URL=https://www.googleapis.com/identitytoolkit/v3/relyingparty
FIREBASE_INSTANCE_ID_TOKEN=your_firebase_instance_id_token_here

# Alight Motion Gateway
ALIGHT_VERIFY_URL=https://us-central1-alight-creative.cloudfunctions.net/verifyPurchase
ALIGHT_PURCHASE_TOKEN=your_purchase_token_here
ALIGHT_CONTINUE_URL=https://alightcreative.com?ui_sid=your_sid&ui_sd=0
ALIGHT_ANDROID_CERT=your_android_cert_sha256_here

# Rate Limiting & Security
CORS_ORIGIN=*
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
SEND_LINK_LIMIT_MAX=5
VERIFY_LIMIT_MAX=10
```

> [!NOTE]
> Semua kredensial rahasia tidak pernah di-hardcode ke dalam kode sumber repository dan wajib dikonfigurasi melalui Environment Variables.

---

## 🚀 Getting Started

### Prerequisites
- Node.js version 20.x or higher
- npm or pnpm package manager

### Local Installation

```bash
# 1. Clone repository
git clone https://github.com/Justdhif/am_prem-api.git
cd am_prem-api

# 2. Install dependencies
npm install

# 3. Setup Environment Variables
cp .env.example .env
# Edit .env dan sesuaikan nilai kredensial Anda

# 4. Jalankan Unit & Integration Tests
npm test

# 5. Jalankan Development Server (Hot-Reload)
npm run dev

# 6. Build & Start Production Server
npm run build
npm start
```

---

## ☁️ Production Deployment

### Vercel Serverless (Recommended)

1. **Push ke GitHub:**
   ```bash
   git push origin main
   ```
2. **Impor ke Vercel:**
   - Sambungkan repository `Justdhif/am_prem-api` di [Vercel Dashboard](https://vercel.com).
   - Vercel akan secara otomatis mendeteksi konfigurasi [`vercel.json`](vercel.json).
3. **Konfigurasi Environment Variables di Vercel Settings:**
   - Tambahkan `DATABASE_URL` (dari Neon PostgreSQL connection string).
   - Tambahkan `FIREBASE_API_KEY`, `FIREBASE_IDT_URL`, `FIREBASE_INSTANCE_ID_TOKEN`.
   - Tambahkan `ALIGHT_VERIFY_URL`, `ALIGHT_PURCHASE_TOKEN`, `ALIGHT_CONTINUE_URL`, `ALIGHT_ANDROID_CERT`.
   - Tambahkan `CORS_ORIGIN=*`.
4. **Deploy & Selesai:** Web UI dan API langsung aktif di domain Vercel Anda secara otomatis.

---

## 🛡️ Security & Rate Limiting

- **HTTP Security Headers:** Menggunakan [Helmet](https://helmetjs.github.io/) dengan mitigasi XSS, clickjacking, dan MIME sniff.
- **Strict Rate Limiting:**
  - Global API: 100 requests / 15 menit per IP.
  - Send Link Endpoint: 5 requests / 15 menit per IP.
  - Verify Endpoint: 10 requests / 15 menit per IP.
- **Credential Masking:** Handler error global secara otomatis menghapus token sensitif dan query connection string sebelum dikirim ke respon klien.
- **IP Rotation Spoofing:** Otomatis menghasilkan header `X-Forwarded-For` acak saat menghubungi Google Cloud Function untuk mencegah throttling upstream.

---

## 👤 Author & Credits

Dibuat dengan sepenuh hati oleh **[Justdhif](https://github.com/Justdhif)**.

- 🎵 **TikTok:** [@justdhifbieber](https://www.tiktok.com/@justdhifbieber)
- 💬 **WhatsApp:** [+44 7762 422507](https://wa.me/447762422507)
- 🌐 **GitHub:** [@Justdhif](https://github.com/Justdhif)

---

<div align="center">
  <small>Released under the <a href="LICENSE">ISC License</a>. Copyright &copy; 2026 <strong>Justdhif</strong>. All rights reserved.</small>
</div>
