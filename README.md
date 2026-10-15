# Brewing Dungeon

Brewing Dungeon adalah aplikasi web interaktif (*single-page application*) yang berfungsi sebagai kalkulator rasio kopi, katalog metode seduh manual (*manual brew*), dan generator panduan seduh berbasis AI menggunakan Google Gemini.

🌐 **Live Demo**: https://brewing-dungeon.vercel.app

---

## One-Line Description
Aplikasi kalkulator dan generator panduan seduh kopi spesialti yang mengombinasikan profil seduh barista juara dunia dengan rekomendasi ekstraksi berbasis Gemini AI.

---

## Overview
Aplikasi ini dibuat sebagai purwarupa (*functional prototype*) untuk membantu penggemar kopi (*home brewer*) menentukan takaran kopi, rasio air, ukuran gilingan (*grind size*), dan tahapan penuangan (*pour schedule*). Selain menyediakan katalog statis berisi metode seduh populer (V60, Aeropress, French Press, Chemex, Espresso, dll.), aplikasi ini mengintegrasikan model Gemini 2.5 Flash untuk menghasilkan instruksi seduh langkah demi langkah yang disesuaikan dengan berat kopi dan gaya seduh tokoh barista dunia (seperti Tetsu Kasuya 4:6, James Hoffmann, Scott Rao, dsb.).

---

## Problem yang Ingin Diselesaikan
* **Ketidakpastian rasio dan takaran air**: Pengguna sering kali bingung menghitung kebutuhan air ketika mengubah gramasi bubuk kopi.
* **Resep seduh yang kaku**: Resep online sering kali hanya menggunakan satu takaran baku (misalnya selalu 15 gram), sehingga sulit disesuaikan jika pengguna ingin menyeduh dengan takaran berbeda.
* **Kurangnya pemahaman sains ekstraksi**: Banyak pemula menyeduh tanpa memahami alasan di balik waktu *blooming*, suhu air, maupun pembagian penuangan (*pulses*).

---

## Target User
* **Home Brewer / Specialty Coffee Enthusiast**: Penggemar kopi seduh manual yang memiliki timbangan digital dan ingin bereksperimen dengan berbagai variabel ekstraksi.
* **Pemula Seduh Manual**: Pengguna yang membutuhkan panduan langkah demi langkah dengan hitungan rasio yang otomatis terkalkulasi.

---

## Core Features
1. **AI Brewing Guide (Gemini 2.5 Flash)**
   * Input: Kluster metode, nama metode, gaya juara (*Champion Style*), berat kopi, rasio air, ukuran gilingan, dan tingkat kekuatan rasa.
   * Output: Rasio konfirmasi, suhu air optimal, estimasi total waktu, panduan penuangan per langkah, prinsip utama, serta penjelasan reaksi kimia dan prinsip fisika.
2. **Kalkulator Rasio Kopi & Air Otomatis**
   * Mengubah berat kopi (gram) secara otomatis menghitung estimasi air (ml) berdasarkan rasio yang dipilih, dan sebaliknya.
3. **Preset Champion Styles**
   * Pilihan profil seduh yang terinspirasi dari tokoh kopi dunia (Tetsu Kasuya 4:6, James Hoffmann, Scott Rao, Jonathan Gagné, Patrik Rolf, Ryan Wibawa, dll.).
4. **Visualisasi Parameter Seduh**
   * Bar rasio visual perbandingan kopi vs air.
   * Indikator *gauge* temperatur air seduh (rentang 80°C - 100°C).
5. **Integrated Brew Timer**
   * Stopwatch digital sederhana (Start, Pause, Reset) untuk memandu proses seduh secara langsung.
6. **Ensiklopedia & Pencarian Metode Seduh**
   * Daftar metode seduh statis lengkap dengan rasio rekomendasi, karakteristik rasa, panduan baku, dan penjelasan sains ekstraksi.
   * Filter pencarian instan berdasarkan nama atau kategori alat.
7. **Dukungan Dua Bahasa (Bilingual)**
   * Penggantian bahasa antarmuka antara Bahasa Indonesia (ID) dan English (EN).

---

