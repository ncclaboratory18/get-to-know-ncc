# Hasil Verifikasi

Tanggal: 5 November 2026 (Asia/Jakarta). Implementasi lokal, belum dipublikasikan ke hosting.

## Pemeriksaan yang dijalankan

| Pemeriksaan | Hasil | Cakupan |
| --- | --- | --- |
| TypeScript dan build produksi | Lulus | `npm run build`; keluaran statis di `dist/`. |
| Logika inti | 15 pengujian lulus | `npm test`; UTF-8, kapasitas, alpha, validasi format, tiga gambar kasus, pencocokan kode, ekspor PNG lossless, forensik, serta simulasi server. |
| Alur browser Brave — baseline | 20 skenario lulus | Suite sebelum penambahan section Safari Lab dijalankan dengan Brave `156.1.98.63`, headless, pada konfigurasi mobile dan desktop melalui `BRAVE_EXECUTABLE`. |
| Section Safari Lab | 6 pemeriksaan browser lulus | Empat pemeriksaan baru untuk interaksi SVG/konten/keyboard/reduced motion dan dua pemeriksaan tata letak seluruh rute, melalui Brave pada konfigurasi mobile serta desktop. |
| Regresi Canvas di Edge | 6 skenario lulus | Noise privasi, pergantian tampilan/pengulangan semua gambar, dan bitmap Canvas yang dibersihkan, masing-masing pada mobile dan desktop. |
| Lebar layar | Lulus pemeriksaan overflow | Seluruh tujuh layar pada lebar 360, 430, 768, dan 1280 px; pengujian alur utama juga memakai 390 × 844 px dan 1280 × 900 px. |
| Reduced motion | Lulus pemeriksaan navigasi/layout | Seluruh layar dapat dibuka dengan preferensi gerak dikurangi. |
| Pemeriksaan visual | Ditinjau | Screenshot pembuka, forensik, dan kasus pesan rahasia pada HP, serta server pada HP dan desktop. |
| Kontras pasangan utama | Lulus target teks normal 4,5:1 | Teks utama/latar 14,62:1; teks sekunder/panel 6,26:1; teks utama/surface 7,58:1; teks gelap/tombol pink 5,95:1. Ini pemeriksaan pasangan warna, bukan audit aksesibilitas menyeluruh. |

Skenario piksel mencakup jawaban bit keliru, kode salah, perbaikan jawaban, eksperimen bonus, unduhan PNG, serta reset tanpa kehilangan lencana. Pengujian tambahan memastikan pergantian gambar membatalkan kode lama. Pengulangan pemeriksaan tidak dihitung sebagai skenario baru.

## Alur yang terbukti berjalan

1. Pembuka → peta → gambar kiriman → petunjuk piksel → jawaban bit salah lalu benar → decoding dari piksel → kode salah lalu benar → berkas terbuka dan lencana → eksperimen menyisipkan pesan UTF-8 → mulai ulang → lencana tetap ada → muat ulang → batal reset → konfirmasi reset.
2. Unduhan PNG dari buffer sumber dibuka kembali sebagai data RGBA di pengujian, kemudian didekode; pesan UTF-8 tetap identik.
3. Pemilihan bukti → susunan keliru → feedback → perbaikan urutan → kesimpulan keliru → feedback → kesimpulan benar → Digital Investigator.
4. Latihan server dengan antrean nyata → briefing → strategi 2/3/4/2 server → Cloud Architect. Strategi acuan berakhir dengan antrean nol dan sisa 6 kredit.
5. Penyimpanan ditolak browser → informasi sesi sementara → misi tetap selesai; Petunjuk dapat ditutup dengan Escape dan fokus kembali ke pemicunya.
6. Petunjuk tantangan dibuka → waktu dan biaya tidak berubah → petunjuk ditutup → tetap jeda → Lanjutkan → waktu bergerak kembali.
7. Baca kode gambar pertama → ganti gambar → pesan/input kode lama dibersihkan → kode lama ditolak pada gambar baru → kode baru berhasil membuka berkas.
8. Simulasikan noise pada `getImageData` dan `toBlob` → baca pesan kasus → buka berkas → buat pesan UTF-8 di eksperimen bonus → ungkap → unduh PNG → buka kembali PNG → pesan tetap identik.
9. Perbandingan asli/kiriman dan pengulangan dua kali pada setiap gambar tetap dapat diselesaikan, termasuk saat Canvas kiriman tersembunyi. Pembacaan tetap berhasil setelah bitmap tampilan dibersihkan.

## Perbaikan dari hasil pemeriksaan

- Misi steganografi diubah menjadi **Bongkar Pesan Rahasia** dengan tujuan menemukan kode untuk membuka berkas. Lencana diberikan setelah kode benar; pembuatan pesan sendiri tersedia sebagai bonus setelah berhasil.
- Petunjuk bit dan kode berasal dari buffer RGBA gambar yang sedang diperiksa. Kode diverifikasi melalui decoding ulang buffer tersebut ketika berkas dibuka.

