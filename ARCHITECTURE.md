# Architecture

Dokumen ini menjelaskan arsitektur teknis dari aplikasi **Brewing Dungeon** berdasarkan hasil inspeksi langsung terhadap struktur berkas dan kode sumber.

---

## Technology Stack

### What Was Actually Found
* **Runtime / Environment**: Web Browser (Client-side execution)
* **Frontend Library**: React 19.1.1 (menggunakan functional components dan standard hooks)
* **Language**: TypeScript 5.8.2
* **Build Tool & Bundler**: Vite 6.2.0 (`@vitejs/plugin-react` 5.0.0)
* **CSS Framework**: Tailwind CSS (dimuat via CDN `<script src="https://cdn.tailwindcss.com"></script>` pada `index.html`)
* **AI Client Library**: `@google/genai` 1.20.0 (Google Gen AI SDK)

---

## Project Structure

Struktur berkas proyek saat ini sangat datar dan ringkas:

```text
/
├── App.tsx                           # Komponen utama navigasi tab & header
├── index.html                        # Entry point HTML, font Montserrat, tailwind CDN & custom CSS
├── index.tsx                         # Mount React DOM ke #root
├── package.json                      # Daftar dependency dan script dev/build
├── tsconfig.json                     # Konfigurasi compiler TypeScript
├── vite.config.ts                    # Konfigurasi Vite & injeksi API key
├── metadata.json                     # Metadata AI Studio
├── constants.ts                      # Data statis metode seduh, kluster, & gaya juara
├── types.ts                          # Definisi interface & type TypeScript
├── localization.ts                   # Kamus teks dwibahasa (en / id)
├── context/
│   └── LocalizationContext.tsx       # Context provider untuk bahasa
├── services/
│   └── geminiService.ts              # Logika pemanggilan Google GenAI SDK
└── components/
    ├── AiRecommendationForm.tsx      # Komponen form input, kalkulator, dan render hasil AI
    ├── BrewTimer.tsx                 # Stopwatch mengambang (floating modal)
    ├── MethodCard.tsx                # Kartu tampilan ringkas metode seduh
    └── screens/
        ├── HomeScreen.tsx            # Layar beranda (merender AiRecommendationForm)
        ├── SearchScreen.tsx          # Layar pencarian dan filter metode
        ├── MethodDetailScreen.tsx    # Layar rincian metode statis
        └── ProfileScreen.tsx         # Layar profil & preferensi
```

---

## Application Structure

Aplikasi ini dirancang sebagai Single-Page Application (SPA) tanpa router eksternal (seperti React Router).
* Navigasi diatur menggunakan internal view state (`'home' | 'search' | 'profile'`) di dalam `App.tsx`.
* Jika sebuah metode dipilih (`selectedMethod !== null`), aplikasi beralih menampilkan `MethodDetailScreen` dan menyembunyikan navigasi bawah (*bottom bar*).

---

## Main Components

1. **`App.tsx`**:
   * Bertindak sebagai *shell layout* dengan batasan lebar `max-w-lg mx-auto`.
   * Mengatur navigasi tab bawah dan header statis dengan logo SVG kopi.
2. **`HomeScreen.tsx`**:
   * Komponen pembungkus sederhana yang langsung merender `AiRecommendationForm`.
3. **`AiRecommendationForm.tsx`**:
   * Komponen paling masif di dalam aplikasi (~380 baris).
   * Mengelola state form parameter seduh (berat kopi, air, rasio, metode, gaya juara).
   * Mengatur kalkulasi rasio timbal balik (*two-way binding calculation*).
   * Memanggil `getAiRecommendation()` dan merender hasil visual (bar rasio, gauge suhu, instruksi, dan prinsip kimia/fisika).
   * Menampung tombol pembuka modal `BrewTimer`.
4. **`BrewTimer.tsx`**:
   * Komponen stopwatch independen menggunakan interval `setInterval` standar.
5. **`SearchScreen.tsx`**:
   * Menyediakan form input pencarian teks untuk memfilter data array `BREWING_METHODS` dari `constants.ts`.
