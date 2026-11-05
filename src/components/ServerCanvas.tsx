import { useEffect, useRef } from "react";
import type { ServerState } from "../core/server";
export default function ServerCanvas({
  state,
  paused,
}: {
  state: ServerState;
  paused: boolean;
}) {
  const canvas = useRef<HTMLCanvasElement>(null),
    data = useRef(state),
    repaint = useRef<(() => void) | null>(null);
  data.current = state;
  useEffect(() => {
    const el = canvas.current!,
      ctx = el.getContext("2d");
    if (!ctx) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0,
      phase = 0,
      last = 0;
    const W = 720,
      H = 380,
      dpr = Math.min(devicePixelRatio || 1, 2);
    el.width = W * dpr;
    el.height = H * dpr;
    ctx.scale(dpr, dpr);
    const line = (points: number[][], color: string, width = 1) => {
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
    };
    const polygon = (points: number[][], fill: string, stroke = "#4876B8") => {
      ctx.beginPath();
      points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = stroke;
      ctx.stroke();
    };
    const text = (
      value: string,
      x: number,
      y: number,
      color = "#A99CD5",
      size = 11,
    ) => {
      ctx.font = `${size}px monospace`;
      ctx.fillStyle = color;
      ctx.textAlign = "center";
      ctx.fillText(value, x, y);
    };
    function draw(now: number) {
      const s = data.current,
        n = s.queues.length;
      if (!paused && !media.matches && last) phase += (now - last) / 1000;
      last = now;
      ctx!.clearRect(0, 0, W, H);
      ctx!.strokeStyle = "#293A81";
      ctx!.globalAlpha = 0.35;
      for (let x = 0; x < W; x += 30)
        line(
          [
            [x, 0],
            [x, H],
          ],
          "#293A81",
        );
      for (let y = 0; y < H; y += 30)
        line(
          [
            [0, y],
            [W, y],
          ],
          "#293A81",
        );
      ctx!.globalAlpha = 1;
      const lb = [360, 112],
        positions = Array.from({ length: n }, (_, i) =>
          n === 1 ? 360 : 100 + (i * 520) / (n - 1),
        );
      for (let u = 0; u < 7; u++) {
        const ux = 180 + u * 60;
        ctx!.beginPath();
        ctx!.arc(ux, 24, 5, 0, Math.PI * 2);
        ctx!.fillStyle = "#A99CD5";
        ctx!.fill();
        line(
          [
            [ux - 8, 44],
            [ux - 8, 38],
            [ux + 8, 38],
            [ux + 8, 44],
          ],
          "#4876B8",
          2,
        );
        line(
          [
            [ux, 51],
            [ux, 67],
            [360, 67],
            [360, 90],
          ],
          "#293A81",
        );
      }
      text(
        `${s.users} PENGGUNA / ${s.users} PERMINTAAN PER DETIK`,
        360,
        9,
        "#A99CD5",
        10,
      );
      positions.forEach((x, i) => {
        const active = s.distribution === "even" || i === 0;
        line(
          [
            [360, 134],
            [360, 163],
            [x, 163],
            [x, 221],
          ],
          active ? "#4876B8" : "#293A81",
          active ? 2 : 1,
        );
        if (active) {
          const rate = s.distribution === "even" ? s.users / n : s.users;
          const count = Math.min(7, Math.ceil(rate / 8));
          for (let p = 0; p < count; p++) {
            const progress = (phase * 0.45 + p / Math.max(1, count)) % 1;
            const points = [
              [360, 134],
              [360, 163],
              [x, 163],
              [x, 221],
            ];
            const lengths = [29, Math.abs(x - 360), 58],
              total = lengths.reduce((a, b) => a + b, 0);
            let distance = progress * total;
            for (let seg = 0; seg < 3; seg++) {
              if (distance <= lengths[seg] || seg === 2) {
                const t = lengths[seg] ? distance / lengths[seg] : 0;
                ctx!.fillStyle = "#FF3B86";
                ctx!.fillRect(
                  points[seg][0] +
                    (points[seg + 1][0] - points[seg][0]) * t -
                    3,
                  points[seg][1] +
                    (points[seg + 1][1] - points[seg][1]) * t -
                    3,
                  6,
                  6,
                );
                break;
              }
              distance -= lengths[seg];
            }
          }
        }
        const load = s.loads[i];
        polygon(
          [
            [x - 31, 232],
            [x, 216],
            [x + 36, 234],
            [x + 5, 250],
          ],
          "#4876B8",
        );
        polygon(
          [
            [x - 31, 232],
            [x + 5, 250],
            [x + 5, 323],
            [x - 31, 305],
          ],
          "#293A81",
        );
        polygon(
          [
            [x + 5, 250],
            [x + 36, 234],
            [x + 36, 307],
            [x + 5, 323],
          ],
          "#0E1D5A",
        );
        for (let slot = 0; slot < 3; slot++) {
          line(
            [
              [x - 24, 249 + slot * 19],
              [x - 2, 260 + slot * 19],
            ],
            "#A99CD5",
            2,
          );
          ctx!.fillStyle = load > 0.85 ? "#FF3B86" : "#E5D6F7";
          ctx!.fillRect(x + 13, 258 + slot * 18, 4, 4);
        }
        ctx!.fillStyle = "#293A81";
        ctx!.fillRect(x - 32, 340, 68, 4);
        ctx!.fillStyle = load > 0.85 ? "#FF3B86" : "#4876B8";
        ctx!.fillRect(x - 32, 340, 68 * load, 4);
        text(`SERVER ${i + 1}`, x, 365, "#E5D6F7");
        text(
          `${Math.round(load * 100)}%`,
          x,
          205,
          load > 0.85 ? "#FF3B86" : "#A99CD5",
        );
      });
      polygon(
        [
          [360, 84],
          [394, 111],
          [360, 138],
          [326, 111],
        ],
        "#293A81",
        "#A99CD5",
      );
      line(
        [
          [345, 108],
          [375, 108],
          [369, 102],
        ],
        "#E5D6F7",
        2,
      );
      line(
        [
          [375, 116],
          [345, 116],
          [351, 122],
        ],
        "#FF3B86",
        2,
      );
      text("LOAD BALANCER", 480, 113, "#A99CD5", 10);
      if (!paused && !media.matches) frame = requestAnimationFrame(draw);
    }
    repaint.current = () => {
      if (paused || media.matches) draw(performance.now());
    };
    draw(performance.now());
    const changed = () => {
      cancelAnimationFrame(frame);
      last = 0;
      draw(performance.now());
    };
    media.addEventListener("change", changed);
    return () => {
      cancelAnimationFrame(frame);
      media.removeEventListener("change", changed);
      repaint.current = null;
    };
  }, [paused]);
  useEffect(() => {
    repaint.current?.();
  }, [state]);
  return (
    <canvas
      ref={canvas}
      className="server-canvas"
      role="img"
      aria-label={`${state.users} pengguna mengirim permintaan melalui load balancer ke ${state.queues.length} server. Distribusi ${state.distribution === "even" ? "merata" : "menumpuk di server pertama"}. Detail beban dan antrean tersedia di bawah visual.`}
    />
  );
}
