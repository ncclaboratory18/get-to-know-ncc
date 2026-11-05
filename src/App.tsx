import { Component, lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import logo from "./assets/ncc-display.png";
import { AppProvider, missions, useApp } from "./state";
import { Badge, Icon, MissionArt } from "./components/Visuals";
import { Modal } from "./components/UI";

const Pixel = lazy(() => import("./missions/Pixel"));
const Forensics = lazy(() => import("./missions/Forensics"));
const Server = lazy(() => import("./missions/Server"));
const official =
  "https://www.its.ac.id/informatika/en/net-centric-computing-laboratory/";

class LoadBoundary extends Component<
  { children: ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <main className="container fallback">
        <h1>Halaman belum dapat dimuat</h1>
        <p>Coba muat ulang untuk mengambil modul permainan.</p>
        <button className="button primary" onClick={() => location.reload()}>
          Coba Lagi
        </button>
        <a
          className="button secondary"
          href="#/misi"
          onClick={() => this.setState({ failed: false })}
        >
          Peta Misi
        </a>
      </main>
    ) : (
      this.props.children
    );
  }
}
function Logo() {
  return (
    <a href="#/" className="brand" aria-label="NCC Digital Detective — beranda">
      <span className="logo-field">
        <img src={logo} alt="" width="64" height="47" />
      </span>
      <span className="brand-text">
        NCC<span>DIGITAL DETECTIVE</span>
      </span>
    </a>
  );
}

function Home() {
  const { progress } = useApp();
  return (
    <main>
      <section className="hero container">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="live-dot" /> TRANSMISI DARI NCC ITS
          </p>
          <h1 tabIndex={-1}>
            Bongkar Rahasia
            <br />
            Dunia <span>Digital!</span>
            <span className="title-dot">_</span>
          </h1>
          <p className="hero-description">
            Temukan pesan tersembunyi, telusuri jejak digital, dan jaga server
            tetap hidup bersama NCC ITS.
          </p>
          <a href="#/misi" className="button primary large">
            Mulai Eksplorasi <Icon name="arrow" />
          </a>
          <p className="hero-meta">
            <Icon name="shield" size={16} /> Tanpa akun <span>·</span> 3 misi{" "}
            <span>·</span> Bebas pilih urutan
          </p>
          {progress.badges.length > 0 && (
            <a className="text-link" href="#/lencana">
              {progress.badges.length}/3 lencana sudah kamu temukan{" "}
              <Icon name="arrow" size={16} />
            </a>
          )}
        </div>
        <div
          className="hero-lab"
          onPointerMove={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            e.currentTarget.style.setProperty(
              "--px",
              `${(e.clientX - r.left - r.width / 2) / 40}px`,
            );
            e.currentTarget.style.setProperty(
              "--py",
              `${(e.clientY - r.top - r.height / 2) / 40}px`,
            );
          }}
          onPointerLeave={(e) => {
            e.currentTarget.style.setProperty("--px", "0px");
            e.currentTarget.style.setProperty("--py", "0px");
          }}
        >
          <div className="lab-orbit orbit-one" />
          <div className="lab-orbit orbit-two" />
          <span className="lab-coordinate mono">NCC / EXPLORATION LAB</span>
          <svg
            viewBox="0 0 600 480"
            className="lab-connections"
            aria-hidden="true"
          >
            <path
              d="M180 150 390 145 320 330 180 150"
              fill="none"
              stroke="#4876B8"
              strokeWidth="1.5"
              strokeDasharray="5 7"
            />
            <path
              d="M180 150 300 230 390 145M300 230l20 100"
              fill="none"
              stroke="#A99CD5"
              opacity=".3"
            />
          </svg>
          <a
            href="#/misi/piksel"
            className="floating-station floating-pixel"
            aria-label="Buka misi Pesan di Balik Piksel"
          >
            <MissionArt kind={0} />
            <span className="station-label mono">
              <b>01</b> PESAN TERSEMBUNYI
            </span>
          </a>
          <a
            href="#/misi/jejak"
            className="floating-station floating-evidence"
            aria-label="Buka misi Detektif Jejak Digital"
          >
            <MissionArt kind={1} />
            <span className="station-label mono">
              <b>02</b> JEJAK DIGITAL
            </span>
          </a>
          <a
            href="#/misi/server"
            className="floating-station floating-server"
            aria-label="Buka misi Selamatkan Server"
          >
            <MissionArt kind={2} />
            <span className="station-label mono">
              <b>03</b> MISI PENYELAMATAN
            </span>
          </a>
          <div className="lab-center">
            <Icon name="spark" size={25} />
          </div>
          <span className="lab-status mono">
            <span className="live-dot" /> SEMUA SISTEM SIAP
          </span>
        </div>
      </section>
      <div className="institution-strip">
        <div className="container">
          <span>LABORATORIUM NET-CENTRIC COMPUTING</span>
          <span>
            Departemen Teknik Informatika <b>ITS</b>
          </span>
          <span className="mono">AMAN. TERHUBUNG. TANPA BATAS.</span>
        </div>
      </div>
      <section className="intro-section container">
        <div>
          <p className="eyebrow">BUKAN SEKADAR TEORI</p>
          <h2>
            Dunia digital punya cerita.
            <br />
            <span>Kamu yang mengungkapnya.</span>
          </h2>
        </div>
        <div>
          <p>
            Bagaimana pesan bisa bersembunyi dalam gambar? Apa yang tertinggal
            setelah sebuah klik? Kenapa gim bisa lemot saat ramai?
          </p>
          <p>
            Masuk ke laboratorium digital NCC. Coba sendiri, lihat yang terjadi,
            dan temukan jawabannya.
          </p>
          <a href="#/tentang" className="text-link">
            Kenalan dengan NCC <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>
    </main>
  );
}