6. **`MethodDetailScreen.tsx`**:
   * Menampilkan panduan statis, karakteristik rasa, dan prinsip ekstraksi dari metode yang dipilih.
7. **`ProfileScreen.tsx`**:
   * Mengatur bahasa aplikasi melalui `useLocalization()` dan menampilkan toggle notifikasi (dummy state).

---

## Data Model

Semua tipe data didefinisikan dalam `types.ts`:

* **`BrewingMethod`**: Representasi alat seduh beserta instruksi dan karakteristik ilmiahnya dalam dua bahasa.
* **`AiRecommendation`**: Struktur data dari respons JSON Gemini (rasio, suhu, waktu, panduan langkah, prinsip sains).
* **`Language`**: `'en' | 'id'`.

Data master disimpan langsung dalam variabel konstanta memori di `constants.ts`:
* `BREWING_METHODS`: Array berisi 13 metode seduh lengkap.
* `METHOD_CLUSTERS`: Array 6 kategori metode seduh.
* `CHAMPION_STYLES`: Array profil barista dunia beserta rasio default-nya.
* `COMMON_RATIOS`: Pilihan rasio umum (1:10 hingga 1:18).

---

## State Management

### What Was Actually Found
* **Global State**: Hanya preferensi bahasa yang dikelola secara global menggunakan React Context (`LocalizationContext`).
* **Local Component State**: Seluruh logika aplikasi lainnya dikelola menggunakan `useState` di dalam komponen masing-masing:
  * Tab aktif dan metode terpilih di `App.tsx`.
  * Seluruh input form, status loading, dan objek rekomendasi AI di `AiRecommendationForm.tsx`.
  * Waktu detik berjalan di `BrewTimer.tsx`.
  * Kata kunci pencarian di `SearchScreen.tsx`.

### Interpretation
Tidak ada perpustakaan *state management* eksternal (Redux, Zustand, atau TanStack Query). Untuk skala aplikasi saat ini, pendekatan ini efisien dan minim *overhead*, namun membuat state hasil generate tidak dapat diakses di luar komponen `AiRecommendationForm`.

---

## Data Flow

1. **User Interaction**: Pengguna mengubah input (misal: berat kopi) -> `handleCoffeeWeightChange` menghitung ulang `waterWeight` berdasarkan rasio aktif.
2. **Preset Selection**: Memilih `ChampionStyle` memicu penyesuaian otomatis pada state `ratio`, `grindSize`, dan menghitung ulang berat air.
3. **AI Request**: Menekan tombol Seduh memicu `getAiRecommendation()`:
   * Data dari state dirangkai menjadi teks prompt.
   * Dikirim via `@google/genai` ke endpoint Google.
   * Model mengembalikan payload teks berformat JSON terstruktur.
   * Nilai diparsing ke objek `AiRecommendation`.
   * State lokal `recommendation` diisi dan memicu render hasil.

---

## Storage / Persistence

### What Was Actually Found
* **Database**: **Tidak ada** (Tidak ada Firebase, Cloud SQL, Supabase, dsb.).
* **Browser Storage**: **Tidak ada** (Tidak ditemukan penggunaan `localStorage` maupun `sessionStorage`).
* **Karakteristik**: Aplikasi bersifat 100% *ephemeral* (sementara). Begitu tab browser ditutup atau di-*refresh*, seluruh histori dan hasil generate terhapus.

---

## External Services & AI Integration

### What Was Actually Found
Satu-satunya layanan eksternal yang dihubungi adalah Google Gemini API:
* **SDK**: `@google/genai` (versi modern).
* **Model**: `gemini-2.5-flash`.
* **Parameter Output**: Menggunakan `responseMimeType: 'application/json'` dengan `responseSchema` bertipe `Type.OBJECT` untuk menjamin struktur output yang konsisten.
* **Inisialisasi**:
  ```ts
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  ```
  Di mana `process.env.API_KEY` diinjeksikan pada saat build/dev oleh Vite melalui konfigurasi `define` di `vite.config.ts`.

