# 🎬 Alight Motion Pro VIP API (TypeScript)

REST API modern berbasis **TypeScript** yang dibangun dengan arsitektur **Clean Architecture (Ports & Adapters)** untuk mengotomatisasi aktivasi lisensi **Alight Motion Pro VIP 1 Tahun**. 

Project ini mengadopsi dan menyempurnakan seluruh alur logika dari modul Alight Motion pada project bot WhatsApp sebelumnya (`justbot_v2`), kemudian ditransformasikan menjadi layanan API mandiri yang siap digunakan untuk aplikasi web, mobile app, maupun bot chat.

---

## 📌 Kondisi & Status Project Saat Ini

- **Arsitektur:** Clean Architecture 4 Lapis (*Domain, Application, Infrastructure, Presentation*).
- **Runtime:** Node.js (ESM / NodeNext) dengan TypeScript 5.
- **Framework Web:** Express.js 4 dengan validasi skema berbasis Zod.
- **Deployability:** Siap dideploy ke **Vercel** (Serverless) maupun server VPS/Docker/PaaS konvensional.
- **Testing:** Dilengkapi suite pengujian otomatis (`test/api.test.ts`) yang mencakup unit logic, repositories, dan endpoint HTTP Express.
- **Keamanan Data:** File konfigurasi sensitif (`.env`) dan penyimpanan data lokal (`data/stats.json`) telah diatur pada `.gitignore` agar aman saat di-push ke GitHub.

---

## 🏗️ Struktur Clean Architecture

