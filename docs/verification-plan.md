# Rencana Verifikasi Alur

Status: **alur utama sudah diperiksa; cakupan lengkap ada di [hasil verifikasi](verification-results.md)**. Dokumen ini tetap menjadi daftar kriteria penerimaan berdasarkan [alur website](website-flow.md), bukan klaim bahwa setiap skenario sudah diuji pada semua perangkat.

## 1. Navigasi dan pengalaman pameran

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| N1 | Buka aplikasi dengan progres kosong, pilih Mulai Eksplorasi. | Peta menampilkan tiga misi yang semuanya dapat dibuka. |
| N2 | Buka tiap URL misi langsung, lalu gunakan Back browser. | Tidak wajib melewati pembuka; riwayat navigasi bekerja tanpa layar rusak. |
| N3 | Buka hash tidak dikenal. | Ada pesan dan tombol menuju peta. |
| N4 | Selesaikan hanya satu misi, buka lencana dan profil. | Pengunjung dapat mencapai penutup dengan progres 1/3. |
| N5 | Keluar saat misi berlangsung, lalu masuk lagi. | Loop lama berhenti, percobaan baru dimulai, lencana lama tetap ada. |
| N6 | Gunakan Petunjuk dan Mulai Ulang pada setiap misi. | Bantuan kontekstual tersedia; reset terbatas pada percobaan aktif. |

## 2. Steganografi

Logika encoding/decoding perlu pemeriksaan otomatis karena kegagalan dapat tersembunyi di balik visual yang terlihat benar.

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| P1 | Encode lalu decode pesan ASCII dan UTF-8 seperti `Halo, éksplorasi NCC!`. | Byte dan string hasil sama persis dengan input valid. |
| P2 | Uji encoder pada kapasitas payload tepat dan satu byte berlebih; uji batas UI 160 byte secara terpisah. | Batas tepat diterima, kelebihan ditolak tanpa merusak hasil sebelumnya. |
| P3 | Periksa buffer asli dan hasil. | Alpha identik, RGB berubah maksimal satu per kanal, buffer asli tidak termutasi. |
| P4 | Decode salinan buffer hasil secara terpisah tanpa akses ke state input. | Pesan tetap terbaca dari piksel. |
| P5 | Uji header salah, panjang melebihi kapasitas, dan payload UTF-8 tidak valid. | Decoder memberi kesalahan terkontrol. Tidak mengklaim semua kerusakan pasti terdeteksi. |
| P6 | Sisipkan pesan, lalu edit input atau ganti gambar. | Hasil lama dibatalkan dan perlu penyisipan ulang sebelum decoding. |
| P7 | Pilih piksel melalui sentuhan dan tombol arah; gunakan Lihat Piksel yang Berubah. | Grid dan RGB sesuai buffer pada koordinat yang dipilih, termasuk tepi gambar. |
| P8 | Gunakan Asli/Berisi Pesan pada HP. | Kedua tampilan dapat dibandingkan tanpa slider kecil. |
| P9 | Encode dan decode valid, lalu main ulang. | Pixel Detective diberikan sekali dan tetap ada setelah reset percobaan. |
| P10 | Jika unduhan PNG diimplementasikan, baca ulang PNG yang diunduh melalui Canvas. | Payload tetap dapat didecode. |

## 3. Kasus forensik

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| F1 | Baca E1–E5. | Waktu, sesi S-17, perangkat, dan nama berkas konsisten dengan rancangan. Label seluruh data fiktif terlihat. |
| F2 | Tandai dan batalkan tanda relevan. | Bukti masuk/keluar linimasa, tanpa pengurutan otomatis atau duplikat. |
| F3 | Pilih E5, hilangkan E3, atau tukar dua bukti relevan. | Feedback menjelaskan masalah spesifik; susunan dapat diperbaiki. |
| F4 | Susun E1 → E2 → E3 → E4, tanpa E5. | Tahap kesimpulan dapat dibuka. |
| F5 | Gunakan tombol Naik/Turun dengan keyboard dan HP. | Seluruh susunan dapat diselesaikan tanpa drag-and-drop. |
| F6 | Pilih masing-masing kesimpulan. | Hanya kesimpulan aktivitas sesi dengan identitas belum terbukti yang diterima; setiap jawaban punya alasan. |
| F7 | Ubah bukti setelah pemeriksaan berhasil. | Hasil pemeriksaan lama dibatalkan, tanpa menghapus lencana yang sudah diperoleh. |
| F8 | Selesaikan kasus dan ulangi. | Digital Investigator diberikan sekali; percobaan dapat dimulai ulang. |

## 4. Simulasi server

