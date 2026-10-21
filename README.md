# 🎬 Alight Motion Pro VIP Generator & API by Justdhif

Web Application & REST API modern berbasis **TypeScript** yang dibangun dengan arsitektur **Clean Architecture (Ports & Adapters)** oleh **[Justdhif](https://github.com/Justdhif)** untuk mengotomatisasi aktivasi lisensi **Alight Motion Pro VIP 1 Tahun**. 

Project ini memungkinkan aktivasi lisensi langsung melalui **Web Generator Interaktif** maupun melalui **REST API** yang dilindungi oleh sistem **Access Key berdurasi paket** (Mingguan, Bulanan, Tahunan).

---

## 📌 Kondisi & Status Project Saat Ini

- **Developer / Author:** [Justdhif](https://github.com/Justdhif)
- **Arsitektur:** Clean Architecture 4 Lapis (*Domain, Application, Infrastructure, Presentation*).
- **Runtime:** Node.js (ESM / NodeNext) dengan TypeScript 5.
- **Framework Web:** Express.js 4 dengan validasi skema berbasis Zod.
- **Web Generator Interaktif:** Dashboard modern (`/` atau `/dashboard`) di mana user dapat melakukan seluruh alur aktivasi VIP secara mandiri di web (Generate Magic Link, Verifikasi VIP 1 Tahun, Bot Runner, Live Counter Stats).
- **Access Key Protection Gate:** Seluruh endpoint dan generator VIP dilindungi oleh sistem **Access Key aktif**. Request tanpa Access Key atau dengan Access Key yang telah kadaluarsa otomatis ditolak (401/403).
- **SaaS Billing & JSON Storage:** Sistem akun (Register & Login JWT) dengan 3 tier paket langganan (Mingguan, Bulanan, Tahunan) yang disimpan ke file JSON lokal (`data/users.json` / `/tmp/users.json` di Vercel) tanpa database eksternal.
- **Deployability:** Siap dideploy ke **Vercel** (Serverless) maupun server VPS/Docker/PaaS konvensional.
- **Testing:** Dilengkapi suite pengujian otomatis (`npm test`) yang memverifikasi gateway logic, session, stats, proteksi Access Key, dan alur billing SaaS.

---

## 🏗️ Struktur Clean Architecture

```text
src/
├── domain/                                  # Lapisan 1: Domain Entities & Kontrak Interfaces (Murni TypeScript)
│   ├── entities/
│   │   ├── Billing.ts                       # Model Paket Langganan, User Account, Tier Durasi
│   │   ├── User.ts                          # Model AlightMotionUser (status akun, lisensi, masa aktif)
│   │   ├── Stats.ts                         # Model StatsData & StoredStats
│   │   └── Session.ts                       # Model PendingSession (TTL & metadata)
│   ├── repositories/
│   │   ├── IUserRepository.ts               # Kontrak repository data akun pengguna & billing
│   │   ├── IStatsRepository.ts              # Kontrak repository statistik
│   │   └── ISessionRepository.ts            # Kontrak repository sesi verifikasi
│   └── gateways/
│       ├── IFirebaseAuthGateway.ts          # Kontrak integrasi Firebase Identity Toolkit
│       └── IAlightGateway.ts                # Kontrak aktivasi lisensi Alight Creative
│
├── application/                             # Lapisan 2: Use Cases & DTO (Business Logic Aplikasi)
│   ├── dto/
│   │   ├── alightMotion.dto.ts              # DTO Input & Output operasi Alight Motion
│   │   └── auth.dto.ts                      # DTO Register, Login, Subscribe, & Api Key
│   └── usecases/
│       ├── billing/                         # Use case SaaS Billing (ValidateApiKey, SubscribePlan, etc.)
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
│   │   ├── JsonUserRepository.ts            # Penyimpanan akun user JSON lokal (auto-fallback memori & /tmp)
│   │   ├── FileStatsRepository.ts           # Penyimpanan statistik file lokal dengan in-memory fallback
│   │   └── InMemorySessionRepository.ts     # Penyimpanan sesi sementara dengan auto-cleanup TTL
│   ├── security/
│   │   ├── PasswordHasher.ts                # PBKDF2 Password Hashing
│   │   └── TokenService.ts                  # HMAC-SHA256 JWT Token Service
│   └── container.ts                         # Composition Root (Dependency Injection / Wiring)
│
├── presentation/                            # Lapisan 4: Interface Adapters (HTTP & Web Layer)
│   ├── controllers/
│   │   ├── alightMotion.controller.ts       # Controller operasi Alight Motion
│   │   ├── auth.controller.ts               # Controller Autentikasi (Register/Login)
│   │   └── billing.controller.ts            # Controller SaaS Billing & Paket
│   ├── views/
│   │   └── dashboardHtml.ts                 # Web Generator & Dashboard HTML UI (Tailwind CSS Dark Mode)
│   ├── presenters/
│   │   └── messagePresenter.ts              # Pemformat teks respon siap kirim (format WhatsApp Justdhif)
│   ├── schemas/
│   │   └── alightMotion.schema.ts           # Validasi data request dengan Zod
│   ├── middlewares/
│   │   ├── apiKeyAuth.ts                    # Proteksi Access Key aktif & validasi durasi expired
│   │   ├── userAuth.ts                      # Proteksi autentikasi token JWT pengguna
│   │   ├── rateLimiter.ts                   # Multi-tier rate limiting
│   │   └── errorHandler.ts                  # Global error handling & credential masking
│   └── routes/
│       ├── alightMotion.routes.ts           # Router /api/am/...
│       ├── auth.routes.ts                   # Router /api/auth/...
│       ├── billing.routes.ts                # Router /api/billing/...
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
1. **Status Guard Access Key:** Menampilkan apakah kunci Anda aktif, paket yang dimiliki, serta sisa hari masa aktif. Jika tidak memiliki kunci aktif, web secara otomatis memblokir aksi dan mengarahkan ke halaman paket.
2. **Langkah 1: Generate & Kirim Magic Link:** Cukup masukkan alamat email target, sistem langsung mengirimkan link resmi ke inbox email pengguna.
3. **Langkah 2: Verifikasi & Aktivasi VIP 1 Tahun:** Tempelkan link dari email, sistem langsung mengaktifkan lisensi Alight Motion Pro VIP 1 Tahun dan menampilkan kartu status sukses.
4. **WhatsApp Bot Command Runner:** Menjalankan perintah bot WhatsApp seperti `!amprem <email>`, `!amstats`, dan `!amhelp`.
5. **Paket & Billing:** Memilih paket (Mingguan, Bulanan, Tahunan) untuk mengaktifkan Personal Access Key.
6. **User Dashboard:** Memantau status paket, menyalin Personal Access Key (`am_live_...`), dan mereset kunci.

---

## 💎 Paket Langganan & Access Key

Setiap akun memiliki **Access Key unik** (`am_live_...`) dengan masa berlaku yang disesuaikan dengan durasi paket:

| Paket | Durasi | Harga | Fitur Utama |
| :--- | :--- | :--- | :--- |
| **Mingguan** | 7 Hari | Rp 15.000 | Akses penuh Web Generator & REST API, bot WhatsApp |
| **Bulanan** | 30 Hari | Rp 45.000 | Prioritas Fast Gateway, Hemat 25% |
| **Tahunan** | 365 Hari (1 Thn) | Rp 150.000 | Bypass rate-limit, akses reseller / bot massal, Hemat 70% |

> **Masa Berlaku & Expired Key:**  
> Ketika masa aktif paket berakhir, status akun berubah menjadi `expired`. Middleware `requireApiKey` akan otomatis menolak request dengan status **403 Forbidden** dan instruksi perpanjangan paket.

---

## 📡 Daftar Endpoint API

### 1. Kirim Magic Link (Wajib Access Key)
- **Method / Path:** `POST /api/am/send-link` (alias: `POST /api/am/request-link`)
- **Headers:** 
  - `Content-Type: application/json`
  - `x-api-key: YOUR_ACCESS_KEY`
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

### 2. Verifikasi & Aktivasi Lisensi Pro VIP (Wajib Access Key)
- **Method / Path:** `POST /api/am/verify` (alias: `POST /api/am/verify-link`)
- **Headers:** 
  - `Content-Type: application/json`
  - `x-api-key: YOUR_ACCESS_KEY`
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
    "message": "Alight Motion Pro VIP berhasil diaktifkan!",
    "formattedText": "*🎉 ALIGHT MOTION PRO VIP AKTIF 🎉*\n\n• *Email:* user@gmail.com...",
    "data": {
      "uid": "firebase_uid",
      "email": "user@gmail.com",
      "status": "ACTIVE",
      "tier": "Alight Motion Pro VIP",
      "subscription": "Yearly VIP License"
    }
  }
  ```

---

### 3. Bot Command Adapter (Wajib Access Key)
- **Method / Path:** `POST /api/am/command`
- **Headers:**
  - `Content-Type: application/json`
  - `x-api-key: YOUR_ACCESS_KEY`
- **Request Body:**
  ```json
  {
    "text": "!amprem user@gmail.com",
    "senderId": "628123456789@s.whatsapp.net"
  }
  ```
- **Response:** Mengembalikan respon pesan chat WhatsApp resmi ber-branding Justdhif.

---

### 4. Statistik Aktivasi (Akses Publik / Key Opsional)
- **Method / Path:** `GET /api/am/stats`
- **Response (200 OK):** Menampilkan total aktivasi keseluruhan dan aktivasi hari ini.

---

### 5. Panduan Bantuan (Akses Publik / Key Opsional)
- **Method / Path:** `GET /api/am/help`
- **Response (200 OK):** Menampilkan dokumentasi alur kerja generator dalam format teks dan DTO.

---

### 6. Endpoint SaaS Billing & Akun
- `POST /api/auth/register`: Mendaftar akun baru dan mendapatkan Personal Access Key.
- `POST /api/auth/login`: Masuk akun dan menerima token JWT.
- `GET /api/auth/me`: Melihat profil akun, sisa hari aktif paket, dan access key.
- `GET /api/billing/plans`: Melihat daftar paket langganan (Mingguan, Bulanan, Tahunan).
- `POST /api/billing/subscribe`: Mengaktifkan paket langganan (Bearer Token).
- `POST /api/billing/regenerate-key`: Mereset dan membuat Access Key baru jika kunci lama bocor.

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
   git commit -m "feat: complete web generator with access key guard"
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
