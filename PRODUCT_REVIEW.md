# Product Review

Dokumen ini memberikan evaluasi kritis dan objektif terhadap kondisi aplikasi **Brewing Dungeon** saat ini, mengidentifikasi kelebihan, kelemahan, utang teknis, serta rekomendasi langkah strategis ke depan.

---

## Current Maturity

### **Pilihan: Functional Prototype**

**Alasan**:
Aplikasi ini sudah melampaui tahap prototipe visual (mockup) karena fitur intinya benar-benar bekerja secara *end-to-end*:
* Form input kalkulasi rasio berfungsi dua arah.
* Panggilan ke model Gemini 2.5 Flash menghasilkan respons JSON terstruktur yang valid dan relevan dengan dunia kopi spesialti.
* Stopwatch seduh dapat dioperasikan.
* Seluruh teks antarmuka dan basis pengetahuan dwibahasa (Inggris & Indonesia) dapat diakses dengan lancar.

Namun, aplikasi ini **belum dapat disebut MVP (Minimum Viable Product)** karena:
1. Tidak ada mekanisme penyimpanan data (hasil generate hilang seketika saat halaman dimuat ulang).
2. Kunci API Gemini terekspos di sisi klien (`vite.config.ts`), sehingga tidak aman untuk dirilis ke pengguna umum.
3. Masih terdapat elemen antarmuka yang berupa *dummy* (seperti toggle notifikasi di profil).

---

## What Works Well
1. **Kualitas Domain Data Kopi (`constants.ts`)**:
   * Data 13 metode seduh manual lengkap dengan rasio standar, profil rasa, serta penjelasan kimiawi dan fisikanya ditulis dengan sangat baik dan bernilai edukatif tinggi.
   * Preset tokoh juara (*Champion Styles*: Hoffmann, Kasuya, Rao, Wibawa, dll.) memberikan daya tarik kurasi yang nyata bagi pecinta kopi.
2. **Kalkulator Rasio Reaktif**:
   * Logika sinkronisasi antara berat kopi dan kebutuhan air berjalan mulus dan intuitif.
3. **Pemanfaatan Structured JSON Schema Gemini**:
   * Penggunaan `responseSchema` pada panggilan Gemini menghasilkan data yang stabil, rapi, dan langsung dapat dirender tanpa risiko format teks berantakan.
4. **Pergantian Bahasa yang Mulus**:
   * Penggantian bahasa (EN/ID) memengaruhi seluruh teks aplikasi dan instruksi prompt AI secara konsisten.

---

## What Is Valuable
* **Konsep "Sains di Balik Cangkir"**: Mayoritas aplikasi kopi hanya memberikan resep tanpa menjelaskan *mengapa* resep tersebut bekerja. Penjelasan tentang ekstraksi senyawa asam, lipid, dan hidrodinamika penuangan memberikan diferensiasi yang kuat dibanding aplikasi *coffee timer* konvensional.
* **Kurasi Profil Juara**: Memadukan teori barista dunia dengan kalkulasi dinamis berbasis gramasi adalah proposisi nilai yang sangat menarik bagi komunitas *home brewer*.

---

## UX Issues
1. **Komponen Form Terlalu Panjang dalam Satu Halaman**:
   * Di layar *Home*, pengguna harus melakukan *scroll* panjang untuk mengisi form, lalu melakukan *scroll* lagi ke bawah untuk melihat hasil generate AI.
2. **Timer Terisolasi dalam Modal Sederhana**:
   * Saat pengguna membuka *Brew Timer*, instruksi langkah seduh tertutup oleh pop-up timer. Pengguna harus mengingat langkah penuangan atau bolak-balik menutup modal.
3. **Ketiadaan Indikator Progres Seduh Otomatis**:
   * Timer hanya berjalan sebagai stopwatch umum (00:00 -> 00:01...), tidak otomatis memberi penanda visual atau audio ketika waktu penuangan berikutnya tiba (misal: "Tuang air ke-2 pada detik ke-45").

---

## Product Issues
1. **Sifat Sesi yang Sekali Pakai (*Disposable*)**:
   * Setelah AI merumuskan resep yang sangat enak, pengguna tidak dapat menekan tombol "Simpan ke Favorit" atau "Catat Hasil Seduh". Nilai guna aplikasi terputus begitu cangkir kopi selesai diseduh.
2. **Tab Profil Tanpa Fungsi Nyata**:
   * Tab *Profile* hanya berisi pemilih bahasa dan toggle notifikasi yang tidak aktif. Menjadikan satu tab navigasi khusus untuk dua kontrol kecil adalah pemborosan hierarki antarmuka.

---

