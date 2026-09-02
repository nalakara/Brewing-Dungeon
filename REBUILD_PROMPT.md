# Rebuild Master Prompt

Dokumen ini berisi **Master Build Prompt** yang siap disalin dan diinstruksikan ke AI Coding Agent (seperti Google AI Studio, Antigravity, Cursor, atau Claude Code) untuk membangun ulang aplikasi ini dari nol dengan standar produksi modern.

---

```markdown
# Role & Project Context
Anda adalah Lead Full-Stack Engineer & Specialty Coffee Technologist. Tugas Anda adalah membangun aplikasi web modern bernama "Brewing Dungeon" — sebuah asisten seduh kopi manual (manual brew) berbasis AI yang menggabungkan kalkulasi rasio presisi, resep kurasi para juara dunia, timer pemandu interaktif, dan penjelasan sains ekstraksi.

---

## 1. Product Purpose & Problem
Menyeduh kopi spesialti (V60, Aeropress, French Press, dll.) membutuhkan kepatuhan pada variabel ekstraksi: berat bubuk kopi, rasio air, suhu, ukuran gilingan, dan skedul penuangan air (pulses). Resep di internet umumnya kaku (hanya untuk 15g) dan tidak menjelaskan alasan ilmiah di balik tekniknya.
Brewing Dungeon menyelesaikan masalah ini dengan mengkalkulasi kebutuhan air secara otomatis untuk berat kopi apa pun, mengadaptasi teknik barista juara dunia (Tetsu Kasuya, James Hoffmann, Scott Rao, dll.), dan memanfaatkan AI untuk merumuskan panduan penuangan langkah demi langkah yang disertai analisis kimia & fisika ekstraksi.

---

## 2. Target Users
* Home Brewers & Penggemar Kopi Manual: Memiliki alat seduh dan timbangan digital, ingin resep seduh yang fleksibel dan presisi.
* Barista Pemula & Mahasiswa Kopi: Ingin memahami sains di balik cangkir kopi (variabel ekstraksi, channeling, laju disolusi senyawa).

---

## 3. Core Concept & Key Pillars
1. Dynamic Ratio & Water Calculator: Perubahan gram kopi otomatis memperbarui volume air sesuai rasio metode/juara.
2. World Champion Styles: Preset profil seduh tokoh ternama yang otomatis menyesuaikan rasio dan grind size.
3. AI Extraction Specialist (Gemini API): Menghasilkan skedul seduh dinamis terstruktur JSON lengkap dengan prinsip ilmiah.
4. Interactive Step-by-Step Timer: Stopwatch yang tersinkronisasi dengan tahapan penuangan air yang dihasilkan AI.
5. Local Brew Journal: Pengguna dapat menyimpan resep hasil racikan AI ke penyimpanan lokal (localStorage) dengan catatan rasa.
6. Bilingual Support: Antarmuka dan instruksi AI mendukung penuh Bahasa Indonesia (ID) dan English (EN).

---

## 4. Feature Specifications

### A. Generator Resep Seduh AI (Layar Utama)
* Input Form:
  - Kluster Metode: Dropdown (Pressure-based, Pour-over/Drip, Immersion, Slow Drip, Boil, Instant).
  - Metode Spesifik: Terfilter sesuai kluster (misal: Hario V60, Kalita Wave, Aeropress, Chemex, French Press, Espresso, Moka Pot, Siphon).
  - Champion Style: Pilihan preset tokoh (misal: "Tetsu Kasuya 4:6 Method", "James Hoffmann 1-Pour", "Scott Rao Spin", "Jonathan Gagné Immersion/Physics", "Patrik Rolf April", "Ryan Wibawa Champion's Flow"). Memilih gaya juara akan otomatis mengatur rasio awal dan rekomendasi grind size.
  - Coffee Weight: Input numerik (dalam gram, default: 15g).
  - Brew Ratio: Dropdown opsi standar (1:12, 1:15, 1:16.67, 1:17) atau pilihan "Custom Ratio".
  - Water Weight: Terhitung otomatis secara dua arah (Coffee * Ratio = Water; mengubah Water memperbarui Coffee).
  - Grind Size: Pilihan (Fine, Medium-Fine, Medium, Medium-Coarse, Coarse).
  - Target Strength: Pilihan (Light, Medium, Strong).
* Output Card (Setelah klik tombol "Seduh!"):
  - Header Ringkasan: Kartu rasio terkonfirmasi, suhu air optimal (°C), dan total estimasi waktu seduh.
  - Visual Bar: Tampilan grafis perbandingan proporsi kopi vs air.
  - Visual Gauge: Indikator termal suhu air (skala 80°C - 100°C).
  - Step-by-Step Pouring Guide: Daftar urutan penuangan air (misal: "00:00 - 00:45: Tuang 45ml air untuk blooming...", "00:45 - 01:15: Tuang hingga 120ml...").
  - Tab / Akordeon Sains Ekstraksi:
    * Key Principles (prinsip utama metode).
    * Chemical Reactions (pelarutan asam malat, lipid, kafein, senyawa gula).
    * Physical Principles (gravitasi, porositas bed bubuk, tekanan osmotik).
  - Action Buttons: "Mulai Timer Seduh" dan "Simpan ke Jurnal".

### B. Interactive Step-by-Step Brew Timer
* Bukan sekadar stopwatch biasa: Menampilkan waktu berjalan (MM:SS) sekaligus menyorot (highlight) langkah penuangan yang sedang aktif berdasarkan durasi waktu.
* Kontrol: Start / Pause / Reset, tombol minimize/fullscreen.
* Audio Cue: Bunyi *beep* halus atau notifikasi visual saat pergantian tahap penuangan.

### C. Jurnal Seduh Lokal (Brew Log)
* Menyimpan riwayat resep yang disukai ke `localStorage`.
* Pengguna dapat menambahkan rating (1-5 bintang) dan catatan rasa (misal: "Floral, aftertaste manis bersih").
* Dapat dilihat kembali di tab "Journal" kapan saja secara offline.

### D. Ensiklopedia & Pencarian Metode
* Daftar katalog metode seduh klasik beserta panduan statis dan karakteristik rasa bawaan.
* Kolom pencarian teks instan untuk menemukan alat seduh dengan cepat.

### E. Multi-Language Switcher
* Tombol ganti bahasa (EN / ID) di header aplikasi yang instan mengubah seluruh label teks dan prompt AI.

---

## 5. Technical Stack & Architecture Expectations
* Frontend: React 18+ atau 19, TypeScript, Tailwind CSS, Lucide Icons.
* Animations: `motion` (Framer Motion) untuk transisi halus antar-layar dan akordeon hasil seduh.
* Backend API Proxy:
  - WAJIB gunakan backend endpoint (Express / Next.js API / server.ts) pada rute `/api/recommend`.
  - API Key Gemini (`GEMINI_API_KEY`) HANYA boleh diakses di sisi server, TIDAK BOLEH diekspos ke browser atau diinjeksi ke bundle frontend melalui Vite define.
* AI Model: Gunakan SDK `@google/genai` dengan model `gemini-2.5-flash`.
* AI Output Format: Wajib menggunakan `responseMimeType: 'application/json'` dan `responseSchema` bertipe OBJECT dengan properti:
  - `ratio` (string)
  - `optimal_temperature` (string)
  - `optimal_time` (string)
  - `guide` (array of strings)
  - `key_principles` (string)
  - `chemical_reactions` (string)
  - `physical_principles` (string)

---

## 6. UX & Visual Direction
* Theme: Dark Mode bernuansa laboratorium luar angkasa (*Aurora Deep Space*).
  - Background: `#0D1117` (Deep Dark Slate).
  - Surface/Containers: `#161B22` dengan efek translusen dan border halus `rgba(139, 148, 158, 0.2)`.
  - Brand Accent: `#30B6A8` (Aurora Teal) dan `#A475F9` (Cosmic Violet).
  - Text: `#F0F6FC` (Headings) dan `#C9D1D9` (Body).
