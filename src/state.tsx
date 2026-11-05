import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
export const missions = [
  {
    id: "piksel",
    name: "Bongkar Pesan Rahasia",
    badge: "Pixel Detective",
    category: "STEGANOGRAFI",
    description: "Temukan kode di dalam gambar untuk membuka berkas NCC.",
    concept:
      "Steganografi menyembunyikan keberadaan pesan di dalam media lain. Enkripsi menyamarkan isinya. Menyembunyikan pesan tidak otomatis mengenkripsinya.",
    ncc: "Steganografi berkaitan dengan keamanan informasi dan multimedia berbasis jaringan.",
  },
  {
    id: "jejak",
    name: "Detektif Jejak Digital",
    badge: "Digital Investigator",
    category: "FORENSIK DIGITAL",
    description: "Buka buktinya. Hubungkan jejaknya. Temukan ceritanya.",
    concept:
      "Bukti digital perlu dihubungkan berdasarkan waktu dan konteks. Nama akun atau perangkat belum membuktikan identitas orang yang menggunakannya.",
    ncc: "Forensik digital dan keamanan jaringan menelusuri bukti serta mendeteksi aktivitas yang perlu diperiksa.",
  },
  {
    id: "server",
    name: "Selamatkan Server!",
    badge: "Cloud Architect",
    category: "CLOUD & SISTEM TERDISTRIBUSI",
    description: "Pemain berdatangan. Bisakah servermu bertahan?",
    concept:
      "Pembagian beban membantu memanfaatkan kapasitas beberapa server. Menambah server meningkatkan kapasitas sekaligus biaya layanan.",
    ncc: "Cloud dan sistem terdistribusi mengatur layanan pada beberapa mesin yang saling terhubung.",
  },
];
const KEY = "ncc-digital-detective:v1";
interface Progress {
  version: 1;
  tried: string[];
  badges: string[];
}
const empty = (): Progress => ({ version: 1, tried: [], badges: [] });
function read(): { progress: Progress; temporary: boolean } {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { progress: empty(), temporary: false };
    const p = JSON.parse(raw);
    if (p.version !== 1 || !Array.isArray(p.tried) || !Array.isArray(p.badges))
      return { progress: empty(), temporary: false };
    const ids = missions.map((m) => m.id);
    return {
      progress: {
        version: 1,
        tried: [
          ...new Set<string>(
            p.tried.filter(
              (id: unknown) => typeof id === "string" && ids.includes(id),
            ),
          ),
        ],
        badges: [
          ...new Set<string>(
            p.badges.filter(
              (id: unknown) => typeof id === "string" && ids.includes(id),
            ),
          ),
        ],
      },
      temporary: false,
    };
  } catch {
    return { progress: empty(), temporary: true };
  }
}
interface AppState {
  progress: Progress;
  temporary: boolean;
  notice: string;
  visit: (id: string) => void;
  earn: (id: string) => void;
  reset: () => void;
}
const Context = createContext<AppState>(null!);
export function AppProvider({ children }: { children: ReactNode }) {
  const [initial] = useState(read);
  const [progress, setProgress] = useState(initial.progress);
  const [temporary, setTemporary] = useState(initial.temporary);
  const [notice, setNotice] = useState("");
  function update(kind: "tried" | "badges", id: string) {
    setProgress((p) => {
      if (p[kind].includes(id)) return p;
      const next = { ...p, [kind]: [...p[kind], id] };
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        setTemporary(true);
      }
      return next;
    });
  }
  function reset() {
    try {
      localStorage.removeItem(KEY);
      setNotice("Progres di perangkat ini sudah dihapus.");
    } catch {
      setNotice(
        "Sesi direset. Progres lama mungkin muncul lagi setelah muat ulang.",
      );
      setTemporary(true);
    }
    setProgress(empty());
    location.hash = "/";
  }
  return (
    <Context.Provider
      value={{
        progress,
        temporary,
        notice,
        visit: (id) => update("tried", id),
        earn: (id) => update("badges", id),
        reset,
      }}
    >
      {children}
    </Context.Provider>
  );
}
export const useApp = () => useContext(Context);
