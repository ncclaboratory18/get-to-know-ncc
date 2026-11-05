# Hasil Verifikasi

Tanggal: 5 November 2026 (Asia/Jakarta). Implementasi lokal, belum dipublikasikan ke hosting.

## Pemeriksaan yang dijalankan

| Pemeriksaan | Hasil | Cakupan |
| --- | --- | --- |
| TypeScript dan build produksi | Lulus | `npm run build`; keluaran statis di `dist/`. |
| Logika inti | 13 pengujian lulus | `npm test`; UTF-8, kapasitas, alpha, validasi format, tiga gambar kasus dengan kode/petunjuk nyata, pencocokan kode, forensik, antrean, beban, biaya, menang/gagal. |
| Alur browser | 14 skenario lulus | Tujuh alur dijalankan pada konfigurasi mobile dan desktop menggunakan Microsoft Edge headless melalui Playwright. |
| Lebar layar | Lulus pemeriksaan overflow | Seluruh tujuh layar pada lebar 360, 430, 768, dan 1280 px; pengujian alur utama juga memakai 390 × 844 px dan 1280 × 900 px. |
| Reduced motion | Lulus pemeriksaan navigasi/layout | Seluruh layar dapat dibuka dengan preferensi gerak dikurangi. |
| Pemeriksaan visual | Ditinjau | Screenshot pembuka, forensik, dan kasus pesan rahasia pada HP, serta server pada HP dan desktop. |
| Kontras pasangan utama | Lulus target teks normal 4,5:1 | Teks utama/latar 14,62:1; teks sekunder/panel 6,26:1; teks utama/surface 7,58:1; teks gelap/tombol pink 5,95:1. Ini pemeriksaan pasangan warna, bukan audit aksesibilitas menyeluruh. |

Skenario piksel mencakup jawaban bit keliru, kode salah, perbaikan jawaban, eksperimen bonus, unduhan PNG, serta reset tanpa kehilangan lencana. Pengujian tambahan memastikan pergantian gambar membatalkan kode lama. Pengulangan pemeriksaan tidak dihitung sebagai skenario baru.

## Alur yang terbukti berjalan

1. Pembuka → peta → gambar kiriman → petunjuk piksel → jawaban bit salah lalu benar → decoding dari piksel → kode salah lalu benar → berkas terbuka dan lencana → eksperimen menyisipkan pesan UTF-8 → mulai ulang → lencana tetap ada → muat ulang → batal reset → konfirmasi reset.
2. Unduhan PNG dari Canvas dibuka kembali sebagai data RGBA di pengujian, kemudian didekode; pesan UTF-8 tetap identik.
3. Pemilihan bukti → susunan keliru → feedback → perbaikan urutan → kesimpulan keliru → feedback → kesimpulan benar → Digital Investigator.
4. Latihan server dengan antrean nyata → briefing → strategi 2/3/4/2 server → Cloud Architect. Strategi acuan berakhir dengan antrean nol dan sisa 6 kredit.
5. Penyimpanan ditolak browser → informasi sesi sementara → misi tetap selesai; Petunjuk dapat ditutup dengan Escape dan fokus kembali ke pemicunya.
6. Petunjuk tantangan dibuka → waktu dan biaya tidak berubah → petunjuk ditutup → tetap jeda → Lanjutkan → waktu bergerak kembali.
7. Baca kode gambar pertama → ganti gambar → pesan/input kode lama dibersihkan → kode lama ditolak pada gambar baru → kode baru berhasil membuka berkas.

## Perbaikan dari hasil pemeriksaan

- Misi steganografi diubah menjadi **Bongkar Pesan Rahasia** dengan tujuan menemukan kode untuk membuka berkas. Lencana diberikan setelah kode benar; pembuatan pesan sendiri tersedia sebagai bonus setelah berhasil.
- Petunjuk bit dan kode berasal dari piksel gambar yang sedang diperiksa. Kode diverifikasi melalui decoding ulang Canvas ketika berkas dibuka.

- Jam pengujian browser dipasang sebelum halaman membuat timer, mengikuti [panduan Clock Playwright](https://playwright.dev/docs/clock). Pemasangan setelah timer berjalan sempat membuat pengukuran tantangan tidak valid.
- Langkah waktu simulasi server dipisahkan dari frame rendering. Beban, antrean, dan biaya dihitung pada mesin simulasi; Canvas dan indikator membaca hasil yang sama.
- Renderer berhenti selama jeda dan tetap memperbarui informasi statis ketika reduced motion aktif.
- Feedback kesimpulan forensik diposisikan dekat tombol pemeriksaan kesimpulan.
- Fokus awal konfirmasi Pengunjung Baru diarahkan ke Batal. Tautan lewati konten disembunyikan saat tidak difokuskan.
- Font disimpan dalam build lokal. Logo tampilan diperkecil dari 1.919.116 byte menjadi 134.447 byte; file sumber `ncc.png` tetap utuh.
- Ringkasan waktu, anggaran, respons, dan antrean ditempatkan juga dekat kontrol server agar pengunjung HP tidak perlu bergulir ke area visual untuk memeriksanya.

## Batas verifikasi

- Pengujian HP memakai emulasi viewport dan sentuhan, belum perangkat fisik. Safari/iOS dan Firefox belum diuji.
- Navigasi keyboard pada dialog diperiksa otomatis; belum ada audit manual lengkap dengan pembaca layar.
- Perpindahan tab ditangani melalui `visibilitychange`, tetapi pengujian otomatis jeda di atas memakai panel petunjuk. Jeda pada perpindahan tab perlu dicoba di perangkat booth.
- Belum ada pengukuran performa jangka panjang pada HP kelas menengah atau uji throttling CPU.
- Gagal memuat modul, Canvas tidak tersedia, storage rusak, dan kegagalan menghapus storage ditangani dalam kode; tidak seluruh variasinya diuji lewat browser.
- Belum ada service worker untuk akses pertama tanpa internet; tautan profil resmi tetap membutuhkan internet.

Daftar penerimaan lebih luas tersedia pada [rencana verifikasi](verification-plan.md). Laporan ini hanya menyatakan pemeriksaan yang benar-benar dilakukan.
