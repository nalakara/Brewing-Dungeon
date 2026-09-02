# Product

Dokumen ini mendokumentasikan spesifikasi produk **Brewing Dungeon** berdasarkan analisis faktual terhadap kode sumber yang ada.

---

## Product Overview
Brewing Dungeon adalah aplikasi asisten seduh kopi yang berfokus pada penghitungan rasio dan pembuatan panduan seduh berbasis AI. Aplikasi ini menggabungkan basis data statis metode seduh klasik dengan fleksibilitas model bahasa Gemini untuk menyesuaikan resep seduh terhadap gramasi kopi, preferensi rasa, dan gaya juara kompetisi kopi dunia.

---

## Problem Statement
* **Status**: *Inferred* (Disimpulkan dari kebutuhan fitur)
* Penggemar kopi manual sering kesulitan menyesuaikan variabel seduh (rasio, pembagian penuangan air, dan suhu) ketika mengubah gramasi biji kopi. Resep yang tersedia di internet umumnya bersifat statis (misal hanya untuk 15g atau 20g kopi).
* Pemula sering tidak memahami hubungan sebab-akibat antara variabel teknis (suhu, waktu, agitasi) dengan karakteristik rasa akhir cangkir kopi mereka.

---

## Target Users
* **Status**: *Inferred*
1. **Home Coffee Brewer (Pemula hingga Menengah)**: Pengguna yang memiliki peralatan seduh manual (V60, French Press, Aeropress) dan timbangan, membutuhkan panduan langkah demi langkah yang akurat.
2. **Specialty Coffee Enthusiast**: Pengguna yang ingin meniru teknik spesifik dari juara dunia (Tetsu Kasuya, James Hoffmann, Scott Rao) dan tertarik pada aspek sains ekstraksi kopi.

---

## User Needs
* **Implemented**:
  * Mengetahui takaran air yang tepat untuk berat kopi tertentu secara instan.
  * Mendapatkan urutan penuangan air (*pour-by-pour*) yang disesuaikan dengan profil seduh tertentu.
  * Mengakses stopwatch seduh langsung saat membaca instruksi.
  * Mengakses ensiklopedia metode seduh manual dalam Bahasa Indonesia dan English.
* **Partial**:
  * Mengatur preferensi profil (hanya pengaturan bahasa yang berfungsi; pengaturan notifikasi belum aktif).
* **Planned / Belum Ada**:
  * Menyimpan resep favorit atau mencatat hasil seduh sebelumnya (*brew logbook*).

---

## Core Use Cases

### 1. Membuat Resep Seduh Kustom dengan AI
* **Status**: *Implemented*
* **Deskripsi**: Pengguna memilih alat seduh, gaya barista, berat kopi, dan tingkat kepekatan, lalu AI menghasilkan instruksi lengkap beserta parameter suhu dan waktu.

### 2. Menghitung Rasio Kopi & Air
* **Status**: *Implemented*
* **Deskripsi**: Pengguna memasukkan berat kopi, aplikasi otomatis menghitung total air berdasarkan rasio terpilih, atau sebaliknya.

### 3. Menggunakan Stopwatch Saat Menyeduh
* **Status**: *Implemented*
* **Deskripsi**: Pengguna membuka modal timer dari layar panduan seduh untuk mengukur waktu ekstraksi secara manual.

### 4. Eksplorasi Katalog & Edukasi Sains Kopi
* **Status**: *Implemented*
* **Deskripsi**: Pengguna mencari metode seduh tertentu di tab Search, membaca rasio standar, instruksi baku, serta penjelasan kimia dan fisika ekstraksinya.

### 5. Mengganti Bahasa Aplikasi
* **Status**: *Implemented*
* **Deskripsi**: Pengguna dapat mengubah bahasa aplikasi antara Bahasa Indonesia dan English dari layar profil.

---

## User Workflows

