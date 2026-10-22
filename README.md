# 🎬 Alight Motion Pro Generator & API by Justdhif

Layanan Web Application & REST API modern berbasis **TypeScript** yang dibangun dengan arsitektur **Clean Architecture (Ports & Adapters)** oleh **[Justdhif](https://github.com/Justdhif)** untuk mengotomatisasi aktivasi lisensi **Alight Motion Pro 1 Tahun** dan **Pencarian Preset Alight Motion dari TikTok**.

Project ini dilengkapi **Dokumentasi Web Interaktif Minimalis** yang responsif di smartphone maupun desktop, terintegrasi langsung dengan database cloud **Neon PostgreSQL** untuk penyimpanan statistik aktivasi secara real-time.

---

## 📌 Status & Kondisi Project Terkini

- **Developer / Author:** [Justdhif](https://github.com/Justdhif)
- **TikTok:** [@justdhifbieber](https://www.tiktok.com/@justdhifbieber)
- **WhatsApp:** [+44 7762 422507](https://wa.me/447762422507)
- **Runtime:** Node.js 20+ (ESM / NodeNext) dengan TypeScript 5.
- **Framework Web:** Express.js 4 dengan validasi skema berbasis Zod.
- **Database:** **Neon Serverless PostgreSQL** dengan pool connection & fallback otomatis ke local file storage.
- **Frontend / Web UI:** Dokumentasi API minimalis (`/` atau `/dashboard`) dengan skema warna resmi Alight Motion (Neon Mint `#00e599` & Midnight Navy), copy cURL instan, SSR data statistik awal, dan auto-polling background 10 detik.
- **Deployability:** Siap dideploy ke **Vercel** (Serverless) maupun server VPS/Docker/PaaS konvensional.
- **Testing:** Pengujian otomatis (`npm test`) lulus 100% untuk seluruh use case, gateway, database repository, dan endpoint Express.

---

## 🚀 Fitur Utama

1. **Aktivasi Lisensi Alight Motion Pro 1 Tahun (2 Langkah):**
   - **Langkah 1:** Kirim magic link verifikasi resmi Firebase ke email target.
   - **Langkah 2:** Verifikasi token dari tautan email dan aktifkan lisensi tahunan Alight Motion Pro.
2. **TikTok Preset Finder (Caption & Komentar):**
   - Mengambil link video TikTok (`vt.tiktok.com` atau link web penuh).
   - Memindai caption dan komentar video secara otomatis untuk mengekstrak tautan preset Alight Motion (`alight.link`, Google Drive XML, MediaFire).
3. **Statistik Real-Time Neon PostgreSQL:**
   - Menyimpan jumlah `total_premium` dan `today_premium` secara permanen di database cloud Neon.
   - Auto-reset hitungan harian saat berganti tanggal.
   - Ditampilkan langsung pada halaman web dokumentasi dengan SSR (Server-Side Rendering) dan auto-refresh setiap 10 detik.
4. **WhatsApp Bot Command Adapter:**
   - Mendukung parsing perintah bot teks langsung: `!amprem <email>`, `!am <link>`, `!ampreset <url>`, `!amstats`, dan `!amhelp`.

---

## 🏗️ Struktur Clean Architecture

```text
src/
├── domain/                                  # Lapisan 1: Domain Entities & Kontrak Interfaces (Murni TypeScript)
│   ├── entities/
│   │   ├── User.ts                          # Model AlightMotionUser (status akun, lisensi, masa aktif)
│   │   ├── Stats.ts                         # Model StatsData & StoredStats
│   │   ├── Preset.ts                        # Model TikTokPresetItem & PresetFindResult
│   │   └── Session.ts                       # Model PendingSession (TTL & metadata)
│   ├── repositories/
│   │   ├── IStatsRepository.ts              # Kontrak asynchronous repository statistik
│   │   └── ISessionRepository.ts            # Kontrak repository sesi verifikasi
│   └── gateways/
│       ├── IFirebaseAuthGateway.ts          # Kontrak integrasi Firebase Identity Toolkit
│       ├── IAlightGateway.ts                # Kontrak aktivasi lisensi Alight Creative
│       └── ITikTokGateway.ts                # Kontrak ekstraksi preset video TikTok
│
├── application/                             # Lapisan 2: Use Cases & DTO (Business Logic Aplikasi)
│   ├── dto/
│   │   └── alightMotion.dto.ts              # DTO Input & Output operasi Alight Motion
│   └── usecases/
│       ├── SendVerificationLinkUseCase.ts   # Logika pengiriman link verifikasi & pencatatan sesi
│       ├── VerifyMagicLinkUseCase.ts        # Logika verifikasi token & aktivasi Pro
│       ├── FindAlightPresetUseCase.ts       # Logika ekstraksi preset dari video TikTok
│       ├── GetStatsUseCase.ts               # Logika pengambilan data statistik lisensi
│       └── HandleBotCommandUseCase.ts       # Adapter pemroses perintah bot teks mentah
│
├── infrastructure/                          # Lapisan 3: Driver & Implementasi Nyata (External Adapters)
│   ├── config/
│   │   └── index.ts                         # Konfigurasi environment variables terpusat
│   ├── external/
│   │   ├── firebaseAuthGateway.ts           # Implementasi HTTP Firebase Auth API
│   │   ├── alightGateway.ts                 # Implementasi HTTP Alight verifyPurchase Cloud Function
│   │   ├── tikTokGateway.ts                 # Implementasi scraper API komentar & caption TikTok
│   │   └── ipSpoofer.ts                     # Injeksi header spoofing IP acak (bypass rate-limit)
│   ├── repositories/
│   │   ├── PostgresStatsRepository.ts       # Penyimpanan statistik Neon PostgreSQL (Cloud)
│   │   ├── FileStatsRepository.ts           # Fallback penyimpanan statistik file lokal / in-memory
│   │   └── InMemorySessionRepository.ts     # Penyimpanan sesi sementara dengan auto-cleanup TTL
│   └── container.ts                         # Composition Root (Dependency Injection / Wiring)
│
├── presentation/                            # Lapisan 4: Interface Adapters (HTTP & Web Layer)
│   ├── controllers/
│   │   └── alightMotion.controller.ts       # Controller operasi REST API Alight Motion
│   ├── views/
│   │   ├── dashboardHtml.ts                 # Dokumentasi Web UI (Tailwind CSS Neon Mint & SSR Stats)
│   │   └── logoAsset.ts                     # Embedded Data URI Logo resmi Alight Motion
│   ├── presenters/
│   │   └── messagePresenter.ts              # Pemformat teks respon siap kirim (format WhatsApp Justdhif)
│   ├── schemas/
│   │   ├── alightMotion.schema.ts           # Validasi data request aktivasi dengan Zod
│   │   └── preset.schema.ts                 # Validasi URL TikTok dengan Zod
│   ├── middlewares/
│   │   ├── apiKeyAuth.ts                    # Proteksi API Key opsional (jika disetel di .env)
│   │   ├── rateLimiter.ts                   # Multi-tier rate limiting
│   │   └── errorHandler.ts                  # Global error handling & sanitasi kredensial
│   └── routes/
│       ├── alightMotion.routes.ts           # Router /api/am/...
│       └── index.ts                         # Master router
│
├── app.ts                                   # Konfigurasi Express, middleware, CORS, & view routes
└── index.ts                                 # Server entry point (Lokal + Serverless Vercel ready)
```

---

## 💻 Web Dokumentasi API

Akses langsung melalui browser di:
👉 **`http://localhost:3000/`** atau **`http://localhost:3000/dashboard`**

Halaman dokumentasi dilengkapi dengan:
- **Header Navbar:** Logo Alight Motion, branding `AM Pro API by Justdhif`, tombol profil TikTok ([@justdhifbieber](https://www.tiktok.com/@justdhifbieber)), dan tombol WhatsApp ([+44 7762 422507](https://wa.me/447762422507)).
- **Counter Statistik:** Menampilkan total akun Pro yang aktif dan jumlah aktivasi hari ini secara realtime.
- **Copy cURL 1-Klik:** Contoh sintaks request lengkap untuk semua endpoint.

---

## 📡 Daftar Endpoint API

### 1. Kirim Magic Link
- **Method / Path:** `POST /api/am/send-link`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@gmail.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Link verifikasi Alight Motion berhasil dikirim ke user@gmail.com. Silakan periksa inbox atau folder spam email Anda.",
    "sessionId": "am_sess_xxxxxx",
    "formattedText": "*乂 ALIGHT MOTION PRO 乂*\n\n• *Status:* Link Terkirim ✉️...",
    "data": {
      "email": "user@gmail.com",
      "sessionId": "am_sess_xxxxxx"
    }
  }
  ```

---

### 2. Verifikasi & Aktivasi Lisensi Pro
- **Method / Path:** `POST /api/am/verify`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "link": "https://alightcreative.com/?link=...&oobCode=xxxxxx",
    "email": "user@gmail.com"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "isPremium": true,
    "message": "Alight Motion Pro berhasil diaktifkan!",
    "formattedText": "*🎉 ALIGHT MOTION PRO AKTIF 🎉*\n\n• *Email:* user@gmail.com...",
    "data": {
      "uid": "firebase_uid",
      "email": "user@gmail.com",
      "status": "ACTIVE",
      "membershipStatus": "PREMIUM_ACTIVE",
      "tier": "Alight Motion Pro",
      "subscription": "Yearly License"
    }
  }
  ```

---

### 3. Cari Preset Alight Motion dari TikTok
- **Method / Path:** `POST /api/am/preset/find`
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "url": "https://vt.tiktok.com/ZSxxxxxxx/"
  }
  ```
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Berhasil menemukan 2 link preset Alight Motion dari video TikTok!",
    "data": {
      "totalPresetsFound": 2,
      "totalCommentsScanned": 50,
      "presets": [
        {
          "url": "https://alight.link/xxxxxx",
          "type": "alight_link",
          "source": "comment",
          "label": "Alight Link (Official)",
          "author": "creator_name",
          "isCreator": true
        },
        {
          "url": "https://drive.google.com/file/d/xxxxxx/view",
          "type": "google_drive",
          "source": "caption",
          "label": "Google Drive (XML/Preset)",
          "author": "creator_name",
          "isCreator": true
        }
      ],
      "formattedText": "*乂 TIKTOK ALIGHT MOTION PRESET FINDER 乂*\n..."
    }
  }
  ```

---

### 4. Bot Command Adapter (Multi-Command)
Menerima string perintah bot WhatsApp langsung dan mengembalikan respon berformat teks rapi.
- **Method / Path:** `POST /api/am/command`
- **Request Body:**
  ```json
  {
    "text": "!ampreset https://vt.tiktok.com/ZSxxxxxxx/",
    "senderId": "628123456789@s.whatsapp.net"
  }
  ```
- **Daftar Perintah yang Didukung:**
  - `!amprem <email>` : Kirim link aktivasi
  - `!am <link>` : Verifikasi & aktifkan Pro
  - `!ampreset <url>` : Cari preset dari video TikTok
  - `!amstats` : Cek statistik server terkini
  - `!amhelp` : Tampilkan bantuan bot

---

### 5. Statistik Server & Aktivasi
- **Method / Path:** `GET /api/am/stats`
- **Response (200 OK):** Mengambil data realtime dari Neon PostgreSQL (`totalPremium`, `todayPremium`, `status`).

---

### 6. Panduan & Dokumentasi Ringkas
- **Method / Path:** `GET /api/am/help`
- **Response (200 OK):** Panduan penggunaan API dalam format JSON dan teks WhatsApp.

---

## 🛠️ Menjalankan Project Secara Lokal

```bash
# 1. Clone repository
git clone https://github.com/Justdhif/am_prem-api.git
cd am_prem-api

# 2. Install dependencies
npm install

# 3. Salin file contoh konfigurasi environment
cp .env.example .env
# (Lalu lengkapi nilai kredensial di file .env)

# 4. Jalankan pengujian menyeluruh
npm test

# 5. Jalankan server dalam mode development
npm run dev

# 6. Build untuk production
npm run build
npm start
```

---

## 🚀 Panduan Deployment ke Vercel

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "feat: ready for vercel"
   git push origin main
   ```
2. **Import ke Vercel Dashboard:**
   - Hubungkan project dengan repository GitHub `Justdhif/am_prem-api`.
3. **Atur Environment Variables di Vercel Settings:**
   - `DATABASE_URL` : Connection string Neon PostgreSQL (contoh: `postgresql://neondb_owner:password@ep-xxx-pooler.c-4.ap-southeast-1.aws.neon.tech/neondb?sslmode=require`)
   - `FIREBASE_API_KEY` : Kunci Firebase API
   - `FIREBASE_IDT_URL` : Identity Toolkit URL
   - `FIREBASE_INSTANCE_ID_TOKEN` : Token instance Alight Motion
   - `ALIGHT_VERIFY_URL` : Endpoint verifikasi Alight Creative
   - `ALIGHT_PURCHASE_TOKEN` : Token pembelian Google Play/App Store
   - `ALIGHT_CONTINUE_URL` : Return continue URL Alight Motion
   - `ALIGHT_ANDROID_CERT` : Fingerprint sertifikat SHA-256 APK
   - `CORS_ORIGIN` : `*`
4. **Deploy:** Vercel akan otomatis melakukan build TypeScript dan API siap digunakan secara global!

---

## 📄 Lisensi & Kredit

ISC License &copy; 2026 **[Justdhif](https://github.com/Justdhif)**.  
- TikTok: [@justdhifbieber](https://www.tiktok.com/@justdhifbieber)  
- WhatsApp: [+44 7762 422507](https://wa.me/447762422507)
