# 🎬 Alight Motion Pro VIP Generator & API by Justdhif

Web Application & REST API modern berbasis **TypeScript** yang dibangun dengan arsitektur **Clean Architecture (Ports & Adapters)** oleh **[Justdhif](https://github.com/Justdhif)** untuk mengotomatisasi aktivasi lisensi **Alight Motion Pro VIP 1 Tahun**. 

Project ini menyediakan **Web Generator Interaktif** yang siap pakai langsung melalui browser serta **REST API** berkecepatan tinggi tanpa login atau sistem billing yang rumit.

---

## 📌 Kondisi & Status Project Saat Ini

- **Developer / Author:** [Justdhif](https://github.com/Justdhif)
- **Arsitektur:** Clean Architecture 4 Lapis (*Domain, Application, Infrastructure, Presentation*).
- **Runtime:** Node.js (ESM / NodeNext) dengan TypeScript 5.
- **Framework Web:** Express.js 4 dengan validasi skema berbasis Zod.
- **Web Generator Interaktif:** Dashboard modern (`/` atau `/dashboard`) dengan skema warna resmi Alight Motion (Neon Mint `#00e599` & Midnight Navy) di mana pengguna dapat langsung melakukan aktivasi lisensi VIP secara mandiri (Langkah 1: Kirim Magic Link, Langkah 2: Verifikasi & Aktivasi VIP, WhatsApp Bot Runner, Live Counter Stats).
- **Branding:** Dilengkapi logo resmi Alight Motion dan watermark branding Justdhif.
- **Deployability:** Siap dideploy ke **Vercel** (Serverless) maupun server VPS/Docker/PaaS konvensional.
- **Testing:** Pengujian otomatis (`npm test`) lulus 100% untuk gateway logic, session repository, stats repository, dan Express endpoints.

---

## 🏗️ Struktur Clean Architecture

```text
src/
├── domain/                                  # Lapisan 1: Domain Entities & Kontrak Interfaces (Murni TypeScript)
│   ├── entities/
│   │   ├── User.ts                          # Model AlightMotionUser (status akun, lisensi, masa aktif)
│   │   ├── Stats.ts                         # Model StatsData & StoredStats
│   │   └── Session.ts                       # Model PendingSession (TTL & metadata)
│   ├── repositories/
│   │   ├── IStatsRepository.ts              # Kontrak repository statistik
│   │   └── ISessionRepository.ts            # Kontrak repository sesi verifikasi
│   └── gateways/
│       ├── IFirebaseAuthGateway.ts          # Kontrak integrasi Firebase Identity Toolkit
│       └── IAlightGateway.ts                # Kontrak aktivasi lisensi Alight Creative
│
├── application/                             # Lapisan 2: Use Cases & DTO (Business Logic Aplikasi)
│   ├── dto/
│   │   └── alightMotion.dto.ts              # DTO Input & Output operasi Alight Motion
│   └── usecases/
│       ├── SendVerificationLinkUseCase.ts   # Logika pengiriman link verifikasi & pencatatan sesi
│       ├── VerifyMagicLinkUseCase.ts        # Logika verifikasi token & aktivasi Pro VIP
│       ├── GetStatsUseCase.ts               # Logika pengambilan data statistik lisensi
│       └── HandleBotCommandUseCase.ts       # Adapter pemroses perintah bot teks mentah
│
├── infrastructure/                          # Lapisan 3: Driver & Implementasi Nyata (External Adapters)
│   ├── config/
│   │   └── index.ts                         # Konfigurasi environment variables & path
│   ├── external/
│   │   ├── firebaseAuthGateway.ts           # Implementasi HTTP Firebase Auth API
│   │   ├── alightGateway.ts                 # Implementasi HTTP Alight verifyPurchase Cloud Function
│   │   └── ipSpoofer.ts                     # Injeksi header spoofing IP acak (bypass rate-limit)
│   ├── repositories/
│   │   ├── FileStatsRepository.ts           # Penyimpanan statistik file lokal dengan in-memory fallback
│   │   └── InMemorySessionRepository.ts     # Penyimpanan sesi sementara dengan auto-cleanup TTL
│   └── container.ts                         # Composition Root (Dependency Injection / Wiring)
│
├── presentation/                            # Lapisan 4: Interface Adapters (HTTP & Web Layer)
│   ├── controllers/
│   │   └── alightMotion.controller.ts       # Controller operasi Alight Motion
│   ├── views/
│   │   ├── dashboardHtml.ts                 # Web Generator HTML UI (Tailwind CSS Neon Mint)
│   │   └── logoAsset.ts                     # Embedded Data URI Logo resmi Alight Motion
│   ├── presenters/
│   │   └── messagePresenter.ts              # Pemformat teks respon siap kirim (format WhatsApp Justdhif)
│   ├── schemas/
│   │   └── alightMotion.schema.ts           # Validasi data request dengan Zod
│   ├── middlewares/
│   │   ├── apiKeyAuth.ts                    # Proteksi API Key opsional (jika disetel di .env)
│   │   ├── rateLimiter.ts                   # Multi-tier rate limiting
│   │   └── errorHandler.ts                  # Global error handling & credential masking
│   └── routes/
│       ├── alightMotion.routes.ts           # Router /api/am/...
│       └── index.ts                         # Master router
│
├── app.ts                                   # Konfigurasi Express, middleware, CORS, & view routes
└── index.ts                                 # Server entry point (Lokal + Serverless Vercel ready)
```

---

## 💻 Web Generator Interaktif

Akses langsung melalui browser di:
👉 **`http://localhost:3000/`** atau **`http://localhost:3000/dashboard`**

Fitur yang tersedia langsung di Web Generator:
1. **Langkah 1: Generate & Kirim Magic Link:** Masukkan alamat email akun Alight Motion, sistem langsung mengirimkan email verifikasi resmi.
2. **Langkah 2: Verifikasi & Aktivasi VIP 1 Tahun:** Tempelkan link verifikasi yang diterima di email, sistem langsung mengaktifkan lisensi Alight Motion Pro VIP 1 Tahun dan menampilkan kartu status sukses.
3. **WhatsApp Bot Command Runner:** Menjalankan perintah bot WhatsApp seperti `!amprem <email>`, `!amstats`, dan `!amhelp`.
4. **Live Counter Stats:** Menampilkan statistik jumlah akun VIP aktif secara global dan aktivasi hari ini.

---

## 📡 Daftar Endpoint API

### 1. Kirim Magic Link
- **Method / Path:** `POST /api/am/send-link` (alias: `POST /api/am/request-link`)
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
    "message": "Link verifikasi Alight Motion berhasil dikirim ke user@gmail.com...",
    "sessionId": "am_sess_xxxxxx",
    "formattedText": "*乂 ALIGHT MOTION PRO 乂*\n\n• *Status:* Link Terkirim ✉️...",
    "data": {
      "email": "user@gmail.com",
      "sessionId": "am_sess_xxxxxx"
    }
  }
  ```

---

### 2. Verifikasi & Aktivasi Lisensi Pro VIP
- **Method / Path:** `POST /api/am/verify` (alias: `POST /api/am/verify-link`)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "link": "https://alightcreative.com/?link=...&oobCode=xxxxxx",
    "email": "user@gmail.com"
  }
  ```
  *(Catatan: `email` bersifat opsional jika sebelumnya sudah memanggil `/send-link` dari sesi/klien yang sama).*
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "isPremium": true,
    "message": "Alight Motion Pro VIP berhasil diaktifkan!",
    "formattedText": "*🎉 ALIGHT MOTION PRO VIP AKTIF 🎉*\n\n• *Email:* user@gmail.com...",
    "data": {
      "uid": "firebase_uid",
      "email": "user@gmail.com",
      "status": "ACTIVE",
      "membershipStatus": "PREMIUM_ACTIVE",
      "tier": "Alight Motion Pro VIP",
      "subscription": "Yearly VIP License"
    }
  }
  ```

---

### 3. Cari Preset Alight Motion dari TikTok (Caption & Komentar)
Memindai tautan preset Alight Motion (`alight.link`, Google Drive XML, MediaFire) dari caption dan komentar video TikTok secara otomatis.
- **Method / Path:** `POST /api/am/preset/find` (alias: `POST /api/am/find-preset`)
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

### 4. Bot Command Adapter
- **Method / Path:** `POST /api/am/command`
- **Request Body:**
  ```json
  {
    "text": "!ampreset https://vt.tiktok.com/ZSxxxxxxx/",
    "senderId": "628123456789@s.whatsapp.net"
  }
  ```
- **Response:** Mengembalikan respon pesan chat WhatsApp dengan daftar preset yang ditemukan.

---

### 5. Statistik Aktivasi
- **Method / Path:** `GET /api/am/stats`
- **Response (200 OK):** Menampilkan total aktivasi keseluruhan dan aktivasi hari ini.

---

### 5. Panduan Bantuan
- **Method / Path:** `GET /api/am/help`
- **Response (200 OK):** Menampilkan dokumentasi alur kerja dalam format teks dan DTO.

---

## 🛠️ Menjalankan Project

```bash
# 1. Install dependencies
npm install

# 2. Jalankan mode development
npm run dev

# 3. Jalankan pengujian menyeluruh
npm test

# 4. Build TypeScript untuk production
npm run build

# 5. Jalankan hasil build
npm start
```

---

## 🚀 Panduan Deployment ke Vercel

1. Push commit ke repository GitHub Anda:
   ```bash
   git add .
   git commit -m "feat: alight motion pro vip web generator & api"
   git push origin main
   ```
2. Import repository di **Vercel Dashboard**.
3. Di environment variables Vercel, atur variabel dari file `.env`:
   - `FIREBASE_API_KEY`
   - `FIREBASE_IDT_URL`
   - `ALIGHT_VERIFY_URL`
   - `FIREBASE_INSTANCE_ID_TOKEN`
4. Deploy! Web generator dan API otomatis aktif 100% online.

---

## 📄 Lisensi
ISC License &copy; 2026 **Justdhif**.
