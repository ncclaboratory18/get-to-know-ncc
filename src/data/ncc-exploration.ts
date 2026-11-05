// Sumber: Copy of PPT SAFARI LAB.pdf, halaman 3 dan 10.
// Bahasa diringkas untuk siswa SMA; contoh interaksi adalah ilustrasi edukasi.
export const learningFields = [
  {
    name: "Jaringan",
    label: "Menghubungkan perangkat.",
    description:
      "Pelajari cara komputer dan HP saling terhubung untuk bertukar data.",
    illustration:
      "Ketika kamu mengirim pesan, data berpindah melalui jalur yang menghubungkan perangkat.",
    glyph: "network",
  },
  {
    name: "Keamanan",
    label: "Menjaga data tetap aman.",
    description:
      "Pelajari cara melindungi data dari peretas dan ancaman digital.",
    illustration:
      "Perlindungan di sepanjang jalur membantu menjaga data saat perangkat saling berkomunikasi.",
    glyph: "security",
  },
  {
    name: "Cloud",
    label: "Menjalankan layanan di internet.",
    description:
      "Kenali server dan aplikasi di internet yang mendukung layanan digital.",
    illustration:
      "Aplikasi yang kamu akses di HP dapat dilayani oleh server melalui jaringan internet.",
    glyph: "cloud",
  },
  {
    name: "Forensik",
    label: "Mengikuti jejak digital.",
    description:
      "Pelajari cara melacak jejak kejahatan siber melalui bukti digital.",
    illustration:
      "Jejak aktivitas digital bisa dihubungkan untuk membantu menjelaskan sebuah kejadian.",
    glyph: "forensics",
  },
];

export const careerPaths = [
  {
    name: "DevOps Engineer",
    short: "DEVOPS",
    glyph: "pipeline",
    lead: "Membantu versi baru aplikasi sampai ke pengguna dengan proses yang teratur.",
    responsibilities: [
      "Mengelola infrastruktur internal.",
      "Mengotomatisasi proses rilis perangkat lunak.",
      "Memantau kondisi sistem.",
    ],
    stages: ["INFRASTRUKTUR", "RILIS OTOMATIS", "MONITORING"],
  },
  {
    name: "Site Reliability Engineer",
    short: "RELIABILITY",
    glyph: "reliability",
    lead: "Menjaga sistem tetap andal dan menangani gangguan ketersediaan layanan.",
    responsibilities: [
      "Mengotomatisasi infrastruktur skala besar.",
      "Memantau performa dan keandalan sistem.",
      "Menangani insiden yang mengganggu ketersediaan layanan.",
    ],
    stages: ["OTOMATISASI", "KEANDALAN", "RESPONS INSIDEN"],
  },
  {
    name: "Security Engineer",
    short: "SECURITY",
    glyph: "security",
    lead: "Merancang perlindungan sistem dan merespons ancaman keamanan.",
    responsibilities: [
      "Merancang dan menerapkan keamanan.",
      "Melakukan penetration testing, yaitu pengujian untuk menemukan celah keamanan.",
      "Memantau ancaman dan menangani insiden keamanan.",
    ],
    stages: ["PERLINDUNGAN", "PENGUJIAN CELAH", "RESPONS ANCAMAN"],
  },
  {
    name: "Network Administrator",
    short: "NETWORK",
    glyph: "network",
    lead: "Mengelola koneksi agar perangkat dan layanan dapat saling terhubung.",
    responsibilities: [
      "Mengelola infrastruktur jaringan.",
      "Memantau kondisi jaringan.",
      "Menelusuri dan mengatasi masalah jaringan.",
    ],
    stages: ["INFRASTRUKTUR", "MONITORING", "TROUBLESHOOTING"],
  },
  {
    name: "Cloud Engineer",
    short: "CLOUD",
    glyph: "cloud",
    lead: "Mengelola infrastruktur cloud dan membantu perpindahan sistem ke cloud.",
    responsibilities: [
      "Mengelola infrastruktur berbasis cloud.",
      "Memelihara layanan dan mengoptimalkan biaya.",
      "Melakukan migrasi sistem ke cloud.",
    ],
    stages: ["INFRASTRUKTUR", "OPTIMISASI BIAYA", "MIGRASI CLOUD"],
  },
];