- Laporan error **“Penanda pesan NCC tidak ditemukan.”** pada Brave ditelusuri ke ketergantungan pada readback Canvas. Efek perubahan bit berhasil direproduksi melalui injeksi noise pada API sebelum perbaikan. [Brave mendokumentasikan randomisasi Canvas readback](https://support.brave.app/hc/en-us/articles/10742158329613-What-does-Brave-remove-from-the-Chromium-engine); ini relevan karena LSB memakai bit yang sangat sensitif terhadap perubahan tersebut.
- Decoder misi dan eksperimen kini membaca buffer piksel sumber yang sama dengan renderer, tanpa mengambil pesan dari state input atau bergantung pada `getImageData`. Validasi header, panjang, dan UTF-8 tetap berlaku.
- PNG diekspor langsung dari RGBA dengan encoder lossless tanpa `Canvas.toBlob`, sehingga noise ekspor Canvas tidak mengubah bit pesan. Pemeriksaan Sharp memastikan semua byte RGBA dan teks UTF-8 identik setelah file dibuka kembali.
- Pengujian normal maupun regresi berhasil setelah perbaikan; pengunjung tidak diminta menonaktifkan perlindungan privasi browser.

- Jam pengujian browser dipasang sebelum halaman membuat timer, mengikuti [panduan Clock Playwright](https://playwright.dev/docs/clock). Pemasangan setelah timer berjalan sempat membuat pengukuran tantangan tidak valid.
- Langkah waktu simulasi server dipisahkan dari frame rendering. Beban, antrean, dan biaya dihitung pada mesin simulasi; Canvas dan indikator membaca hasil yang sama.
- Renderer berhenti selama jeda dan tetap memperbarui informasi statis ketika reduced motion aktif.
- Feedback kesimpulan forensik diposisikan dekat tombol pemeriksaan kesimpulan.
- Fokus awal konfirmasi Pengunjung Baru diarahkan ke Batal. Tautan lewati konten disembunyikan saat tidak difokuskan.
- Font disimpan dalam build lokal. Logo tampilan diperkecil dari 1.919.116 byte menjadi 134.447 byte; file sumber `ncc.png` tetap utuh.
- Ringkasan waktu, anggaran, respons, dan antrean ditempatkan juga dekat kontrol server agar pengunjung HP tidak perlu bergulir ke area visual untuk memeriksanya.

## Batas verifikasi

- Pengujian HP memakai emulasi viewport dan sentuhan, belum perangkat fisik. Safari/iOS dan Firefox belum diuji.
- Brave diuji dengan profil sementara Playwright, bukan profil pengguna yang memuat ekstensi dan pengaturan pribadinya. Variasi proteksi Canvas diperiksa melalui injeksi noise terkontrol pada API; ini tidak menyatakan semua konfigurasi Shields/ekstensi sudah diuji.
- Navigasi keyboard pada dialog diperiksa otomatis; belum ada audit manual lengkap dengan pembaca layar.
- Perpindahan tab ditangani melalui `visibilitychange`, tetapi pengujian otomatis jeda di atas memakai panel petunjuk. Jeda pada perpindahan tab perlu dicoba di perangkat booth.
- Belum ada pengukuran performa jangka panjang pada HP kelas menengah atau uji throttling CPU.
- Gagal memuat modul, Canvas tidak tersedia, storage rusak, dan kegagalan menghapus storage ditangani dalam kode; tidak seluruh variasinya diuji lewat browser.
- Belum ada service worker untuk akses pertama tanpa internet; tautan profil resmi tetap membutuhkan internet.

Daftar penerimaan lebih luas tersedia pada [rencana verifikasi](verification-plan.md). Laporan ini hanya menyatakan pemeriksaan yang benar-benar dilakukan.

## Pembaruan section Safari Lab

- Konten empat bidang belajar dan lima profesi dipetakan ke halaman 3 dan 10 PDF pengguna; rincian ada pada [sumber konten NCC](ncc-content-sources.md).
- Build TypeScript dan produksi berhasil setelah penambahan komponen.
- Ilustrasi peta belajar dan konsol karier diperiksa melalui klik/tap serta Enter/Space. Pilihan mengubah gambar aktif, penjelasan bidang, dan rincian tugas profesi.
- Pengujian memastikan seluruh layar tidak memiliki horizontal overflow pada 360, 430, 768, dan 1280 px, serta target interaktif konsol minimal 44 × 44 px.
- Reduced motion menghentikan paket animasi dan mempertahankan interaksi serta konten.
- Screenshot section baru ditinjau pada mobile 390 px dan desktop 1280 px.
- Enam pemeriksaan terarah untuk pembaruan ini lulus. Suite yang kini berjumlah 24 skenario tidak seluruhnya diulang karena logika permainan tidak berubah.
