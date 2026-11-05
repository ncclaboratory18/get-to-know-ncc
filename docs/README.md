# Dokumentasi NCC Digital Detective

Dokumen ini menerjemahkan brief menjadi alur pengalaman yang dapat ditinjau sebelum website diimplementasikan.

| Dokumen | Isi |
| --- | --- |
| [Alur website](website-flow.md) | Peta navigasi, isi layar, langkah permainan, kondisi hasil, progres, dan perilaku mobile. |
| [Rencana verifikasi](verification-plan.md) | Skenario penerimaan untuk memeriksa alur dan logika saat implementasi tersedia. |
| [Hasil verifikasi](verification-results.md) | Pemeriksaan yang sudah dijalankan dan batas cakupannya. |

## Status dan batas tahap

- Tahap saat ini: implementasi lokal tersedia, dengan tiga misi, progres, lencana, dan pengujian alur utama. Lihat [petunjuk menjalankan](../README.md).
- Sumber kebutuhan: brief pengguna untuk **NCC Digital Detective**.
- Aset identitas: logo NCC dari [`ncc.png`](../ncc.png) yang diberikan pengguna digunakan sebagai emblem dengan bentuk dan warna aslinya.
- Detail kasus fiktif, parameter simulasi, dan struktur navigasi di dokumen ini adalah usulan desain yang dibuat agar brief siap diimplementasikan.
- Implementasi menggunakan React, TypeScript, Vite, Motion, Canvas 2D, dan SVG custom; seluruh permainan berjalan di browser.
- Tidak diperlukan akun, backend, API berbayar, layanan AI eksternal, atau data pribadi pengunjung.
- Proyek berjalan lokal; belum ada pendaftaran Site atau deployment.

## Urutan implementasi yang disarankan

1. Kerangka navigasi, token palet, aksesibilitas dasar, dan penyimpanan progres dengan fallback.
2. Logika murni steganografi, dataset kasus forensik, dan mesin simulasi server beserta pemeriksaan bermakna.
3. Antarmuka serta visual tiap misi yang membaca state logika tersebut.
4. Peta laboratorium, hasil, koleksi lencana, profil NCC, dan reset pengunjung.
5. Verifikasi alur utama pada HP dan desktop, kemudian petunjuk instalasi serta menjalankan aplikasi.
