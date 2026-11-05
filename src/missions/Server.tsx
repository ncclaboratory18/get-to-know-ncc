import { useEffect, useState } from "react";
import { initialServer, resizeServers, stepServer } from "../core/server";
import { MissionFrame, Result } from "../components/UI";
import { Icon } from "../components/Visuals";
import ServerCanvas from "../components/ServerCanvas";

export default function Server() {
  const [state, setState] = useState(initialServer),
    [mode, setMode] = useState<"practice" | "ready" | "challenge">("practice");
  const [users, setUsers] = useState(20),
    [manualPause, setManualPause] = useState(false),
    [helpPause, setHelpPause] = useState(false),
    [hidden, setHidden] = useState(document.hidden);
  const paused =
    manualPause ||
    helpPause ||
    hidden ||
    mode === "ready" ||
    state.status !== "running";
  useEffect(() => {
    const onVisibility = () => {
      setHidden(document.hidden);
      if (document.hidden) setManualPause(true);
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);
  useEffect(() => {
    if (paused) return;
    // Waktu simulasi berjalan dalam langkah tetap, terpisah dari frame rendering.
    const timer = window.setInterval(
      () => setState((s) => stepServer(s, 0.1, mode === "challenge", users)),
      100,
    );
    return () => window.clearInterval(timer);
  }, [paused, mode, users]);
  function reset(target: "practice" | "ready" | "challenge" = "practice") {
    setState(initialServer());
    setMode(target);
    setUsers(20);
    setManualPause(false);
    setHelpPause(false);
  }
  const total = state.queues.reduce((a, b) => a + b, 0),
    finished = state.status !== "running";
  const phase =
    state.time < 8
      ? "Pemain mulai masuk"
      : state.time < 16
        ? "Gim mulai dibagikan teman"
        : state.time < 24
          ? "Puncak lonjakan pemain"
          : "Lalu lintas mulai turun";
  function setCount(delta: number) {
    setState((s) => resizeServers(s, s.queues.length + delta));
  }
  return (
    <MissionFrame
      index={2}
      onRestart={() => reset(mode === "practice" ? "practice" : "ready")}
      onPause={(p) => {
        setHelpPause(p);
        if (!p) setManualPause(true);
      }}
      hint={
        <>
          <p>
            Load balancer adalah pembagi permintaan yang mengarahkan pemain ke
            server.
          </p>
          <p>
            Setiap server melayani 20 permintaan/detik. Distribusi merata
            memakai semua server, sementara mode menumpuk hanya mengirim
            permintaan baru ke server pertama.
          </p>
          <p>
            Coba naikkan pengguna di latihan. Untuk tantangan, sesuaikan server
            dengan jadwal lonjakan dan hemat anggaran saat pengguna turun.
          </p>
          <p>
            Contoh strategi: 2 server di awal, 3 saat detik 8, 4 saat detik 16,
            lalu 2 saat detik 24.
          </p>
        </>
      }
    >
      <p className="mission-lead">
        Gim sekolahmu mendadak ramai. Bagi permintaan dan jaga pemain tetap bisa
        masuk.
      </p>
      <div className="server-mode-bar">
        <div className="segmented" aria-label="Mode permainan server">
          <button
            aria-pressed={mode === "practice"}
            onClick={() => reset("practice")}
          >
            Mode Latihan
          </button>
          <button
            aria-pressed={mode !== "practice"}
            onClick={() => reset("ready")}
          >
            Tantangan 30 Detik
          </button>
        </div>
        <span className="mono simulation-label">
          SIMULASI PEMBELAJARAN · BUKAN BENCHMARK NYATA
        </span>
      </div>
      {mode === "ready" && (
        <section className="challenge-brief panel">
          <p className="eyebrow">BRIEFING / TANTANGAN 30 DETIK</p>
          <h2>Ramai boleh. Tumbang jangan.</h2>
          <p>
            Jaga respons <b>≤1 detik selama minimal 24 dari 30 detik</b>,
            antrean akhir <b>maksimal 20</b>, dan jangan habiskan anggaran
            sebelum waktu berakhir.
          </p>
          <div className="wave-schedule">
            {[
              ["0–8 dtk", "20 pengguna"],
              ["8–16 dtk", "50 pengguna"],
              ["16–24 dtk", "70 pengguna"],
              ["24–30 dtk", "30 pengguna"],
            ].map(([t, u]) => (
              <div key={t}>
                <span className="mono">{t}</span>
                <b>{u}</b>
              </div>
            ))}
          </div>
          <p className="small-note">
            Mulai dengan 2 server dan 90 kredit. Satu server memakai 1
            kredit/detik. Jadwal selalu sama — kamu bisa merencanakan strategi.
          </p>
          <button className="button primary" onClick={() => reset("challenge")}>
            Siap, Mulai! <Icon name="play" size={17} />
          </button>
        </section>
      )}
      <div className="game-layout server-layout">
        <section className="network-panel panel">
          <div className="panel-caption">
            <span className="mono">LIVE / JARINGAN GIM SEKOLAH</span>
            <span className="status-pill">
              {finished
                ? "Selesai"
                : paused
                  ? "Jeda"
                  : mode === "challenge"
                    ? `${Math.max(0, 30 - state.time).toFixed(1)} detik`
                    : "Latihan bebas"}
            </span>
          </div>
          {mode === "challenge" && (
            <div className="challenge-timer">
              <div style={{ width: `${(state.time / 30) * 100}%` }} />
              <p className="mono">{phase}</p>
            </div>
          )}
          <ServerCanvas state={state} paused={paused} />
          <div className="network-caption">
            <span className="live-dot" />
            <span>
              Setiap paket mewakili beberapa permintaan. Jalurnya mengikuti
              distribusi yang kamu pilih.
            </span>
          </div>
          <div className="server-loads">
            {state.queues.map((queue, i) => {
              const load = state.loads[i] * 100;
              return (
                <div key={i}>
                  <span className="mono">S{i + 1}</span>
                  <div className="load-meter">
                    <span style={{ width: `${load}%` }} />
                  </div>
                  <span>{Math.round(load)}%</span>
                  <span className="small-note">Antrean {queue.toFixed(0)}</span>
                </div>
              );
            })}
          </div>
          {manualPause &&
            !hidden &&
            !helpPause &&
            mode !== "ready" &&
            !finished && (
              <div className="pause-overlay">
                <Icon name="pause" size={30} />
                <h2>Eksperimen dijeda.</h2>
                <p>Waktu, antrean, dan biaya berhenti.</p>
                <button
                  className="button primary"
                  onClick={() => setManualPause(false)}
                >
                  Lanjutkan <Icon name="play" size={16} />
                </button>
              </div>
            )}
        </section>
        <aside className="panel server-controls">
          <span className="step-label mono">PUSAT KENDALI</span>
          {mode === "challenge" && (
            <div
              className="control-live-status"
              aria-label="Ringkasan tantangan dekat kontrol"
            >
              <span>
                Sisa waktu<b>{Math.max(0, 30 - state.time).toFixed(1)} detik</b>
              </span>
              <span>
                Anggaran<b>{state.budget.toFixed(1)} kredit</b>
              </span>
              <span>
                Respons<b>{state.response.toFixed(2)} detik</b>
              </span>
              <span>
                Antrean<b>{total.toFixed(0)} permintaan</b>
              </span>
            </div>
          )}
          <label htmlFor="users">
            Jumlah pengguna <b>{mode === "practice" ? users : state.users}</b>
          </label>
          <input
            id="users"
            type="range"
            min="0"
            max="100"
            step="5"
            value={mode === "practice" ? users : state.users}
            disabled={mode !== "practice"}
            onChange={(e) => setUsers(Number(e.target.value))}
          />
          {mode === "practice" ? (
            <div className="range-actions">
              <button
                className="icon-button"
                aria-label="Kurangi 5 pengguna"
                disabled={users === 0}
                onClick={() => setUsers((u) => Math.max(0, u - 5))}
              >
                <Icon name="minus" />
              </button>
              <span className="small-note">
                1 pengguna = 1 permintaan/detik
              </span>
              <button
                className="icon-button"
                aria-label="Tambah 5 pengguna"
                disabled={users === 100}
                onClick={() => setUsers((u) => Math.min(100, u + 5))}
              >
                <Icon name="plus" />
              </button>
            </div>
          ) : (
            <p className="small-note">
              Jumlah pengguna mengikuti jadwal lonjakan.
            </p>
          )}
          <div className="control-divider" />
          <span className="control-label">Server aktif</span>
          <div className="server-counter">
            <button
              className="icon-button"
              disabled={
                state.queues.length <= 1 || mode === "ready" || finished
              }
              onClick={() => setCount(-1)}
              aria-label="Kurangi server"
            >
              <Icon name="minus" />
            </button>
            <b>
              {state.queues.length}
              <span>/4</span>
            </b>
            <button
              className="icon-button"
              disabled={
                state.queues.length >= 4 || mode === "ready" || finished
              }
              onClick={() => setCount(1)}
              aria-label="Tambah server"
            >
              <Icon name="plus" />
            </button>
          </div>
          <p className="small-note">
            Kapasitas {state.queues.length * 20} permintaan/detik · Biaya{" "}
            {state.queues.length} kredit/detik
          </p>
          <div className="control-divider" />
          <span className="control-label">Distribusi permintaan</span>
          <div className="distribution-buttons">
            <button
              aria-pressed={state.distribution === "even"}
              disabled={mode === "ready" || finished}
              onClick={() => setState((s) => ({ ...s, distribution: "even" }))}
            >
              <Icon name="spark" size={16} /> Merata
            </button>
            <button
              aria-pressed={state.distribution === "single"}
              disabled={mode === "ready" || finished}
              onClick={() =>
                setState((s) => ({ ...s, distribution: "single" }))
              }
            >
              <Icon name="flag" size={16} /> Menumpuk di Satu Server
            </button>
          </div>
          {mode === "practice" && (
            <button
              className="button primary full"
              onClick={() => reset("ready")}
            >
              Mulai Tantangan <Icon name="arrow" size={17} />
            </button>
          )}
          {mode === "challenge" && !finished && (
            <button
              className="button secondary full"
              disabled={helpPause || hidden}
              onClick={() => setManualPause((p) => !p)}
            >
              <Icon name={manualPause ? "play" : "pause"} size={17} />
              {manualPause ? "Lanjutkan" : "Jeda"}
            </button>
          )}
        </aside>
      </div>
      <section className="server-metrics" aria-label="Indikator simulasi">
        <div>
          <span className="mono">ANTREAN</span>
          <b>
            {total.toFixed(0)}
            <small>permintaan</small>
          </b>
          <p>
            {total < 1
              ? "Semua permintaan tertangani."
              : "Permintaan menunggu kapasitas."}
          </p>
        </div>
        <div>
          <span className="mono">ESTIMASI RESPONS</span>
          <b>
            {state.response.toFixed(2)}
            <small>detik</small>
          </b>
          <p>
            {state.response <= 1
              ? "Respons sesuai target."
              : "Respons melebihi target 1 detik."}
          </p>
        </div>
        <div>
          <span className="mono">
            {mode === "practice" ? "ANGGARAN TANTANGAN" : "ANGGARAN TERSISA"}
          </span>
          <b>
            {state.budget.toFixed(1)}
            <small>kredit</small>
          </b>
          <p>
            {mode === "practice"
              ? "Latihan tidak menguras anggaran."
              : "Satu server = 1 kredit/detik."}
          </p>
        </div>
        <div>
          <span className="mono">DURASI RESPONS ≤1 DETIK</span>
          <b>
            {mode === "practice" ? "—" : state.goodTime.toFixed(1)}
            <small>/24 detik</small>
          </b>
          <p>
            {mode === "practice"
              ? "Dinilai saat tantangan."
              : "Minimal 24 detik untuk berhasil."}
          </p>
        </div>
      </section>
      {state.status === "won" && (
        <Result index={2}>
          <p>
            Jaringan bertahan! Respons sesuai target selama{" "}
            {state.goodTime.toFixed(1)} detik, antrean akhir {total.toFixed(0)},
            dan sisa anggaran {state.budget.toFixed(1)} kredit.
          </p>
        </Result>
      )}
      {state.status === "lost" && (
        <section className="retry-panel panel" role="status">
          <p className="eyebrow">
            <Icon name="info" size={16} /> COBA LAGI
          </p>
          <h2>
            {state.budget < 0.001 && state.time < 29.999
              ? "Anggarannya habis lebih dulu."
              : "Jaringanmu butuh strategi baru."}
          </h2>
          <p>
            {state.budget < 0.001 && state.time < 29.999
              ? "Kurangi server saat pengguna sepi agar saldo cukup sampai akhir."
              : "Gunakan distribusi merata dan tambah kapasitas sebelum lonjakan datang."}
          </p>
          <p>
            Respons sesuai target: <b>{state.goodTime.toFixed(1)}/24 detik</b> ·
            Antrean akhir: <b>{total.toFixed(0)}/20</b> · Sisa saldo:{" "}
            <b>{state.budget.toFixed(1)} kredit</b>.
          </p>
          <h3>Hubungannya dengan NCC?</h3>
          <p>
            Cloud dan sistem terdistribusi mengatur kapasitas pada beberapa
            mesin. Pembagian beban membantu memakai kapasitas, sedangkan
            tambahan server meningkatkan biaya. Permainan ini adalah ilustrasi
            edukasi.
          </p>
        </section>
      )}
      {finished && (
        <div className="button-row after-result">
          <button className="button primary" onClick={() => reset("ready")}>
            <Icon name="reset" /> Ulangi Tantangan
          </button>
          <button
            className="button secondary"
            onClick={() => reset("practice")}
          >
            Kembali ke Latihan
          </button>
          <a href="#/misi" className="button secondary">
            Peta Misi
          </a>
        </div>
      )}
    </MissionFrame>
  );
}
