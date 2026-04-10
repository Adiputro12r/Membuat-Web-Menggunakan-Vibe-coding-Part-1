# Implementasi Fitur Registrasi User

Issue ini berisi tahapan implementasi untuk fitur registrasi user baru. Panduan ini dirancang untuk diikuti langkah demi langkah secara terstruktur.

## Spesifikasi Kebutuhan

### 1. Database (Tabel `users`)
Buat tabel `users` dengan skema berikut:
- `id`: integer, auto increment (primary key)
- `name`: varchar(255), not null
- `email`: varchar(255), not null, unique
- `password`: varchar(255), not null (simpan dalam bentuk hash menggunakan `bcrypt`)
- `created_at`: timestamp, default `current_timestamp`

### 2. API Endpoint Registrasi User
Buat REST API dengan spesifikasi:
- **Endpoint:** `POST /api/users`
- **Request Body:**
  ```json
  {
      "name" : "Eko",
      "email" : "eko@localhost",
      "password" : "rahasia"
  }
  ```
- **Response Body (Success):**
  ```json
  {
      "data" : "OK"
  }
  ```
- **Response Body (Error):**
  ```json
  {
      "error" : "Email sudah terdaftar"
  }
  ```

### 3. Struktur Folder dan File
Gunakan struktur berikut di dalam folder `src/`:
- `src/routes/`: Berisi file routing Elysia JS. Contoh penamaan: `users-route.ts`
- `src/services/`: Berisi logic bisnis aplikasi (pengecekan, interaksi database, hashing). Contoh penamaan: `users-service.ts`

---

## Tahapan Implementasi (Langkah demi Langkah)

Untuk developer atau AI agent, silakan ikuti tahapan berikut secara berurutan:

### Tahap 1: Setup Skema Database
1. Buka file skema database (kemungkinan besar menggunakan Drizzle ORM).
2. Tambahkan definisi tabel `users` sesuai dengan spesifikasi di atas.
3. Pastikan kolom `email` dibuat *unique* agar tidak ada alamat email yang sama dalam database.
4. Jalankan perintah migrasi atau *push* schema ke database lokal (misal menggunakan perintah bawaan Drizzle).

### Tahap 2: Pembuatan Service (`src/services/users-service.ts`)
Service bertanggung jawab atas *business logic* agar terpisah dari routing.
1. Buat folder `src/services` jika belum ada.
2. Buat file `src/services/users-service.ts`.
3. Buat sebuah fungsi untuk proses registrasi user.
4. Di dalam fungsi tersebut, query ke database untuk melakukan pengecekan apakah email dari *request* sudah terdaftar.
5. Jika email sudah ada, lemparkan (*throw*) error yang spesifik.
6. Jika email belum ada, lakukan *hashing* pada password menggunakan library `bcrypt` atau yang setara (misal `bun:password` atau `bcryptjs`).
7. Simpan data user baru (id, name, email, password yang sudah di-hash, dan created_at) ke dalam tabel `users` di database.
8. Kembalikan balikan sukses jika proses insert berhasil.

### Tahap 3: Pembuatan Route (`src/routes/users-route.ts`)
Route bertanggung jawab untuk menerima request HTTP, memvalidasi input, dan memanggil Service.
1. Buat folder `src/routes` jika belum ada.
2. Buat file `src/routes/users-route.ts`.
3. Buat rute menggunakan Elysia JS untuk endpoint `POST /api/users`.
4. Tambahkan validasi input request body (menggunakan fitur bawaan TypeBox di Elysia) untuk memastikan `name`, `email`, dan `password` ada dan bertipe string.
5. Di dalam *handler* route, panggil service registrasi yang sudah dibuat di Tahap 2.
6. Jika pemanggilan service sukses, kembalikan HTTP response `{"data": "OK"}`.
7. Tangkap (*block try/catch*) jika ada error dari service (misalnya email sudah terdaftar). Jika error karena email duplikat, kembalikan HTTP response dengan format `{"error": "Email sudah terdaftar"}` beserta status code yang sesuai (contoh: 400).

### Tahap 4: Registrasi Route di App Utama
1. Buka file utama aplikasi Elysia (umumnya `src/index.ts` atau `src/main.ts`).
2. *Import* module/plugin route registrasi dari `src/routes/users-route.ts` yang baru saja dibuat.
3. Gunakan method `.use()` pada *instance* Elysia global agar endpoint `POST /api/users` aktif dan bisa dipanggil.

### Tahap 5: Testing & Verifikasi
1. Jalankan aplikasi secara lokal.
2. Tembak endpoint `POST /api/users` menggunakan HTTP client (Postman, cURL, Bruno, dll) dengan body request yang valid.
3. Pastikan *response* yang didapat adalah `{"data": "OK"}`.
4. Tembak endpoint sekali lagi menggunakan email yang sama. Pastikan *response* yang didapat adalah `{"error": "Email sudah terdaftar"}`.
5. Coba periksa ke database langsung dan pastikan field `password` tidak tersimpan sebagai *plain text* (harus di-hash).