### Alur Utama: Pembuatan Panduan Seduh AI
1. Pengguna membuka aplikasi (langsung berada di layar **Home**).
2. Memilih **Kluster Metode** (misal: *Pour-over/Drip*).
3. Memilih **Metode Seduh** (misal: *Hario V60*).
4. Memilih **Champion Style** (opsional, misal: *Tetsu Kasuya 4:6*). Nilai rasio dan ukuran gilingan akan otomatis menyesuaikan dengan preset juara tersebut.
5. Memasukkan **Berat Kopi** (gram). Input **Berat Air** terhitung secara otomatis.
6. Memilih **Grind Size** dan **Target Kekuatan** (*Light*, *Medium*, *Strong*).
7. Menekan tombol **Seduh! / Brew!**.
8. Aplikasi menampilkan status loading, kemudian menampilkan hasil terstruktur:
   * Bar visual rasio kopi-ke-air.
   * Indikator *gauge* suhu air.
   * Total waktu seduh.
   * Instruksi langkah per langkah (*step-by-step*).
   * Prinsip utama, reaksi kimia, dan prinsip fisika.
9. Pengguna dapat menekan tombol **Buka Timer Seduh** untuk memunculkan stopwatch floating.

### Alur Sekunder: Eksplorasi & Pencarian
1. Pengguna memilih tab **Search** di navigasi bawah.
2. Mengetik nama metode (misal: "Aeropress").
3. Memilih kartu metode untuk masuk ke layar **Method Detail**.
4. Membaca panduan standar dan penjelasan ekstraksi.
5. Menekan tombol kembali untuk kembali ke daftar pencarian.

---

## Functional Requirements

| Fitur | Status | Detail Implementasi Aktual |
| :--- | :--- | :--- |
| Pemilihan Kluster & Metode | **Implemented** | Dropdown kluster memfilter daftar metode seduh secara reaktif. |
| Preset Tokoh Juara (*Champion Styles*) | **Implemented** | Terdapat preset tokoh (Hoffmann, Kasuya, Rao, Wibawa, dll.) yang otomatis mengisi rasio dan ukuran gilingan awal. |
| Kalkulator Rasio Otomatis | **Implemented** | Dua arah: mengubah kopi memperbarui air; mengubah air memperbarui kopi berdasarkan rasio terpilih. |
| Pilihan Rasio Kustom | **Implemented** | Opsi "Custom" memungkinkan pengguna memasukkan rasio bebas (misal: 1:16.5). |
| Integrasi AI Gemini | **Implemented** | Menggunakan `@google/genai` dengan model `gemini-2.5-flash` dan `responseSchema` bertipe JSON terstruktur. |
| Visualisasi Rasio & Suhu | **Implemented** | Komponen grafik batang sederhana untuk proporsi kopi/air dan penunjuk jarum untuk suhu. |
| Timer Stopwatch | **Implemented** | Stopwatch standar dengan tombol Play, Pause, dan Reset. |
| Pencarian Metode Seduh | **Implemented** | Filter pencarian teks *case-insensitive* pada array statis metode seduh. |
| Detail Metode Statis | **Implemented** | Menampilkan informasi statis dari `constants.ts` (rasio, suhu, waktu, instruksi, rasa, sains). |
| Pengaturan Bahasa | **Implemented** | Dikelola melalui React Context dengan kamus terjemahan di `localization.ts`. |
| Pengaturan Notifikasi | **Partial** | Toggle switch ada di UI dan dapat di-klik, namun hanya mengubah state komponen lokal tanpa efek sistem apa pun. |
| Riwayat Seduh / Simpan Resep | **Planned** | Tidak ada kode yang menyimpan hasil rekomendasi ke storage. |

---

## Business Rules
* **Status**: *Implemented* (Tercermin dalam logika form dan prompt AI)
1. **Validasi Input**: Tombol submit dinonaktifkan jika berat kopi bernilai 0 atau negatif.
2. **Korelasi Rasio-Air**: `Water Weight = Coffee Weight * Ratio`.
3. **Penyelarasan Bahasa AI**: Prompt yang dikirim ke Gemini secara eksplisit menginstruksikan output dalam bahasa yang sedang aktif (`language === 'id' ? 'Indonesian' : 'English'`).
4. **Sanitasi Suhu Air**: Fungsi `cleanTemperature` pada `geminiService.ts` memastikan nilai suhu yang dihasilkan AI berada pada batas wajar air cair (jika > 100°C karena salah tafsir model, otomatis dikurangi 100).

---

## Data / Entities