Mesin simulasi diperiksa terpisah dari renderer, menggunakan langkah waktu tetap dan input yang terjadwal.

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| S1 | Mode latihan: satu server, 10 pengguna. | Antrean tidak bertambah; kapasitas cukup. |
| S2 | Satu server, 30 pengguna, mulai dari antrean nol, jalankan satu detik. | Antrean bertambah 10 permintaan dalam toleransi floating point. |
| S3 | Dua server merata dibandingkan menumpuk, 30 pengguna selama satu detik. | Merata tidak mengantre; menumpuk menghasilkan antrean 10 pada server pertama. |
| S4 | Ubah jumlah server dan distribusi. | Kapasitas, biaya relatif, tujuan paket, serta indikator mengikuti logika yang sama. |
| S5 | Hapus server yang memiliki antrean. | Antreannya dipindahkan; jumlah permintaan tidak menghilang. Tidak dapat menghapus server terakhir. |
| S6 | Masuk tantangan setelah mengubah kondisi latihan. | Kondisi awal tepat: 2 server merata, antrean 0, saldo 90, waktu 0. |
| S7 | Jalankan strategi acuan: 2, 3, 4, 2 server pada t=0, 8, 16, 24 detik. | Biaya 84 kredit, antrean nol pada model ideal, seluruh syarat berhasil terpenuhi. |
| S8 | Gunakan empat server selama tantangan tanpa perubahan. | Saldo habis pada 22,5 detik; hasil coba lagi, tanpa saldo negatif. |
| S9 | Tetap gunakan dua server sepanjang 30 detik. | Antrean/response gagal memenuhi target walaupun saldo masih ada. |
| S10 | Uji nilai batas target: respons 1 detik, durasi 24 detik, antrean 20, saldo nol tepat pada akhir. | Perbandingan inklusif mengikuti rancangan; gunakan toleransi numerik hanya untuk galat komputasi. |
| S11 | Sembunyikan tab atau buka petunjuk saat tantangan. | Timer, antrean, dan biaya berhenti; tidak ada loncatan saat kembali. Lanjut hanya setelah tindakan Lanjutkan dan semua alasan jeda selesai. |
| S12 | Uji input terjadwal sama pada laju render berbeda. | Hasil simulasi sama; jumlah partikel atau frame tidak memengaruhi perhitungan. |
| S13 | Ulangi tantangan setelah menang dan gagal. | Semua state percobaan kembali ke awal; Cloud Architect lama tetap tersimpan. |

## 5. Penyimpanan dan reset

| ID | Skenario | Hasil yang diharapkan |
| --- | --- | --- |
| L1 | Dapatkan lencana, muat ulang aplikasi. | Progres dan lencana pulih; isi pesan serta state percobaan tidak disimpan. |
| L2 | localStorage melempar error saat baca/tulis atau berisi JSON rusak. | Aplikasi tetap dapat dimainkan; fallback sesi dan keterangan sesuai keadaan. |
| L3 | Dapatkan lencana yang sama dua kali. | Tidak ada duplikasi dan jumlah koleksi maksimal 3. |
| L4 | Pilih Pengunjung Baru lalu Batal atau Escape. | Progres tidak berubah; fokus kembali ke pemicu. |
| L5 | Konfirmasi Pengunjung Baru. | Hanya key aplikasi dihapus; memori dibersihkan dan pembuka tampil. Data aplikasi lain tidak tersentuh. |
| L6 | Simulasikan kegagalan penghapusan storage. | Sesi bersih, dengan info bahwa progres lama mungkin kembali setelah muat ulang. |

## 6. Visual, aksesibilitas, dan performa

- Periksa viewport 360, 390, 430, dan 1280 px: tidak ada horizontal scroll atau kontrol terpotong; target sentuh minimal 44 × 44 px.
- Jalankan semua alur dengan keyboard saja: fokus terlihat, urutan masuk akal, dialog mengelola fokus, dan kontrol Canvas punya alternatif DOM.
- Periksa teks utama, sekunder, tombol, dan fokus terhadap latar aktual; target kontras teks normal minimal 4,5:1.
- Periksa palet antarmuka, SVG, dan Canvas; pengecualian numerik piksel LSB hanya mengikuti algoritma. Warna bawaan aset logo NCC dipertahankan tanpa dijadikan aksen antarmuka baru.
- Pastikan emblem memakai aset `ncc.png` yang diberikan pengguna, proporsi utuh, tanpa pewarnaan ulang, terbaca pada latarnya, serta memiliki alt text sesuai konteks.
- Aktifkan reduced motion: animasi berkurang, informasi distribusi dan status tetap dapat dipahami.
- Pastikan status berhasil/gagal memiliki label dan ikon, bukan warna saja; feedback penting dapat dibaca pembaca layar tanpa spam per frame.
- Pindah rute berulang kali: tidak ada timer ganda, loop yatim, listener menumpuk, atau animasi yang berjalan pada misi tertutup.
- Periksa loading modul dan kegagalan pemuatannya; kontrol coba lagi dan kembali berfungsi.
- Pastikan tautan resmi mengarah ke URL yang diberikan dan seluruh tombol utama menjalankan tindakan nyata.
- Saat implementasi selesai, catat pemeriksaan yang benar-benar dijalankan, hasilnya, serta keterbatasan perangkat/browser yang belum diuji.