function MapPage() {
  const { progress } = useApp();
  return (
    <main className="container map-page">
      <div className="page-intro">
        <div>
          <p className="eyebrow">LABORATORIUM DIGITAL / PILIH MISIMU</p>
          <h1 tabIndex={-1}>
            Rasa penasaranmu,
            <br />
            <span>titik awal penemuan.</span>
          </h1>
          <p>
            Tiga stasiun, tiga cara melihat dunia digital. Mulai dari yang
            paling bikin penasaran.
          </p>
        </div>
        <div className="progress-stamp">
          <b>
            {String(progress.badges.length).padStart(2, "0")}
            <span>/03</span>
          </b>
          <span className="mono">LENCANA TERKUMPUL</span>
        </div>
      </div>
      <div className="mission-map">
        {missions.map((m, i) => {
          const done = progress.badges.includes(m.id),
            tried = progress.tried.includes(m.id);
          return (
            <a href={`#/misi/${m.id}`} className="mission-station" key={m.id}>
              <div className="station-top">
                <span className="mono">STASIUN / 0{i + 1}</span>
                <span className={`status-pill ${done ? "earned" : ""}`}>
                  {done ? (
                    <>
                      <Icon name="check" size={14} /> Selesai
                    </>
                  ) : tried ? (
                    "Sedang dicoba"
                  ) : (
                    "Belum dimainkan"
                  )}
                </span>
              </div>
              <MissionArt kind={i} />
              <p className="eyebrow">{m.category}</p>
              <h2>{m.name}</h2>
              <p>{m.description}</p>
              <div className="station-bottom">
                <span className="mono">± 1–2 MENIT</span>
                <span className="station-go">
                  <Icon name="arrow" />
                </span>
              </div>
            </a>
          );
        })}
      </div>
      <div className="map-note">
        <Icon name="info" />
        <p>
          Semua misi terbuka. Selesaikan satu saja juga boleh — penemuan kecil
          tetap berarti.
        </p>
        <a href="#/lencana" className="text-link">
          Koleksi Lencana <Icon name="arrow" size={16} />
        </a>
      </div>
    </main>
  );
}

