import { useState } from "react";
import { checkTimeline, conclusions, evidence } from "../core/forensics";
import { MissionFrame, Result } from "../components/UI";
import { Icon } from "../components/Visuals";

export default function Forensics() {
  const [open, setOpen] = useState<string | null>("E3"),
    [selected, setSelected] = useState<string[]>([]);
  const [checked, setChecked] = useState(false),
    [conclusion, setConclusion] = useState<number | null>(null),
    [won, setWon] = useState(false),
    [feedback, setFeedback] = useState("");
  function invalidate() {
    setChecked(false);
    setConclusion(null);
    setWon(false);
    setFeedback("");
  }
  function toggle(id: string) {
    setSelected((items) =>
      items.includes(id) ? items.filter((x) => x !== id) : [...items, id],
    );
    invalidate();
  }
  function move(index: number, delta: number) {
    const next = [...selected],
      target = index + delta;
    if (target < 0 || target >= next.length) return;
    [next[index], next[target]] = [next[target], next[index]];
    setSelected(next);
    invalidate();
  }
  function restart() {
    setSelected([]);
    setOpen("E3");
    invalidate();
  }
  function inspect() {
    const error = checkTimeline(selected);
    setFeedback(
      error ||
        "Linimasa konsisten. Sekarang pilih kesimpulan yang paling didukung bukti.",
    );
    setChecked(!error);
  }
  function judge() {
    if (conclusion === 0) {
      setWon(true);
      setFeedback(
        "Tepat! Aktivitasnya terhubung melalui sesi S-17, tetapi identitas penggunanya belum terbukti.",
      );
    } else if (conclusion === 1)
      setFeedback(
        "Nama akun menunjukkan akun yang dipakai, bukan siapa yang mengoperasikannya. Coba kesimpulan yang tidak melampaui bukti.",
      );
    else
      setFeedback(
        "Sinkronisasi menyebut berkas dan layanan berbeda. Belum ada bukti yang menghubungkannya ke perubahan proyek.",
      );
  }
  return (
    <MissionFrame
      index={1}
      onRestart={restart}
      hint={
        <>
          <p>
            1. Buka kartu bukti, lalu tandai informasi yang terkait dengan
            berkas proyek.
          </p>
          <p>
            2. Cari ID sesi yang sama. Susun linimasa dari waktu paling awal
            menggunakan tombol Naik dan Turun.
          </p>
          <p>
            3. Periksa linimasa, lalu pilih kesimpulan yang tidak melampaui
            bukti.
          </p>
          <p>
            Login terjadi sebelum perubahan, dan logout sesudahnya. Nama akun
            belum membuktikan siapa orangnya.
          </p>
        </>
      }
    >
      <div className="case-brief">
        <div className="case-id mono">
          KASUS
          <br />
          <b>017</b>
        </div>
        <div>
          <span className="status-pill">
            Kasus simulasi — seluruh data fiktif
          </span>
          <p>
            Sebuah berkas proyek sekolah berubah tanpa diketahui pemiliknya.
            Telusuri jejak aktivitas untuk menemukan kejadian yang perlu
            diperiksa.
          </p>
          <span className="mono">
            BERKAS: presentasi-proyek.pptx · WAKTU: WIB, HARI YANG SAMA
          </span>
        </div>
      </div>
      <div className="game-layout forensics-layout">
        <section className="evidence-desk">
          <div className="section-line">
            <h2>Meja bukti</h2>
            <span className="mono">05 BERKAS</span>
          </div>
          <p className="small-note">
            Buka berkas, baca detailnya, lalu tandai yang relevan.
          </p>
          <div className="evidence-list">
            {[2, 0, 4, 3, 1].map((index) => {
              const e = evidence[index],
                active = open === e.id,
                isSelected = selected.includes(e.id);
              return (
                <article
                  className={`evidence-file ${isSelected ? "marked" : ""}`}
                  key={e.id}
                >
                  <button
                    className="evidence-toggle"
                    aria-expanded={active}
                    aria-controls={`evidence-${e.id}`}
                    onClick={() => setOpen(active ? null : e.id)}
                  >
                    <span className="evidence-number mono">{e.id}</span>
                    <span>
                      <span className="eyebrow">{e.type}</span>
                      <b>{e.title}</b>
                    </span>
                    <span className="evidence-time mono">{e.time}</span>
                    <Icon name={active ? "up" : "down"} size={17} />
                  </button>
                  {active && (
                    <div id={`evidence-${e.id}`} className="evidence-details">
                      <p>{e.text}</p>
                      <p className="small-note">{e.detail}</p>
                      <button
                        className={`button ${isSelected ? "primary" : "secondary"}`}
                        aria-pressed={isSelected}
                        onClick={() => toggle(e.id)}
                      >
                        <Icon name={isSelected ? "check" : "plus"} size={17} />
                        {isSelected ? "Ditandai Relevan" : "Tandai Relevan"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </section>
        <section className="panel timeline-panel">
          <div className="panel-caption">
            <span className="mono">PAPAN INVESTIGASI</span>
            <Icon name="flag" size={17} />
          </div>
          <h2>Hubungkan jejaknya.</h2>
          <p className="small-note">
            Urutkan bukti relevan dari kejadian paling awal.
          </p>
          {selected.length === 0 ? (
            <div className="empty-timeline">
              <span className="empty-cross">+</span>
              <p>Bukti pilihanmu akan muncul di sini.</p>
              <span className="mono">MULAI DARI MEJA BUKTI</span>
            </div>
          ) : (
            <ol className="timeline">
              {selected.map((id, i) => {
                const e = evidence.find((x) => x.id === id)!;
                return (
                  <li key={id}>
                    <span className="timeline-dot">{i + 1}</span>
                    <div className="timeline-item">
                      <div className="timeline-meta mono">
                        <span>
                          {e.id} / {e.time}
                        </span>
                        <button
                          className="icon-button"
                          aria-label={`Hapus ${id} dari linimasa`}
                          onClick={() => toggle(id)}
                        >
                          <Icon name="close" size={15} />
                        </button>
                      </div>
                      <b>{e.title}</b>
                      <span className="timeline-session">
                        {id === "E5" ? "SYNC-2" : "S-17"}
                      </span>
                      <div className="timeline-controls">
                        <button
                          className="button subtle"
                          disabled={i === 0}
                          onClick={() => move(i, -1)}
                          aria-label={`Naikkan ${id}`}
                        >
                          <Icon name="up" size={15} /> Naik
                        </button>
                        <button
                          className="button subtle"
                          disabled={i === selected.length - 1}
                          onClick={() => move(i, 1)}
                          aria-label={`Turunkan ${id}`}
                        >
                          <Icon name="down" size={15} /> Turun
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
          <button
            className="button primary full"
            disabled={selected.length === 0}
            onClick={inspect}
          >
            Periksa Linimasa <Icon name="arrow" size={18} />
          </button>
          {!checked && (
            <div className="feedback" role="status">
              {feedback ||
                "Bukti yang kuat saling terhubung. Jangan terburu-buru menebak orangnya."}
            </div>
          )}
        </section>
      </div>
      {checked && (
        <section className="panel conclusion-panel">
          <p className="eyebrow">LANGKAH TERAKHIR / KESIMPULAN</p>
          <h2>Apa yang benar-benar bisa kita simpulkan?</h2>
          <fieldset>
            <legend className="sr-only">
              Pilih kesimpulan yang didukung bukti
            </legend>
            {conclusions.map((text, i) => (
              <label
                key={text}
                className={`conclusion-option ${conclusion === i ? "selected" : ""}`}
              >
                <input
                  type="radio"
                  name="conclusion"
                  checked={conclusion === i}
                  onChange={() => {
                    setConclusion(i);
                    setWon(false);
                  }}
                />
                <span>{text}</span>
              </label>
            ))}
          </fieldset>
          <button
            className="button primary"
            disabled={conclusion === null}
            onClick={judge}
          >
            Periksa Kesimpulan <Icon name="arrow" size={18} />
          </button>
          <div className="feedback" role="status">
            {feedback}
          </div>
        </section>
      )}
      {won && (
        <>
          <Result index={1}>
            <p>
              <b>09.00 → 09.01 → 09.04 → 09.06</b>
              <br />
              Login, perangkat, perubahan, dan logout dihubungkan oleh sesi
              S-17. Komputer bersama tidak memberi kepastian tentang siapa
              penggunanya.
            </p>
          </Result>
          <button className="button secondary after-result" onClick={restart}>
            <Icon name="reset" /> Main Lagi
          </button>
        </>
      )}
    </MissionFrame>
  );
}