---

## Important Dependencies
* `react` & `react-dom` (^19.1.1): Library UI dasar.
* `@google/genai` (^1.20.0): SDK resmi Google untuk berinteraksi dengan model Gemini.
* Catatan khusus: Terdapat deklarasi `importmap` pada `index.html` yang merujuk ke CDN `aistudiocdn.com`, tetapi proyek lokal sebenarnya menggunakan paket npm yang terinstal di `node_modules` via Vite.

---

## Architectural Patterns
* **Single-Page Application (SPA)** dengan pendekatan *Component-Driven*.
* **Service Layer**: Pemanggilan AI diabstraksikan ke dalam modul terpisah `services/geminiService.ts`.
* **Static Configuration Pattern**: Seluruh data domain (metode, kluster, champion) dipisahkan ke `constants.ts`.
* **Dictionary Localization**: Menggunakan kamus objek sederhana dengan fungsi terjemahan `t(key)`.

---

## Security Considerations

### What Was Actually Found (Kritikal)
* **Ekspos Kunci API**: Kunci API Gemini diekspos langsung ke browser pengguna melalui konfigurasi:
  ```ts
  // vite.config.ts
  define: {
    'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
  }
  ```
  Dalam arsitektur frontend murni (*client-side*), nilai ini akan terbakar (*inlined*) ke dalam bundle JavaScript publik. Siapa pun yang membuka tab *Inspect Element -> Network / Sources* dapat membaca kunci API tersebut.
* **Rekomendasi Arsitektur**: Sebelum aplikasi di-host secara publik, wajib dibuatkan backend proxy tipis (misalnya Express API route, Cloud Functions, atau Cloudflare Worker) agar kunci API tetap aman di sisi server.

---

## Current Technical Debt
1. **Monolithic Component (`AiRecommendationForm.tsx`)**:
   * Komponen ini merangkap terlalu banyak tanggung jawab: input form, validasi, kalkulasi rasio, eksekusi service AI, rendering grafik, rendering langkah seduh, dan manajemen modal timer.
2. **Ketiadaan Error Boundary**:
   * Jika pemanggilan API gagal atau JSON dari AI rusak (*malformed*), penanganan error saat ini hanya menampilkan pesan teks sederhana di dalam state komponen.
3. **Pemuangan Ganda Tailwind CSS**:
   * Tailwind dimuat via CDN script di `index.html` (`<script src="https://cdn.tailwindcss.com"></script>`), sekaligus terdapat berkas `/index.css`. Ini merupakan pola khas prototipe cepat.

---

## Scalability Considerations
* **Client Scalability**: Sangat ringan karena beban komputasi hanya berupa rendering DOM statis dan kalkulasi matematika sederhana.
* **Cost & API Quota**: Karena tidak ada mekanisme *caching* (misalnya menyimpan hasil kombinasi input yang sama), setiap kali pengguna mengklik "Seduh!", satu kuota panggilan API Gemini akan terpakai.

---

## Maintainability Considerations
* Penambahan metode seduh baru sangat mudah karena cukup memperbarui array `constants.ts`.
* Kamus bahasa `localization.ts` tersusun rapi per-kunci, sehingga penambahan bahasa baru (misalnya Jepang atau Spanyol) dapat dilakukan dengan mudah tanpa mengubah struktur komponen.

---

## Architecture Assessment

### What Was Actually Found
Arsitektur aplikasi ini adalah **Frontend Client-Only Prototype**. Arsitektur ini dibangun dengan cepat untuk memvalidasi ide produk: "Apakah AI dapat menghasilkan instruksi seduh kopi manual yang presisi dan relevan secara sains?".

### Interpretation
Dari sudut pandang *rapid prototyping*, arsitektur ini berhasil mencapai tujuannya dengan kode yang relatif bersih, minim dependensi yang membengkak, dan pemanfaatan `responseSchema` Gemini yang tepat. Namun, ketiadaan layer backend dan database penyimpanan menjadikannya belum siap untuk lingkungan produksi skala luas.