* Layout: Mobile-first responsive layout (kontainer utama `max-w-md` atau `max-w-lg` di tengah layar desktop).
* Ergonomi: Tombol aksi utama (Seduh, Start Timer) berukuran ramah sentuhan (minimal tinggi 44px) untuk memudahkan operasi satu tangan saat barista sedang memegang teko leher angsa (*gooseneck kettle*).

---

## 7. What NOT to Build (Constraints)
* JANGAN buat sistem otentikasi login/signup atau registrasi akun. Aplikasi harus langsung dapat digunakan seketika.
* JANGAN buat feed media sosial atau fitur komentar publik.
* JANGAN gunakan database cloud eksternal; gunakan `localStorage` untuk penyimpanan jurnal.
* JANGAN buat mock data atau simulasi untuk pemanggilan AI; gunakan panggilan asli ke endpoint server dengan API key yang valid.

---

## 8. Definition of Done (DoD)
1. Aplikasi terkompilasi bersih tanpa error TypeScript (`npm run build`).
2. Input gramasi kopi otomatis mengkalkulasi volume air secara real-time.
3. Memilih gaya juara dunia mengubah rasio dan grind size sesuai kurasi.
4. Klik tombol "Seduh!" memanggil backend `/api/recommend`, yang meneruskan ke Gemini 2.5 Flash, dan berhasil menampilkan resep terstruktur.
5. Tombol timer membuka stopwatch interaktif yang menyorot langkah seduh aktif.
6. Resep dapat disimpan ke tab Jurnal dan tetap ada setelah browser di-refresh.
7. Pergantian bahasa (ID/EN) berfungsi mulus di seluruh komponen aplikasi.
8. Kunci API Gemini tersimpan aman di environment server dan tidak terekspos ke klien.
```
