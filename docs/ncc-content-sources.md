# Sumber konten bidang belajar dan prospek karier

Sumber: [Copy of PPT SAFARI LAB.pdf](<../Copy of PPT SAFARI LAB.pdf>) yang diberikan pengguna. Materi mencantumkan tahun 2026. Teks diekstrak dengan pypdf; posisi teks pada slide karier diperiksa untuk memastikan tanggung jawab tidak tertukar antarprofesi.

## Halaman 3 — Belajar apa di NCC?

| Bidang | Informasi dari slide | Penyajian website |
| --- | --- | --- |
| Jaringan | Cara komputer dan HP saling terhubung. | Ringkasan koneksi dan pertukaran data. |
| Keamanan | Melindungi data dari peretas. | Ringkasan perlindungan data dari ancaman digital. |
| Cloud | Server dan aplikasi di internet. | Ringkasan layanan digital yang diakses melalui internet. |
| Forensik | Melacak jejak kejahatan siber. | Ringkasan penelusuran jejak dan bukti digital. |

Peta SVG memiliki empat simpul yang bisa dipilih dengan sentuhan, pointer, Enter, atau Space. Simpul aktif mengubah penjelasan, contoh ilustratif, dan jalur paket. Tombol HTML menyediakan pilihan yang sama. Contoh penjelasan dan gambar adalah ilustrasi edukasi yang ditulis untuk membantu siswa memahami ringkasan slide.

## Halaman 10 — NCC Career Prospect

| Profesi | Tanggung jawab pada slide, diringkas |
| --- | --- |
| DevOps Engineer | Mengelola infrastruktur internal, mengotomatisasi rilis perangkat lunak, dan memantau sistem. |
| Site Reliability Engineer | Mengotomatisasi infrastruktur skala besar, memantau performa/reliabilitas, dan menangani insiden ketersediaan. |
| Security Engineer | Merancang/menerapkan keamanan, penetration testing, memantau ancaman, dan merespons insiden keamanan. |
| Network Administrator | Mengelola dan memantau jaringan serta melakukan troubleshooting. |
| Cloud Engineer | Mengelola infrastruktur cloud, pemeliharaan/optimisasi biaya, dan migrasi ke cloud. |

Nama profesi dipertahankan. Deskripsi ditulis ulang dalam bahasa Indonesia yang mudah dipahami. Istilah penetration testing diberi penjelasan singkat. Konsol SVG dan daftar profesi memilih profesi aktif yang sama, sehingga ilustrasi, tahapan tugas, dan rincian tanggung jawab tetap konsisten.

Tidak menambahkan jabatan baru, angka gaji, statistik lowongan, atau jaminan pekerjaan. Informasi dosen dan fasilitas pada slide lain tidak dimasukkan karena di luar cakupan permintaan ini.

## Penempatan dan perilaku

- Section muncul setelah pengantar beranda dan setelah profil pada halaman Tentang NCC.
- Komponen: `src/components/NccExploration.tsx`; konten: `src/data/ncc-exploration.ts`.
- Ilustrasi dibuat sebagai SVG custom menggunakan palet website, bukan screenshot slide atau foto stok.
- Area interaktif SVG memiliki label, status pilihan, dan dukungan keyboard. Target sentuh diperiksa pada lebar HP.
- Animasi paket hanya ditampilkan ketika section terlihat dan preferensi reduced motion tidak aktif.
- Konten inti tetap dapat dipahami tanpa animasi.
