import { useEffect, useMemo, useRef, useState } from "react";
import { decode } from "../core/steganography";
import {
  CASE_SIZE,
  caseImages,
  createPixelCase,
  findChangedPixel,
  matchesAccessCode,
} from "../core/pixel-case";
import { MissionFrame, Result } from "../components/UI";
import { Icon } from "../components/Visuals";
import PixelWorkshop from "./PixelWorkshop";

export default function Pixel() {
  const [kind, setKind] = useState(0);
  const { original, encoded } = useMemo(() => createPixelCase(kind), [kind]);
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [view, setView] = useState<"original" | "encoded">("encoded");
  const [inspected, setInspected] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [revealed, setRevealed] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [won, setWon] = useState(false),
    [workshop, setWorkshop] = useState(false);
  const [feedback, setFeedback] = useState(""),
    [codeFeedback, setCodeFeedback] = useState("");
  const [available, setAvailable] = useState(true);
  const sourceCanvas = useRef<HTMLCanvasElement>(null),
    encodedCanvas = useRef<HTMLCanvasElement>(null),
    zoom = useRef<HTMLCanvasElement>(null);
  const messageHeading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    for (const [ref, data] of [
      [sourceCanvas, original],
      [encodedCanvas, encoded],
    ] as const) {
      const ctx = ref.current?.getContext("2d");
      if (!ctx) {
        setAvailable(false);
        continue;
      }
      const pixels = ctx.createImageData(CASE_SIZE, CASE_SIZE);
      pixels.data.set(data);
      ctx.putImageData(pixels, 0, 0);
    }
  }, [original, encoded]);
  useEffect(() => {
    const ctx = zoom.current?.getContext("2d");
    if (!ctx) return;
    const data = view === "encoded" ? encoded : original;
    ctx.clearRect(0, 0, 210, 210);
    for (let dy = -3; dy <= 3; dy++)
      for (let dx = -3; dx <= 3; dx++) {
        const x = Math.max(0, Math.min(CASE_SIZE - 1, point.x + dx)),
          y = Math.max(0, Math.min(CASE_SIZE - 1, point.y + dy)),
          index = (y * CASE_SIZE + x) * 4;
        ctx.fillStyle = `rgb(${data[index]},${data[index + 1]},${data[index + 2]})`;
        ctx.fillRect((dx + 3) * 30, (dy + 3) * 30, 29, 29);
      }
    ctx.strokeStyle = "#E5D6F7";
    ctx.lineWidth = 2;
    ctx.strokeRect(91, 91, 27, 27);
  }, [point, view, original, encoded, inspected]);
  useEffect(() => {
    if (revealed !== null) messageHeading.current?.focus();
  }, [revealed]);
  const index = (point.y * CASE_SIZE + point.x) * 4;
  const channel = [0, 1, 2].find(
    (c) => original[index + c] !== encoded[index + c],
  );
  function resetCase(nextKind = kind) {
    setKind(nextKind);
    setPoint({ x: 0, y: 0 });
    setView("encoded");
    setInspected(false);
    setAnalyzed(false);
    setRevealed(null);
    setAnswer("");
    setWon(false);
    setWorkshop(false);
    setFeedback("");
    setCodeFeedback("");
  }
  function selectPixel(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setPoint({
      x: Math.max(
        0,
        Math.min(
          CASE_SIZE - 1,
          Math.floor(((e.clientX - r.left) / r.width) * CASE_SIZE),
        ),
      ),
      y: Math.max(
        0,
        Math.min(
          CASE_SIZE - 1,
          Math.floor(((e.clientY - r.top) / r.height) * CASE_SIZE),
        ),
      ),
    });
    setInspected(true);
  }
  function scan() {
    setPoint(findChangedPixel(original, encoded));
    setInspected(true);
    setView("encoded");
    setFeedback(
      "Piksel berbeda ditemukan. Bandingkan delapan angka pada nilai warna di bawah gambar.",
    );
  }
  function checkBit(choice: string) {
    if (choice !== "right") {
      setFeedback(
        "Coba bandingkan kedua baris dari kiri ke kanan. Cari satu posisi angka yang berbeda; kamu boleh mencoba lagi.",
      );
      return;
    }
    setAnalyzed(true);
    setFeedback(
      "Tepat! Angka paling kanan berubah. Posisi ini disebut bit terakhir atau LSB; perubahan kecilnya bisa membawa pesan.",
    );
  }
  function readMessage() {
    if (!analyzed) return;
    try {
      const ctx = encodedCanvas.current?.getContext("2d");
      if (!ctx) throw new Error("Canvas tidak tersedia.");
      setRevealed(decode(ctx.getImageData(0, 0, CASE_SIZE, CASE_SIZE).data));
      setCodeFeedback("");
    } catch (e) {
      setFeedback((e as Error).message);
    }
  }
  function unlock(e: React.FormEvent) {
    e.preventDefault();
    if (!analyzed || revealed === null) return;
    try {
      const ctx = encodedCanvas.current?.getContext("2d");
      if (!ctx) throw new Error("Canvas tidak tersedia.");
      const freshMessage = decode(
        ctx.getImageData(0, 0, CASE_SIZE, CASE_SIZE).data,
      );
      if (matchesAccessCode(freshMessage, answer)) {
        setWon(true);
        setCodeFeedback("");
      } else
        setCodeFeedback(
          "Kode belum cocok. Cari tulisan ‘Kode akses’ pada pesan yang baru kamu baca, lalu masukkan kodenya lengkap.",
        );
    } catch (e) {
      setCodeFeedback((e as Error).message);
    }
  }
  return (
    <MissionFrame
      index={0}
      onRestart={() => resetCase()}
      hint={
        <>
          <p>
            <b>Tujuanmu:</b> temukan kode di dalam gambar untuk membuka berkas
            NCC.
          </p>
          <p>
            1. Pilih Cari Petunjuk Piksel, atau ketuk gambar dan gunakan tombol
            arah untuk menemukan nilai warna yang berubah.
          </p>
          <p>
            2. Bandingkan dua baris angka. Satu posisi paling kanan berbeda.
            Pilih posisi itu untuk menyiapkan pembaca pesan.
          </p>
          <p>
            3. Baca pesan tersembunyi, lalu ketik kode akses yang ditemukan
            untuk membuka berkas. Tak perlu menebak kodenya.
          </p>
          <p>
            Setelah berkas terbuka, kamu boleh mencoba menyembunyikan pesanmu
            sendiri.
          </p>
        </>
      }
    >
      <p className="mission-lead">
        Sebuah gambar tiba dari laboratorium NCC. Di dalamnya ada kode untuk
        membuka berkas rahasia. Temukan kodenya!
      </p>
      <ol className="pixel-steps" aria-label="Tahapan misi">
        {["Periksa gambar", "Baca pesan", "Buka berkas"].map((label, i) => (
          <li
            key={label}
            aria-current={
              (i === 0 && !analyzed) ||
              (i === 1 && analyzed && revealed === null) ||
              (i === 2 && revealed !== null && !won)
                ? "step"
                : undefined
            }
            className={
              (i === 0 && analyzed) ||
              (i === 1 && revealed !== null) ||
              (i === 2 && won)
                ? "complete"
                : ""
            }
          >
            <span>
              {(i === 0 && analyzed) ||
              (i === 1 && revealed !== null) ||
              (i === 2 && won) ? (
                <Icon name="check" size={14} />
              ) : (
                i + 1
              )}
            </span>
            {label}
          </li>
        ))}
      </ol>
      {!available ? (
        <section className="panel">
          <h2>Canvas tidak tersedia di browser ini.</h2>
          <p>
            Misi ini memerlukan Canvas 2D. Kamu tetap bisa mencoba dua misi
            lainnya.
          </p>
          <a className="button primary" href="#/misi">
            Pilih Misi Lain
          </a>
        </section>
      ) : (
        <>
          <div className="game-layout pixel-case-layout">
            <section className="panel pixel-case-board">
              <div className="panel-caption">
                <span className="mono">BUKTI / GAMBAR KIRIMAN NCC</span>
                <span className="status-pill">
                  {analyzed ? "Petunjuk terpecahkan" : "Pesan belum terbaca"}
                </span>
              </div>
              <div className="segmented" aria-label="Bandingkan gambar kasus">
                <button
                  onClick={() => setView("original")}
                  aria-pressed={view === "original"}
                >
                  Gambar Asli
                </button>
                <button
                  onClick={() => setView("encoded")}
                  aria-pressed={view === "encoded"}
                >
                  Gambar Kiriman
                </button>
              </div>
              <div className="case-image-stage">
                <canvas
                  ref={sourceCanvas}
                  width={CASE_SIZE}
                  height={CASE_SIZE}
                  hidden={view !== "original"}
                  role="img"
                  aria-label="Gambar asli untuk pembanding. Ketuk untuk memilih piksel; tombol arah juga tersedia."
                  onClick={selectPixel}
                />
                <canvas
                  ref={encodedCanvas}
                  width={CASE_SIZE}
                  height={CASE_SIZE}
                  hidden={view !== "encoded"}
                  role="img"
                  aria-label="Gambar kiriman NCC dengan pesan tersembunyi. Ketuk untuk memilih piksel; tombol arah juga tersedia."
                  onClick={selectPixel}
                />
              </div>
              <p className="canvas-help">
                Terlihat sama? Sebagian nilai warnanya berbeda sangat sedikit.
              </p>
              <div className="pixel-picker" aria-label="Pilih gambar kasus">
                {caseImages.map((name, i) => (
                  <button
                    key={name}
                    aria-pressed={kind === i}
                    className={kind === i ? "selected" : ""}
                    onClick={() => resetCase(i)}
                  >
                    <span className={`image-swatch swatch-${i}`} />
                    {name}
                  </button>
                ))}
              </div>
              <button className="button primary full case-scan" onClick={scan}>
                <Icon name="eye" /> Cari Petunjuk Piksel
              </button>
              {inspected && (
                <section
                  className="case-pixel-clue"
                  aria-labelledby="clue-title"
                >
                  <h2 id="clue-title">Apa yang berubah?</h2>
                  <div className="case-clue-data">
                    <div className="magnifier">
                      <canvas
                        ref={zoom}
                        width={210}
                        height={210}
                        role="img"
                        aria-label={`Pembesaran gambar ${view === "encoded" ? "kiriman" : "asli"}, piksel ${point.x}, ${point.y}`}
                      />
                      <span className="mono">
                        GRID 7 × 7 / ({point.x}, {point.y})
                      </span>
                    </div>
                    <div className="pixel-values">
                      <p className="mono">WARNA ASLI → KIRIMAN</p>
                      <dl>
                        {["R", "G", "B"].map((c, i) => (
                          <div key={c}>
                            <dt>{c}</dt>
                            <dd>
                              {original[index + i]} <span>→</span>{" "}
                              <b>{encoded[index + i]}</b>
                            </dd>
                          </div>
                        ))}
                      </dl>
                      <div
                        className="direction-buttons"
                        aria-label="Pilih koordinat piksel"
                      >
                        {[
                          { name: "back", label: "Piksel kiri", x: -1, y: 0 },
                          { name: "up", label: "Piksel atas", x: 0, y: -1 },
                          { name: "down", label: "Piksel bawah", x: 0, y: 1 },
                          { name: "arrow", label: "Piksel kanan", x: 1, y: 0 },
                        ].map((d) => (
                          <button
                            key={d.label}
                            className="icon-button"
                            aria-label={d.label}
                            onClick={() =>
                              setPoint((p) => ({
                                x: Math.max(
                                  0,
                                  Math.min(CASE_SIZE - 1, p.x + d.x),
                                ),
                                y: Math.max(
                                  0,
                                  Math.min(CASE_SIZE - 1, p.y + d.y),
                                ),
                              }))
                            }
                          >
                            <Icon name={d.name} />
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  {channel === undefined ? (
                    <p className="small-note">
                      Piksel ini belum menunjukkan perubahan. Pilih Cari
                      Petunjuk Piksel untuk menuju piksel yang berbeda.
                    </p>
                  ) : (
                    <>
                      <p>
                        Nilai warna {["R", "G", "B"][channel]} bisa ditulis
                        sebagai delapan angka 0 atau 1, yang disebut bit.
                        Bandingkan kedua baris ini.
                      </p>
                      <div className="case-bit-comparison">
                        <div>
                          <span>Asli</span>
                          <code>
                            {original[index + channel]
                              .toString(2)
                              .padStart(8, "0")}
                          </code>
                        </div>
                        <div>
                          <span>Kiriman</span>
                          <code>
                            {encoded[index + channel]
                              .toString(2)
                              .padStart(8, "0")}
                          </code>
                        </div>
                      </div>
                      <fieldset className="bit-choices">
                        <legend>Posisi angka mana yang berubah?</legend>
                        {[
                          { id: "left", label: "Paling kiri" },
                          { id: "right", label: "Paling kanan" },
                          { id: "all", label: "Semua angka" },
                        ].map((choice) => (
                          <button
                            key={choice.id}
                            className={`button ${analyzed && choice.id === "right" ? "primary" : "secondary"}`}
                            disabled={analyzed}
                            onClick={() => checkBit(choice.id)}
                          >
                            {analyzed && choice.id === "right" && (
                              <Icon name="check" size={16} />
                            )}{" "}
                            {choice.label}
                          </button>
                        ))}
                      </fieldset>
                    </>
                  )}
                </section>
              )}
              <div className="feedback" role="status">
                {feedback ||
                  "Mulai dengan mencari petunjuk piksel. Pesannya belum ditampilkan — kamu yang akan menemukannya."}
              </div>
              <button
                className="button secondary full case-read"
                disabled={!analyzed || revealed !== null}
                onClick={readMessage}
              >
                <Icon name="eye" /> Baca Pesan Tersembunyi
              </button>
              {!analyzed && (
                <p className="small-note">
                  Pembaca pesan siap setelah kamu menemukan posisi angka yang
                  berubah.
                </p>
              )}
            </section>
            <aside className="panel pixel-case-file">
              <span className="step-label mono">TARGET / BERKAS NCC</span>
              <div className={`case-vault ${won ? "opened" : ""}`}>
                <Icon name={won ? "check" : "shield"} size={48} />
                <span className="mono">
                  {won ? "AKSES DITERIMA" : "AKSES TERKUNCI"}
                </span>
              </div>
              <h2>
                {won ? "Berkas berhasil dibuka." : "Temukan kode aksesnya."}
              </h2>
              <p>
                Kode disembunyikan di dalam gambar kiriman. Periksa petunjuknya,
                baca pesan, lalu gunakan kode untuk membuka berkas ini.
              </p>
              {revealed !== null && (
                <section
                  className="decoded-message case-secret"
                  aria-labelledby="secret-heading"
                >
                  <h3 ref={messageHeading} tabIndex={-1} id="secret-heading">
                    Pesan dari dalam gambar
                  </h3>
                  <p>{revealed}</p>
                </section>
              )}
              <form onSubmit={unlock}>
                <label htmlFor="access-code">Kode akses berkas</label>
                <input
                  id="access-code"
                  value={answer}
                  disabled={revealed === null || won}
                  autoComplete="off"
                  spellCheck={false}
                  maxLength={20}
                  aria-describedby="code-help code-feedback"
                  onChange={(e) => {
                    setAnswer(e.target.value);
                    setCodeFeedback("");
                  }}
                  placeholder="Masukkan kode dari pesan"
                />
                <p id="code-help" className="small-note">
                  {revealed === null
                    ? "Baca pesan tersembunyi terlebih dahulu."
                    : "Salin kode akses yang tertulis pada pesan di atas."}
                </p>
                <button
                  className="button primary full"
                  disabled={revealed === null || !answer.trim() || won}
                  type="submit"
                >
                  <Icon name={won ? "check" : "arrow"} size={18} />
                  {won ? "Berkas Terbuka" : "Buka Berkas"}
                </button>
                <p id="code-feedback" className="code-feedback" role="status">
                  {codeFeedback}
                </p>
              </form>
            </aside>
          </div>
          {won && (
            <>
              <Result index={0}>
                <p>
                  Kamu menemukan kode di dalam piksel dan membuka berkas NCC.
                  Gambar yang terlihat biasa ternyata membawa informasi
                  tambahan!
                </p>
              </Result>
              <div className="pixel-next panel">
                <div>
                  <p className="eyebrow">MISTERI TERPECAHKAN</p>
                  <h2>Sekarang, jadi pengirim pesan rahasia.</h2>
                  <p>
                    Coba tulis pesanmu sendiri, sisipkan ke gambar, lalu
                    buktikan bahwa pesan itu bisa dibaca kembali.
                  </p>
                </div>
                <button
                  className="button primary"
                  disabled={workshop}
                  onClick={() => setWorkshop(true)}
                >
                  {workshop
                    ? "Eksperimen sudah terbuka"
                    : "Sembunyikan Pesanmu Sendiri"}{" "}
                  <Icon name="arrow" size={18} />
                </button>
              </div>
              <button
                className="button secondary after-result"
                onClick={() => resetCase()}
              >
                <Icon name="reset" /> Main Lagi
              </button>
              {workshop && <PixelWorkshop />}
            </>
          )}
        </>
      )}
    </MissionFrame>
  );
}