### 1. `BrewingMethod`
Entitas statis yang mendefinisikan metode seduh:
* `id`: string
* `name_en` / `name_id`: string
* `category`: string (kluster metode)
* `recommended_ratio`: string
* `recommended_grind`: string
* `recommended_temp`: string
* `brew_time`: string
* `instructions_en` / `instructions_id`: string[]
* `flavor_profile_en` / `flavor_profile_id`: string
* `chemical_reactions_en` / `chemical_reactions_id`: string
* `physical_principles_en` / `physical_principles_id`: string
* `imageUrl`: string

### 2. `AiRecommendation`
Objek hasil respons dari model Gemini:
* `ratio`: string
* `optimal_temperature`: string
* `optimal_time`: string
* `guide`: string[] (langkah-langkah penuangan)
* `key_principles`: string
* `chemical_reactions`: string
* `physical_principles`: string

### 3. `ChampionStyle`
Konfigurasi preset barista pada `constants.ts`:
* `id`: string
* `name`: string
* `methods`: string[] (metode yang didukung)
* `ratio`: number
* `grindSize`: string
* `description_en` / `description_id`: string

---

## AI Capabilities
* **Model**: `gemini-2.5-flash`
* **Peran AI**: Sebagai *Coffee Extraction Specialist*. AI bertugas merancang skedul penuangan dinamis berdasarkan variabel input pengguna serta memberikan penjelasan teoretis di balik resep tersebut.
* **Output Format**: *Structured JSON* via `responseSchema`.
* **Ketergantungan**: Fitur utama aplikasi sangat bergantung pada responsivitas dan ketersediaan API Gemini.

---

## Integrations
* **Google Gemini API**: Terintegrasi via library `@google/genai`.
* **Database Eksternal**: *None* (Tidak ada integrasi database).
* **Autentikasi**: *None* (Tidak ada sistem login/user).
* **Push Notification Service**: *None*.

---

## UX Principles
* **Status**: *Inferred*
* **Mobile-Centric**: Layout dibatasi dalam kontainer vertikal mirip layar smartphone (`max-w-lg mx-auto`).
* **Visual Identity**: Tema gelap bertema luar angkasa / aurora (*Deep Space Blue* `#0D1117`, aksen *Aurora Teal* `#30B6A8`, dan aksen *Cosmic Magenta* `#A475F9`).
* **Satu Layar Utama**: Form input dan kartu hasil berada dalam satu scroll vertikal di halaman Home untuk meminimalkan perpindahan halaman.

---

## Current Scope
* Generator resep seduh manual berbasis AI untuk metode populer.
* Kalkulator perhitungan rasio air otomatis.
* Stopwatch seduh manual.
* Katalog statis metode seduh dan pencarian.
* Pengaturan pergantian bahasa EN/ID.

---

## Out of Scope
* Akun pengguna, otentikasi, atau sinkronisasi multi-perangkat.
* Penyimpanan resep, riwayat seduh, atau catatan rasa (*tasting notes*).
* Integrasi perangkat keras (timbangan pintar Bluetooth seperti Acaia atau Felicita).
* Komunitas pengguna atau fitur berbagi resep (*social sharing*).

---

## Known Limitations
1. **Statelessness**: Seluruh hasil generate hilang seketika saat aplikasi dimuat ulang (*refresh*).
2. **Timer Pasif**: Timer tidak terhubung secara interaktif dengan tahapan langkah penuangan (tidak ada peringatan bunyi saat tiba waktu penuangan ke-2 atau ke-3).
3. **Ketergantungan API Key**: Aplikasi tidak dapat menghasilkan resep jika pengguna tidak memiliki kuota atau kunci API Gemini yang aktif.

---

## Future Opportunities
* **Status**: *Inferred*
1. **Penyimpanan Lokal (Offline-First Journal)**: Menyimpan riwayat seduh dan rating rasa menggunakan `localStorage` atau IndexedDB.
2. **Interactive Step Timer**: Stopwatch yang memandu penuangan secara otomatis per-tahap dengan audio cue atau getaran.
3. **AI Coffee Bean Scanner**: Menggunakan kamera untuk memindai label kemasan biji kopi (asal daerah, proses pengolahan, *roast level*) dan merekomendasikan resep otomatis.
