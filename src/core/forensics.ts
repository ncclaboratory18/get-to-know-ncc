export const evidence = [
  {
    id: "E1",
    type: "Riwayat login",
    time: "09.00",
    title: "Sesi dimulai",
    text: "Akun tim-proyek login melalui sesi S-17.",
    detail:
      "Catatan login menunjukkan akun yang dipakai, bukan identitas orang di depan komputer.",
  },
  {
    id: "E2",
    type: "Informasi perangkat",
    time: "09.01",
    title: "Komputer bersama",
    text: "Sesi S-17 tercatat pada Lab-03, komputer bersama di ruang sekolah.",
    detail:
      "Perangkat ini dapat digunakan banyak orang. Jenis perangkat tidak membuktikan siapa penggunanya.",
  },
  {
    id: "E3",
    type: "Perubahan berkas",
    time: "09.04",
    title: "Versi baru tersimpan",
    text: "presentasi-proyek.pptx berubah melalui sesi S-17.",
    detail:
      "Nama berkas, waktu, dan ID sesi menghubungkan perubahan dengan sesi yang diperiksa.",
  },
  {
    id: "E4",
    type: "Aktivitas akun",
    time: "09.06",
    title: "Sesi berakhir",
    text: "Sesi S-17 logout dari akun tim-proyek.",
    detail: "Logout memberi batas akhir rangkaian aktivitas sesi ini.",
  },
  {
    id: "E5",
    type: "Aktivitas lain",
    time: "08.50",
    title: "Sinkronisasi otomatis",
    text: "Layanan SYNC-2 menyinkronkan jadwal-kelas.pdf.",
    detail:
      "Periksa apakah nama berkas dan ID layanannya sama dengan kasus yang diselidiki.",
  },
];
export const conclusions = [
  "Berkas berubah melalui sesi S-17 di komputer bersama. Pengguna sebenarnya masih perlu diperiksa.",
  "Pemilik akun pasti pelakunya karena nama akun muncul pada riwayat.",
  "Sinkronisasi otomatis pukul 08.50 pasti mengubah berkas proyek.",
];
export function checkTimeline(ids: string[]): string | null {
  if (ids.includes("E5"))
    return "E5 membahas jadwal-kelas.pdf dan SYNC-2, bukan berkas proyek atau sesi S-17. Coba keluarkan dari linimasa.";
  if (ids.length !== 4 || new Set(ids).size !== 4)
    return "Hubungkan empat catatan sesi S-17: login, perangkat, perubahan berkas, dan logout.";
  if (ids.join(",") !== "E1,E2,E3,E4")
    return "Periksa waktunya: login terjadi sebelum perubahan berkas, dan logout sesudahnya.";
  return null;
}