Project ini memisahkan setiap tanggung jawab (*Single Responsibility Principle*) ke dalam lapisan-lapisan independen:

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
│   │   └── alightMotion.dto.ts              # DTO Input & Output untuk setiap operasi
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
│   │   └── alightMotion.controller.ts       # HTTP Controller Express (menerima req & memanggil use case)
│   ├── presenters/
│   │   └── messagePresenter.ts              # Pemformat teks respon siap kirim (format WhatsApp & Markdown)
│   ├── schemas/
│   │   └── alightMotion.schema.ts           # Validasi data request dengan Zod
│   ├── middlewares/
│   │   ├── errorHandler.ts                  # Global error handling
│   │   └── validateRequest.ts               # Middleware validator skema Zod
│   └── routes/
│       ├── alightMotion.routes.ts           # Router endpoint Alight Motion (/api/am/...)
│       └── index.ts                         # Root router
│
├── app.ts                                   # Konfigurasi & middleware Express
└── index.ts                                 # Server entry point (Lokal + Serverless Vercel ready)
```

---

## 💡 Konsep Penting dalam Project

### 1. Fungsi `Session` (Mengapa Diperlukan?)
Aktivasi lisensi Alight Motion merupakan proses asinkron 2 langkah:
- **Langkah 1 (`/send-link`):** Mengirim magic link ke email pengguna.
- **Langkah 2 (`/verify`):** Pengguna membuka inbox, menyalin link, lalu mengirimkannya untuk diverifikasi.

Di balik layar, Firebase API **mewajibkan** alamat email dan kode verifikasi (*oobCode*) saat proses login. Tanpa adanya `Session`, client harus repot menyimpan dan mengirim ulang email di Langkah 2.

**Dengan adanya `sessionRepository`:**
- Email dicatat sementara saat Langkah 1.
- Pada Langkah 2, pengguna/client **cukup mengirimkan tautan link saja** (`{ "link": "https://..." }`).
- Sistem otomatis mencocokkan email berdasarkan `sessionId`, `senderId` (ID bot/pengguna), atau IP client.
- Setelah berhasil, sesi langsung dihapus secara otomatis. Jika tidak diverifikasi, sesi otomatis kadaluarsa (TTL 30 menit).

### 2. Keamanan & Ketahanan File `stats.json`
- File `data/stats.json` (atau `am-stats.json`) hanya berfungsi sebagai catatan lokal jumlah aktivasi total dan harian.
- File ini **aman dihapus kapan saja**. Jika file tidak ada atau isinya kosong, sistem secara otomatis menggunakan nilai fallback *in-memory* dan membuat ulang file tanpa error/crash.
- Di lingkungan serverless seperti Vercel (di mana filesystem bersifat *read-only*), sistem secara otomatis mengarahkan penyimpanan ke direktori `/tmp/stats.json`.

### 3. IP Spoofing Otomatis
Setiap request ke Google Identity Toolkit dan Cloud Function Alight Creative menyuntikkan header IP acak (`x-forwarded-for`, `x-real-ip`, `client-ip`, dll.) serta Android Dalvik/OkHttp User-Agent agar tidak terkena limitasi IP.

---

## 🛡️ Fitur Keamanan (Security Hardening)

API ini telah diperkuat dengan berbagai lapisan pengamanan berstandar industri:

1. **Multi-tier Rate Limiting (`express-rate-limit`):**
   - **General Limiter:** Maksimal 100 request / 15 menit per IP untuk melindungi seluruh API dari flooding.
   - **Send-Link Limiter:** Maksimal 5 request / 5 menit per IP untuk mencegah spam pengiriman email dan kehabisan kuota Firebase.
   - **Verify Limiter:** Maksimal 10 request / 5 menit per IP untuk mencegah serangan brute-force terhadap token *oobCode*.
   - **Bot Command Limiter:** Maksimal 15 request / 1 menit per IP.
2. **Proteksi API Key (Opsional):**
   - Mendukung autentikasi via `x-api-key` atau `Authorization: Bearer <key>`.
   - Cukup set `API_SECRET_KEY=kunci_rahasia_anda` di `.env` jika ingin API hanya dapat diakses oleh aplikasi Anda.
   - Menggunakan perbandingan `crypto.timingSafeEqual` untuk mencegah *timing attacks*.
   - Jika `API_SECRET_KEY` dikosongkan, API beroperasi secara publik.
3. **Pembatasan Ukuran Request Body (Anti-DoS):**
   - Body parser dibatasi maksimum `10kb` (`express.json({ limit: '10kb' })`), mencegah serangan Denial of Service melalui payload JSON raksasa.
4. **Validasi & Sanitasi Input Ketat (Zod):**
   - Membatasi panjang string (email max 100 chars, link max 2048 chars, text max 500 chars).
   - Menolak null bytes (`\0`) dan karakter kontrol berbahaya.
5. **Penyembunyian Server Signature & Error Masking:**
   - Header `X-Powered-By: Express` dinonaktifkan.
   - Middleware `errorHandler` secara otomatis menyamarkan (*redact*) API key, token rahasia, maupun URL internal agar tidak bocor ke client saat terjadi error.
6. **Konfigurasi CORS Fleksibel:**
   - Whitelist domain dapat diatur via variabel `CORS_ORIGIN` di `.env`.

---

## 📡 Daftar Endpoint API

Semua endpoint utama berada di bawah prefix `/api/am`.

### 1. Kirim Magic Link
Meminta Firebase mengirimkan email verifikasi Alight Motion.
- **Method / Path:** `POST /api/am/send-link` (alias: `POST /api/am/request-link`)
- **Headers:** `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "email": "user@gmail.com",
    "sessionId": "opsional_id_sesi_klien",
    "senderId": "opsional_id_pengguna_bot"
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
      "sessionId": "am_sess_xxxxxx",
      "nextSteps": [ ... ]
    }
  }
  ```

---

### 2. Verifikasi & Aktivasi Lisensi Pro VIP
Memverifikasi tautan dari email dan mengaktifkan langganan VIP 1 tahun.
- **Method / Path:** `POST /api/am/verify` (alias: `POST /api/am/verify-link`)
- **Request Body:**
  ```json
  {
    "link": "https://alightcreative.com/?link=...&oobCode=xxxxxx",
    "email": "user@gmail.com",
    "sessionId": "opsional_jika_ada"
  }
  ```
  *(Catatan: `email` bersifat opsional jika sebelumnya sudah memanggil `/send-link` dari sesi/client yang sama).*
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "isPremium": true,
    "message": "Alight Motion Pro VIP berhasil diaktifkan!",
    "formattedText": "*🎉 ALIGHT MOTION PRO VIP AKTIF 🎉*\n\n• *Email:* user@gmail.com...",
    "data": {
      "uid": "user_firebase_uid",
      "email": "user@gmail.com",
      "status": "ACTIVE",
      "membershipStatus": "PREMIUM_ACTIVE",
      "tier": "Alight Motion Pro VIP",
      "subscription": "Yearly VIP License",
      "orderId": "neo-xxxxxx",
      "validUntil": "21 Oktober 2027",
      "stats": {
        "total": 144,
        "today": 20
      }
    }
  }
  ```