## Main User Workflow
```text
[Buka Aplikasi]
       │
       ├──> [Layar Home / Generator AI]
       │       1. Pilih Kluster (misal: Pour-over/Drip)
       │       2. Pilih Metode (misal: Hario V60)
       │       3. Pilih Gaya Juara (misal: Tetsu Kasuya 4:6)
       │       4. Tentukan Berat Kopi (gram) -> Air terhitung otomatis
       │       5. Klik "Seduh!"
       │       6. Baca instruksi langkah demi langkah & buka Brew Timer saat menyeduh
       │
       ├──> [Layar Search]
       │       1. Cari alat seduh (misal: Aeropress)
       │       2. Buka detail metode untuk melihat panduan dasar & sains ekstraksi
       │
       └──> [Layar Profile]
               1. Ganti preferensi bahasa (English / Indonesia)
```

---

## How the Application Works
* Aplikasi berjalan sepenuhnya di sisi peramban (*client-side single page application*).
* Komponen form (`AiRecommendationForm.tsx`) mengumpulkan parameter seduh dari state React lokal.
* Saat tombol seduh diklik, layanan `services/geminiService.ts` mengirimkan prompt terstruktur ke API Gemini menggunakan SDK `@google/genai` dengan model `gemini-2.5-flash` dan skema respons JSON (`responseSchema`).
* Hasil JSON diparsing dan ditampilkan ke layar dengan komponen pendukung seperti timer dan indikator visual.

---

## Technology Stack
* **Frontend Framework**: React 19.1.1
* **Language**: TypeScript 5.8
* **Styling**: Tailwind CSS (melalui script CDN di `index.html`) + CSS Variables bertema *Aurora Dark*
* **Build Tool**: Vite 6.2.0
* **AI SDK**: `@google/genai` 1.20.0
* **State & Localization**: React Context API (`LocalizationContext`)

---

## Current Status
* **Status**: *Functional Prototype*
* Aplikasi dapat dijalankan dan fitur utamanya (AI guide, kalkulator rasio, timer, ensiklopedia, dan ganti bahasa) berfungsi dengan baik.
* Belum memiliki sistem akun pengguna atau database penyimpanan riwayat seduh.

---

## Known Limitations
1. **Penyimpanan Data Sesi Nol (Stateless)**:
   * Hasil rekomendasi AI tidak disimpan ke `localStorage` maupun database. Jika layar ditutup atau di-refresh, hasil seduh akan hilang.
2. **Kunci API Gemini Berada di Sisi Klien**:
   * Konfigurasi `vite.config.ts` menempelkan kunci API langsung ke bundle klien (`process.env.GEMINI_API_KEY`), yang berisiko jika di-deploy ke domain publik tanpa proxy backend.
3. **Timer Bersifat Dasar**:
   * Timer hanya berupa stopwatch naik (*count-up*). Belum ada fitur hitung mundur otomatis per interval penuangan (*pour interval alert/beeps*).
4. **Fitur Pengaturan Terbatas**:
   * Opsi *Notifications* di layar Profil hanyalah toggle state visual dan tidak memiliki integrasi notifikasi sistem atau push notification.

---

## Important Notes for Future Developers
* **Setup API Key**: Buat file `.env.local` atau tentukan *environment variable* `GEMINI_API_KEY` sebelum menjalankan `npm run dev`.
* **Desain Bergaya Mobile**: Tata letak saat ini dibatasi dengan `max-w-lg mx-auto` yang dioptimalkan untuk tampilan smartphone/layar sempit.
* **Perpindahan ke Backend**: Jika aplikasi ini akan dipublikasikan ke production publik, buat endpoint server ringan (Express / Next.js API route / Cloud Function) untuk memanggil API Gemini agar kunci API tidak terekspos ke browser pengguna.

## Cara Menjalankan

```bash
npm install
cp .env.example .env   # isi GEMINI_API_KEY untuk panduan seduh AI
npm run dev
```

Buka `http://localhost:3000`. Tanpa API key, kalkulator rasio dan katalog metode tetap berfungsi penuh.
---

## License

MIT License © 2026 Yudhan Sebastian