## Technical Issues
1. **Kerentanan Keamanan API Key**:
   * Kunci API Gemini diinjeksi ke bundle frontend via `define` di `vite.config.ts`. Jika di-deploy ke hosting publik (Vercel, Netlify, Cloud Run), kunci ini dapat dicuri oleh pengguna lain melalui DevTools browser.
2. **Pemuangan Styling yang Campur Aduk**:
   * Menggunakan script CDN Tailwind di `index.html` sekaligus berkas `index.css`. Pada lingkungan produksi, konfigurasi Tailwind sebaiknya dikompilasi secara lokal via Vite/PostCSS untuk menghindari ketergantungan pada script eksternal.

---

## Technical Debt
1. **Monolitik `AiRecommendationForm.tsx`**:
   * Komponen ini mencapai ~380 baris dan menggabungkan *state management*, kalkulasi matematika, API call, rendering diagram bar, dan modal timer. Perlu dipecah menjadi komponen modular: `BrewForm`, `RatioCalculator`, `BrewResultView`, dan `ScienceExplanation`.
2. **Ketiadaan Unit Test**:
   * Logika kalkulasi rasio dan sanitasi suhu tidak memiliki pengujian otomatis (*unit testing*).

---

## Risks
* **Biaya API Gemini**: Jika aplikasi dipublikasikan tanpa autentikasi atau rate-limiting, pengguna dapat melakukan spam tombol seduh yang berpotensi menghabiskan kuota atau tagihan API.
* **Risiko Ekstraksi Kurang Tepat dari AI Halusinasi**: Walaupun menggunakan skema terstruktur, sesekali model AI dapat merekomendasikan suhu atau pembagian air yang kurang lazim jika prompt tidak dikontrol ketat dengan batasan domain (*guardrails*).

---

## What Should Be Preserved
* Seluruh data statis dan kurasi metode seduh di `constants.ts`.
* Skema JSON terstruktur untuk respons AI di `services/geminiService.ts`.
* Skema warna dan identitas visual *Aurora Space Dark* yang memiliki karakter unik dan tidak generik.
* Sistem lokalisasi dwibahasa (EN/ID).

---

## What Should Be Changed
1. **Pindahkan Panggilan Gemini ke Backend Proxy**:
   * Buat rute API server-side sederhana (misal: `/api/recommend`) untuk mengamankan API key dan menerapkan pembatasan panggilan (*rate limit*).
2. **Ubah Timer Menjadi Pemandu Interaktif (*Guided Brew Timer*)**:
   * Timer harus terhubung langsung dengan langkah-langkah penuangan hasil AI (menampilkan countdown per tahapan, misalnya *00:00 - 00:45: Blooming 45ml*).
3. **Pindahkan Pengaturan Bahasa ke Header/Modal**:
   * Hapus tab *Profile* yang kosong, gantikan dengan tab *History / Saved Recipes* (Buku Jurnal Seduh).

---

## What Should NOT Be Over-Engineered
* **Jangan buat sistem sosial atau feed publik**: Aplikasi ini adalah utilitas personal, bukan media sosial kopi.
* **Jangan bangun database relasional yang rumit**: Untuk tahap berikutnya, cukup gunakan `localStorage` peramban atau Firebase Firestore dokumen sederhana untuk menyimpan riwayat seduh.
* **Jangan tambahkan machine learning lokal untuk pengenalan gambar**: Fokus tetap pada presisi resep dan panduan ekstraksi.

---

## Recommended Direction

### **Pilihan: EVOLVE**

**Alasan Objektif**:
Aplikasi ini memiliki **fondasi ide dan kurasi data yang sangat kuat**, serta kode dasar yang rapi dan mudah dibaca. Membuang atau mengarsipkannya adalah sebuah kerugian karena basis data kopi dan integrasi skema Gemini di dalamnya sudah berjalan dengan baik.

Namun, mendiamkannya (*Keep As Is*) atau sekadar merapikan CSS (*Polish*) juga tidak menyelesaikan masalah utama: **ketiadaan penyimpanan riwayat seduh** dan **isu keamanan API key**.

Langkah **EVOLVE** adalah jalur paling rasional:
1. Pindahkan repositori ini ke GitHub.
2. Tambahkan backend proxy tipis (atau Cloud Function) untuk mengamankan `GEMINI_API_KEY`.
3. Tambahkan fitur **Local Storage Brew Journal** agar pengguna bisa menyimpan resep favorit mereka.
4. Hubungkan output langkah AI langsung ke *Interactive Countdown Timer*.
Dengan 3 langkah evolusi tersebut, aplikasi ini langsung naik kelas dari *Functional Prototype* menjadi **MVP unggulan yang siap dipakai harian oleh ribuan home brewer**.
