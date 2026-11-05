import { useEffect, useMemo, useRef, useState } from "react";
import {
  byteLength,
  capacity,
  decode,
  encode,
  makeImage,
} from "../core/steganography";
import { MissionFrame, Result } from "../components/UI";
import { Icon } from "../components/Visuals";

const SIZE = 192;
const names = ["Kota Terhubung", "Gelombang Digital", "Mosaik Lab"];
export default function Pixel() {
  const [kind, setKind] = useState(0),
    [message, setMessage] = useState("Sampai jumpa di NCC!");
  const original = useMemo(() => makeImage(kind, SIZE), [kind]);
  const [output, setOutput] = useState<Uint8ClampedArray | null>(null);
  const [view, setView] = useState<"original" | "encoded">("original");
  const [point, setPoint] = useState({ x: 0, y: 0 });
  const [feedback, setFeedback] = useState(""),
    [revealed, setRevealed] = useState<string | null>(null),
    [available, setAvailable] = useState(true);
  const originalCanvas = useRef<HTMLCanvasElement>(null),
    encodedCanvas = useRef<HTMLCanvasElement>(null),
    zoom = useRef<HTMLCanvasElement>(null);
  const limit = Math.min(160, capacity(original));
  const bytes = byteLength(message);
  useEffect(() => {
    for (const [ref, data] of [
      [originalCanvas, original],
      [encodedCanvas, output || original],
    ] as const) {
      const ctx = ref.current?.getContext("2d");
      if (!ctx) {
        setAvailable(false);
        continue;
      }
      const image = ctx.createImageData(SIZE, SIZE);
      image.data.set(data);
      ctx.putImageData(image, 0, 0);
    }
  }, [original, output, available]);
  useEffect(() => {
    const ctx = zoom.current?.getContext("2d");
    if (!ctx) return;
    const data = view === "encoded" && output ? output : original;
    ctx.clearRect(0, 0, 210, 210);
    for (let dy = -3; dy <= 3; dy++)
      for (let dx = -3; dx <= 3; dx++) {
        const x = Math.max(0, Math.min(SIZE - 1, point.x + dx)),
          y = Math.max(0, Math.min(SIZE - 1, point.y + dy));
        const i = (y * SIZE + x) * 4;
        ctx.fillStyle = `rgb(${data[i]},${data[i + 1]},${data[i + 2]})`;
        ctx.fillRect((dx + 3) * 30, (dy + 3) * 30, 29, 29);
      }
    ctx.strokeStyle = "#E5D6F7";
    ctx.lineWidth = 2;
    ctx.strokeRect(91, 91, 27, 27);
  }, [point, output, original, view]);
  function invalidate() {
    setOutput(null);
    setRevealed(null);
    setView("original");
    setFeedback("");
  }
  function restart() {
    setKind(0);
    setMessage("Sampai jumpa di NCC!");
    setPoint({ x: 0, y: 0 });
    invalidate();
  }
  function insert() {
    try {
      const ctx = originalCanvas.current?.getContext("2d");
      if (!ctx) throw new Error("Canvas tidak tersedia.");
      const pixels = ctx.getImageData(0, 0, SIZE, SIZE).data;
      setOutput(encode(pixels, message));
      setView("encoded");
      setRevealed(null);
      setFeedback(
        "Kelihatannya sama, tetapi sebagian nilai pikselnya menyimpan pesanmu.",
      );
    } catch (e) {
      setFeedback((e as Error).message);
    }
  }
  function reveal() {
    try {
      const ctx = encodedCanvas.current?.getContext("2d");
      if (!ctx) throw new Error("Canvas tidak tersedia.");
      setRevealed(decode(ctx.getImageData(0, 0, SIZE, SIZE).data));
      setFeedback("Pesan berhasil dibaca langsung dari piksel gambar.");
    } catch (e) {
      setFeedback((e as Error).message);
    }
  }
  function selectPixel(e: React.MouseEvent<HTMLCanvasElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    setPoint({
      x: Math.max(
        0,
        Math.min(SIZE - 1, Math.floor(((e.clientX - r.left) / r.width) * SIZE)),
      ),
      y: Math.max(
        0,
        Math.min(SIZE - 1, Math.floor(((e.clientY - r.top) / r.height) * SIZE)),
      ),
    });
  }
  const index = (point.y * SIZE + point.x) * 4;
  const changedChannel = output
    ? [0, 1, 2].find((c) => original[index + c] !== output[index + c])
    : undefined;
  function findChanged() {
    if (!output) return;
    for (let i = 0; i < output.length; i++) {
      if (i % 4 !== 3 && output[i] !== original[i]) {
        const p = Math.floor(i / 4);
        setPoint({ x: p % SIZE, y: Math.floor(p / SIZE) });
        setView("encoded");
        return;
      }
    }
  }
  function download() {
    encodedCanvas.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ncc-pesan-rahasia.png";
      link.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
  }
  return (
    <MissionFrame
      index={0}
      onRestart={restart}
      hint={
        <>
          <p>1. Pilih gambar dan tulis pesan maksimal {limit} byte.</p>
          <p>
            2. Sisipkan pesan, lalu ketuk gambar untuk memeriksa piksel. Tombol
            arah juga bisa digunakan.
          </p>
          <p>
            3. Pilih Ungkap Pesan untuk membaca kembali pesan dari piksel hasil.
          </p>
          <p>
            Perubahan satu bit pada kanal RGB sangat kecil, sehingga gambar
            tampak hampir sama. Kanal transparansi (alpha) tetap utuh.
          </p>
        </>
      }
    >
      <p className="mission-lead">
        Sembunyikan pesan di dalam gambar. Lalu lihat: apakah mata kita bisa
        membedakannya?
      </p>
      {!available ? (
        <section className="panel">
          <h2>Canvas tidak tersedia di browser ini.</h2>
          <p>
            Misi piksel memerlukan Canvas 2D. Kamu tetap bisa mencoba misi
            lainnya.
          </p>
          <a href="#/misi" className="button primary">
            Pilih Misi Lain
          </a>
        </section>
      ) : (
        <>
          <div className="game-layout pixel-layout">
            <section className="pixel-workbench panel">
              <div className="panel-caption">
                <span className="mono">01 / MEJA PEMINDAI</span>
                <span className="status-pill">
                  {output ? "Pesan tersisip" : "Gambar asli"}
                </span>
              </div>
              <div
                className="segmented mobile-comparison"
                aria-label="Tampilan gambar"
              >
                <button
                  aria-pressed={view === "original"}
                  onClick={() => setView("original")}
                >
                  Asli
                </button>
                <button
                  disabled={!output}
                  aria-pressed={view === "encoded"}
                  onClick={() => setView("encoded")}
                >
                  Berisi Pesan
                </button>
              </div>
              <div className={`image-comparison showing-${view}`}>
                <figure className="original-figure">
                  <figcaption className="mono">GAMBAR ASLI</figcaption>
                  <canvas
                    ref={originalCanvas}
                    width={SIZE}
                    height={SIZE}
                    onClick={selectPixel}
                    aria-label="Gambar asli. Ketuk untuk memilih piksel; tersedia tombol arah di panel pembesar."
                    role="img"
                  />
                </figure>
                <figure className="encoded-figure">
                  <figcaption className="mono">
                    {output ? "BERISI PESAN" : "PRATINJAU HASIL"}
                  </figcaption>
                  <canvas
                    ref={encodedCanvas}
                    width={SIZE}
                    height={SIZE}
                    onClick={selectPixel}
                    aria-label="Gambar hasil penyisipan pesan. Ketuk untuk memilih piksel; tersedia tombol arah di panel pembesar."
                    role="img"
                  />
                </figure>
              </div>
              <p className="canvas-help">
                <Icon name="eye" size={16} /> Ketuk gambar untuk memeriksa
                pikselnya.
              </p>
              <div className="pixel-picker">
                {names.map((name, i) => (
                  <button
                    key={name}
                    className={kind === i ? "selected" : ""}
                    aria-pressed={kind === i}
                    onClick={() => {
                      setKind(i);
                      setPoint({ x: 0, y: 0 });
                      invalidate();
                    }}
                  >
                    <span className={`image-swatch swatch-${i}`} />
                    {name}
                  </button>
                ))}
              </div>
            </section>
            <aside className="panel message-panel">
              <span className="step-label mono">02 / PESAN RAHASIAMU</span>
              <label htmlFor="secret">Apa yang ingin kamu sembunyikan?</label>
              <textarea
                id="secret"
                value={message}
                rows={3}
                aria-describedby="byte-count"
                onChange={(e) => {
                  setMessage(e.target.value);
                  invalidate();
                }}
                placeholder="Tulis pesan pendek…"
              />
              <p
                id="byte-count"
                className={`byte-count ${bytes > limit ? "over-limit" : ""}`}
              >
                {bytes} / {limit} byte UTF-8
              </p>
              {bytes > limit && (
                <p role="alert">
                  Pesan terlalu panjang. Kurangi {bytes - limit} byte untuk
                  melanjutkan.
                </p>
              )}
              <button
                className="button primary full"
                disabled={!message.trim() || bytes > limit}
                onClick={insert}
              >
                <Icon name="spark" /> Sisipkan Pesan
              </button>
              <button
                className="button secondary full"
                disabled={!output}
                onClick={reveal}
              >
                <Icon name="eye" /> Ungkap Pesan
              </button>
              <p className="small-note">
                Bukan sulap: satu bit terakhir pada sebagian kanal RGB diganti
                untuk membawa pesanmu.
              </p>
              <div className="feedback" role="status">
                {feedback ||
                  "Gambar sudah siap. Mulai dengan menyisipkan pesan."}
              </div>
            </aside>
          </div>
          <section className="pixel-inspector panel">
            <div>
              <p className="eyebrow">LIHAT LEBIH DEKAT</p>
              <h2>Satu piksel, cerita berbeda.</h2>
              <p>
                Pilih piksel pada gambar atau gunakan tombol arah. Grid
                menampilkan data gambar yang dipilih.
              </p>
              <div className="segmented" aria-label="Sumber data pembesar">
                <button
                  aria-pressed={view === "original"}
                  onClick={() => setView("original")}
                >
                  Asli
                </button>
                <button
                  aria-pressed={view === "encoded"}
                  disabled={!output}
                  onClick={() => setView("encoded")}
                >
                  Berisi Pesan
                </button>
              </div>
              <button
                className="text-link"
                disabled={!output}
                onClick={findChanged}
              >
                Lihat Piksel yang Berubah <Icon name="arrow" size={16} />
              </button>
            </div>
            <div className="magnifier">
              <canvas
                ref={zoom}
                width={210}
                height={210}
                aria-label={`Pembesaran piksel ${point.x}, ${point.y}`}
                role="img"
              />
              <span className="mono">
                GRID 7 × 7 / {view === "original" ? "ASLI" : "HASIL"}
              </span>
            </div>
            <div className="pixel-values">
              <p className="mono">
                KOORDINAT ({point.x}, {point.y})
              </p>
              <dl>
                {["R", "G", "B"].map((c, i) => (
                  <div key={c}>
                    <dt>{c}</dt>
                    <dd>
                      {original[index + i]} <span>→</span>{" "}
                      <b>{output ? output[index + i] : "—"}</b>
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
                    className="icon-button"
                    key={d.label}
                    aria-label={d.label}
                    onClick={() =>
                      setPoint((p) => ({
                        x: Math.max(0, Math.min(SIZE - 1, p.x + d.x)),
                        y: Math.max(0, Math.min(SIZE - 1, p.y + d.y)),
                      }))
                    }
                  >
                    <Icon name={d.name} />
                  </button>
                ))}
              </div>
              {changedChannel !== undefined && output && (
                <p className="bit-example mono">
                  {original[index + changedChannel]
                    .toString(2)
                    .padStart(8, "0")}
                  <br />↓<br />
                  {output[index + changedChannel].toString(2).padStart(8, "0")}
                  <br />
                  <span>Hanya bit terakhir berubah.</span>
                </p>
              )}
            </div>
          </section>
          {revealed !== null && (
            <>
              <Result index={0}>
                <div className="decoded-message">
                  <span className="mono">PESAN TERUNGKAP DARI PIKSEL</span>
                  <p>{revealed}</p>
                </div>
              </Result>
              <div className="button-row after-result">
                <button className="button secondary" onClick={restart}>
                  <Icon name="reset" /> Main Lagi
                </button>
                <button className="button secondary" onClick={download}>
                  Unduh PNG
                </button>
                <p className="small-note">
                  Gunakan PNG. Konversi ke JPEG dapat merusak pesan.
                </p>
              </div>
            </>
          )}
        </>
      )}
    </MissionFrame>
  );
}