function Collection() {
  const { progress } = useApp();
  return (
    <main className="container collection-page">
      <div className="page-intro centered">
        <p className="eyebrow">BUKTI RASA PENASARANMU</p>
        <h1 tabIndex={-1}>
          Koleksi <span>penemuan.</span>
        </h1>
        <p>
          {progress.badges.length}/3 lencana diperoleh. Setiap lencana menyimpan
          satu cerita yang sudah kamu ungkap.
        </p>
      </div>
      <div className="badge-collection">
        {missions.map((m, i) => {
          const earned = progress.badges.includes(m.id);
          return (
            <article
              className={`badge-card ${earned ? "earned" : ""}`}
              key={m.id}
            >
              <Badge kind={i} earned={earned} />
              <span className="status-pill">
                {earned ? (
                  <>
                    <Icon name="check" size={14} /> Diperoleh
                  </>
                ) : (
                  "Belum diperoleh"
                )}
              </span>
              <h2>{m.badge}</h2>
              <p>{m.name}</p>
              <a href={`#/misi/${m.id}`} className="text-link">
                {earned ? "Main Lagi" : "Coba Misinya"}{" "}
                <Icon name="arrow" size={16} />
              </a>
            </article>
          );
        })}
      </div>
      <section className="closing">
        <p className="eyebrow">PENJELAJAHANMU BARU DIMULAI</p>
        <h2>
          Tertarik membangun dunia digital
          <br />
          yang aman dan terhubung?
        </h2>
        <div className="button-row">
          <a
            className="button primary"
            href={official}
            target="_blank"
            rel="noreferrer"
            aria-label="Kenali NCC Lebih Lanjut (tab baru)"
          >
            Kenali NCC Lebih Lanjut <Icon name="external" size={17} />
          </a>
          <a className="button secondary" href="#/misi">
            Kembali ke Peta
          </a>
        </div>
      </section>
    </main>
  );
}
function About() {
  return (
    <main className="container about-page">
      <p className="eyebrow">KENALAN DENGAN LAB</p>
      <h1 tabIndex={-1}>
        Dunia yang saling terhubung.
        <br />
        <span>Ide yang terus bertumbuh.</span>
      </h1>
      <div className="about-grid">
        <div className="about-identity">
          <span className="about-logo">
            <img
              src={logo}
              alt="Logo Laboratorium Net-Centric Computing (NCC)"
            />
          </span>
          <p>
            Departemen Teknik Informatika
            <br />
            Institut Teknologi Sepuluh Nopember
          </p>
        </div>
        <div>
          <h2>Net-Centric Computing</h2>
          <p>
            Laboratorium Net-Centric Computing (NCC), atau Komputasi Berbasis
            Jaringan, mempelajari sistem digital yang bekerja dan saling
            berkomunikasi melalui jaringan.
          </p>
          <p>
            Bidangnya mencakup sistem terdistribusi, cloud, keamanan informasi
            dan jaringan, forensik digital, komputasi bergerak, jaringan sensor,
            serta multimedia berbasis jaringan.
          </p>
          <div className="research-topics">
            <span>Steganografi</span>
            <span>Deteksi serangan siber</span>
            <span>Forensik drone</span>
          </div>
          <p>
            Tiga misi di website ini merupakan ilustrasi edukasi untuk
            memperkenalkan sebagian bidang lab.
          </p>
          <a
            className="button primary"
            href={official}
            target="_blank"
            rel="noreferrer"
            aria-label="Kenali NCC Lebih Lanjut (tab baru)"
          >
            Kenali NCC Lebih Lanjut <Icon name="external" size={17} />
          </a>
        </div>
      </div>
    </main>
  );
}

