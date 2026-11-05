# NCC Digital Detective

Website interaktif untuk memperkenalkan Laboratorium Net-Centric Computing, Departemen Teknik Informatika, Institut Teknologi Sepuluh Nopember, kepada siswa SMA di pameran laboratorium.

Tiga misi dapat dimainkan bebas tanpa akun atau backend:

- **Bongkar Pesan Rahasia:** selidiki piksel gambar kiriman, pecahkan petunjuk, baca kode tersembunyi, dan buka berkas NCC. Setelah berhasil, coba menyisipkan pesan UTF-8 sendiri dan mengunduh hasil PNG. Penyisipan serta decoding memakai LSB RGB nyata melalui Canvas.
- **Detektif Jejak Digital:** kasus fiktif, pemilihan bukti, linimasa dengan tombol pengurutan, dan kesimpulan berdasarkan bukti.
- **Selamatkan Server!:** latihan kapasitas serta tantangan 30 detik dengan distribusi permintaan, antrean, anggaran, dan lonjakan terjadwal.

## Menjalankan

Gunakan Node.js 22.12+ atau 24+. Instalasi awal membutuhkan internet.

```sh
npm install
npm run dev
```

Buka URL lokal yang dicetak Vite, biasanya `http://127.0.0.1:5173/`.

Untuk mengakses dari HP dalam jaringan Wi-Fi yang sama, jalankan `npm run dev -- --host 0.0.0.0`, lalu buka alamat IP LAN komputer dengan port Vite. Akses dapat memerlukan aturan firewall lokal.

```sh
npm run build
npm run preview
```

Build statis tersedia di `dist/`. Unggah isi folder tersebut ke hosting statis. Navigasi menggunakan hash sehingga tidak memerlukan rewrite rute server. Website belum dipublikasikan ke hosting.

## Verifikasi

```sh
npm test
npm run test:browser
```

Pengujian logika memakai Vitest. Pengujian browser memakai Playwright dengan Microsoft Edge yang terpasang, pada viewport HP 390 × 844 dan desktop 1280 × 900. Playwright menyalakan dev server sendiri jika port 5173 belum digunakan. Jika Edge tidak tersedia, sesuaikan `channel` di `playwright.config.ts` dengan browser yang tersedia.

Lihat [hasil verifikasi](docs/verification-results.md), [rencana pemeriksaan lengkap](docs/verification-plan.md), dan [alur website](docs/website-flow.md).

## Struktur kode

```text
src/
  App.tsx                 Navigasi, pembuka, peta, koleksi, profil
  state.tsx               Progres berversi dan fallback penyimpanan
  components/             Dialog, hasil, SVG custom, renderer server
  core/                   Logika steganografi, forensik, dan simulasi
  missions/               Tiga layar permainan yang dimuat terpisah
  assets/                 Salinan logo untuk tampilan
  styles.css              Palet dan tata letak responsif
tests-browser/            Pemeriksaan alur pada browser
docs/                     Rancangan dan verifikasi
```

## Aset dan perilaku

- Logo menggunakan `ncc.png` dari pengguna. `src/assets/ncc-display.png` adalah salinan dengan resolusi lebih kecil; bentuk dan warna identitas dipertahankan. Buat ulang dengan `node scripts/optimize-logo.mjs` jika file sumber diganti.
- Ilustrasi dan lencana dibuat dengan SVG; gambar steganografi dihasilkan secara prosedural; animasi server menggunakan Canvas 2D. Motion menangani transisi layar dan menghormati reduced motion.
- Font DM Sans dan Space Grotesk dibundel lokal melalui Fontsource; tidak ada permintaan Google Fonts saat aplikasi berjalan.
- Progres dan lencana disimpan pada `ncc-digital-detective:v1` di localStorage. Pesan rahasia dan data pribadi tidak disimpan. Jika storage ditolak, permainan memakai memori sesi.
- **Pengunjung Baru** meminta konfirmasi sebelum menghapus progres aplikasi. **Mulai Ulang** hanya mereset percobaan misi aktif.
- Tantangan berhenti saat tab tersembunyi atau petunjuk dibuka. Pengunjung memilih **Lanjutkan** untuk meneruskan; saldo tidak berkurang selama jeda.
- Tidak memakai WebGL, audio, API berbayar, backend, atau layanan AI. Sesudah aset yang diperlukan dimuat, logika permainan berjalan lokal. Akses pertama tanpa internet belum didukung melalui service worker.
- Angka server merupakan ilustrasi pembelajaran. Kasus forensik sepenuhnya fiktif. Steganografi ini bukan alat enkripsi atau jaminan keamanan pesan.

## Referensi teknis

Konfigurasi mengikuti [panduan Vite](https://vite.dev/guide/) dan [instalasi Motion untuk React](https://motion.dev/docs/react-installation). Profil lab memakai informasi dari brief pengguna, dengan tautan lanjutan menuju [halaman NCC ITS](https://www.its.ac.id/informatika/en/net-centric-computing-laboratory/).