---

### 3. Statistik Aktivasi
Melihat jumlah total aktivasi lisensi dan aktivasi hari ini.
- **Method / Path:** `GET /api/am/stats`
- **Response (200 OK):**
  ```json
  {
    "success": true,
    "message": "Statistik Alight Motion Pro",
    "formattedText": "*乂 STATISTIK ALIGHT MOTION PRO 乂*\n\n• *Total Akun Aktif:* 144 Akun...",
    "data": {
      "totalPremium": 144,
      "todayPremium": 20,
      "status": "Online 🟢"
    }
  }
  ```

---

### 4. Panduan & Dokumentasi Help
Mengambil dokumentasi lengkap alur kerja API dalam format JSON dan teks.
- **Method / Path:** `GET /api/am/help`
- **Response (200 OK):** Berisi detail seluruh endpoint, payload body, dan alur penggunaan 4 langkah.

---

### 5. Bot Command Adapter
Endpoint khusus jika Anda ingin menghubungkan API ini langsung dengan bot WhatsApp (Baileys/Wppconnect), Telegram, atau Discord.
- **Method / Path:** `POST /api/am/command`
- **Request Body:**
  ```json
  {
    "text": "!amprem user@gmail.com",
    "senderId": "628123456789@s.whatsapp.net"
  }
  ```
  Atau verifikasi langsung tanpa mengulang email:
  ```json
  {
    "text": "!amverify https://alightcreative.com/?link=...&oobCode=xxxx",
    "senderId": "628123456789@s.whatsapp.net"
  }
  ```
- **Response:** Mengembalikan `replyText` yang diformat khusus untuk chat WhatsApp lengkap dengan emotikon.

---

### 6. Health Check
- **Method / Path:** `GET /health`
- **Response:** `{"success": true, "status": "ok", "service": "alight-motion-premium-api"}`

---

## 🛠️ Instalasi & Menjalankan Project

### 1. Prasyarat
- Node.js versi 18 atau lebih baru.
- npm atau pnpm.

### 2. Setup Awal
```bash
# 1. Clone repository atau buka folder project
cd alight_motion-prem

# 2. Install dependencies
npm install

# 3. Siapkan file environment
# File .env sudah disediakan default yang siap pakai.
```

### 3. Perintah Eksekusi
- **Mode Development (Hot Reload):**
  ```bash
  npm run dev
  ```
- **Menjalankan Pengujian (Testing):**
  ```bash
  npm test
  ```
- **Type Checking (TypeScript):**
  ```bash
  npm run typecheck
  ```
- **Build Production:**
  ```bash
  npm run build
  ```
- **Menjalankan Hasil Build:**
  ```bash
  npm start
  ```

---

## 🚀 Panduan Deployment ke Vercel

Project ini sudah dilengkapi file konfigurasi [`vercel.json`](./vercel.json) bawaan:

1. **Push ke GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial commit alight motion clean architecture api"
   git branch -M main
   git remote add origin https://github.com/USERNAME/REPO_NAME.git
   git push -u origin main
   ```
2. **Import di Vercel:**
   - Kunjungi [Vercel Dashboard](https://vercel.com/) -> **Add New Project** -> **Import Git Repository**.
3. **Atur Environment Variables di Vercel:**
   Tambahkan variabel berikut dari `.env.example`:
   - `FIREBASE_API_KEY`
   - `FIREBASE_IDT_URL`
   - `ALIGHT_VERIFY_URL`
   - `FIREBASE_INSTANCE_ID_TOKEN`
4. **Deploy:**
   - Klik **Deploy**. API Anda akan langsung aktif dengan URL publik `https://nama-project.vercel.app`.

---

## 📄 Lisensi
ISC License.