function Site() {
  const [route, setRoute] = useState(location.hash.slice(1) || "/");
  const [confirm, setConfirm] = useState(false);
  const routeRef = useRef<HTMLDivElement>(null);
  const { progress, temporary, notice, reset } = useApp();
  useEffect(() => {
    const change = () => setRoute(location.hash.slice(1) || "/");
    addEventListener("hashchange", change);
    return () => removeEventListener("hashchange", change);
  }, []);
  useEffect(() => {
    window.scrollTo({ top: 0 });
    requestAnimationFrame(() =>
      routeRef.current?.querySelector<HTMLElement>("h1")?.focus(),
    );
  }, [route]);
  let page: ReactNode;
  switch (route) {
    case "/":
      page = <Home />;
      break;
    case "/misi":
      page = <MapPage />;
      break;
    case "/misi/piksel":
      page = <Pixel />;
      break;
    case "/misi/jejak":
      page = <Forensics />;
      break;
    case "/misi/server":
      page = <Server />;
      break;
    case "/lencana":
      page = <Collection />;
      break;
    case "/tentang":
      page = <About />;
      break;
    default:
      page = (
        <main className="container fallback">
          <h1 tabIndex={-1}>Koordinat tidak ditemukan.</h1>
          <a className="button primary" href="#/misi">
            Kembali ke Peta
          </a>
        </main>
      );
  }
  return (
    <MotionConfig reducedMotion="user">
      <a
        className="skip-link"
        href="#main-content"
        onClick={(e) => {
          e.preventDefault();
          routeRef.current?.querySelector<HTMLElement>("h1")?.focus();
        }}
      >
        Lewati ke konten
      </a>
      <header className="site-header">
        <div className="container header-inner">
          <Logo />
          <nav aria-label="Navigasi utama">
            <a
              className={route.includes("/misi") ? "active" : ""}
              href="#/misi"
            >
              Peta Misi
            </a>
            <a
              className={route === "/lencana" ? "active" : ""}
              href="#/lencana"
            >
              Lencana{" "}
              <span className="nav-count">{progress.badges.length}</span>
            </a>
            <a
              className={route === "/tentang" ? "active" : ""}
              href="#/tentang"
            >
              Tentang NCC
            </a>
          </nav>
          <span className="header-tag mono">
            EXPLORER MODE <span className="live-dot" />
          </span>
        </div>
      </header>
      {temporary && (
        <p role="status" className="storage-notice">
          Progres hanya tersimpan selama sesi ini.
        </p>
      )}
      {notice && (
        <p role="status" className="storage-notice">
          {notice}
        </p>
      )}
      <div ref={routeRef} id="main-content">
        <AnimatePresence mode="wait">
          <motion.div
            key={route}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onAnimationComplete={() =>
              routeRef.current?.querySelector<HTMLElement>("h1")?.focus()
            }
          >
            <LoadBoundary>
              <Suspense
                fallback={
                  <main className="container fallback" role="status">
                    Menyiapkan laboratorium…
                  </main>
                }
              >
                {page}
              </Suspense>
            </LoadBoundary>
          </motion.div>
        </AnimatePresence>
      </div>
      <footer className="site-footer container">
        <div>
          <span className="mono">NCC DIGITAL DETECTIVE</span>
          <p>Eksperimen kecil. Wawasan baru.</p>
        </div>
        <span className="footer-its">Teknik Informatika · ITS</span>
        {["/misi", "/lencana"].includes(route) && (
          <button className="text-link" onClick={() => setConfirm(true)}>
            <Icon name="reset" size={16} /> Pengunjung Baru
          </button>
        )}
      </footer>
      {confirm && (
        <Modal
          title="Siap untuk pengunjung berikutnya?"
          onClose={() => setConfirm(false)}
        >
          <p>
            Hapus progres dan lencana di perangkat ini untuk pengunjung
            berikutnya?
          </p>
          <div className="button-row">
            <button
              className="button secondary"
              autoFocus
              data-initial-focus
              onClick={() => setConfirm(false)}
            >
              Batal
            </button>
            <button
              className="button primary"
              onClick={() => {
                setConfirm(false);
                reset();
              }}
            >
              Hapus & Mulai Baru
            </button>
          </div>
        </Modal>
      )}
    </MotionConfig>
  );
}
export default function App() {
  return (
    <AppProvider>
      <Site />
    </AppProvider>
  );
}
