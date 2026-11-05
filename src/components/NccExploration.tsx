import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { careerPaths, learningFields } from "../data/ncc-exploration";
import { Icon } from "./Visuals";

function Glyph({ kind }: { kind: string }) {
  if (kind === "network")
    return (
      <>
        <rect x="18" y="4" width="28" height="20" rx="3" />
        <path d="M32 24v13M10 37h44M10 37v10m44-10v10M32 37v10" />
        <rect x="1" y="47" width="18" height="13" rx="2" />
        <rect x="23" y="47" width="18" height="13" rx="2" />
        <rect x="45" y="47" width="18" height="13" rx="2" />
      </>
    );
  if (kind === "security")
    return (
      <>
        <path d="m32 3 23 9v18c0 15-23 29-23 29S9 45 9 30V12Z" />
        <rect x="22" y="25" width="20" height="18" rx="3" />
        <path d="M26 25v-5a6 6 0 0 1 12 0v5m-6 8v4" />
      </>
    );
  if (kind === "cloud")
    return (
      <>
        <path d="M15 36a13 13 0 1 1 1-26 17 17 0 0 1 31 4 11 11 0 1 1 4 22" />
        <rect x="14" y="31" width="36" height="28" rx="3" />
        <path d="M14 45h36m-29-7h14m-14 14h14m8-15v2m0 12v2" />
      </>
    );
  if (kind === "forensics")
    return (
      <>
        <path d="M10 5h29l10 10v16M38 5v12h11M18 25h17m-17 8h10M10 5v49h19" />
        <circle cx="41" cy="41" r="13" />
        <path d="m50 51 10 10m-25-20 4 4 8-9" />
      </>
    );
  if (kind === "reliability")
    return (
      <>
        <rect x="3" y="7" width="58" height="44" rx="4" />
        <path d="M20 60h24m-12-9v9M9 33h10l7-15 9 24 7-13h13" />
      </>
    );
  return (
    <>
      <rect x="2" y="8" width="60" height="43" rx="4" />
      <path d="M2 20h60M10 14h1m6 0h1m-5 15 8 7-8 7m14 0h15M22 60h20m-10-9v9" />
    </>
  );
}

function SvgButton({
  x,
  y,
  width = 140,
  height = 110,
  label,
  pressed,
  onSelect,
  children,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  label: string;
  pressed: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}) {
  return (
    <g
      transform={`translate(${x} ${y})`}
      className={`exploration-hotspot ${pressed ? "selected" : ""}`}
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={pressed}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <rect width={width} height={height} rx="10" className="hotspot-surface" />
      {children}
    </g>
  );
}

export default function NccExploration() {
  const [field, setField] = useState(0),
    [career, setCareer] = useState(0),
    [visible, setVisible] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const uid = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    if (!root.current) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(root.current);
    return () => observer.disconnect();
  }, []);
  const animate = visible && !reducedMotion;
  const paths = [
    "M110 140V200H300",
    "M490 140V200H300",
    "M110 260V220H300",
    "M490 260V220H300",
  ];
  const selectedField = learningFields[field],
    selectedCareer = careerPaths[career];
  return (
    <div className="ncc-exploration" ref={root}>
      <section
        className="learning-section container"
        aria-labelledby={`${uid}-learning-title`}
      >
        <div className="exploration-heading">
          <div>
            <p className="eyebrow">DI BALIK TIGA MISIMU</p>
            <h2 id={`${uid}-learning-title`}>
              Belajar apa <span>di NCC?</span>
            </h2>
          </div>
          <p>
            Mulai dari perangkat yang saling terhubung, sampai jejak yang
            tertinggal di dunia digital. Ketuk bidangnya untuk menjelajah.
          </p>
        </div>
        <div className="learning-layout">
          <div className="learning-illustration">
            <div className="illustration-caption mono">
              <span>INTERACTIVE / EXPLORE THE LAB</span>
              <span>04 BIDANG</span>
            </div>
            <svg
              viewBox="0 0 600 400"
              role="group"
              aria-label="Peta interaktif bidang belajar NCC"
              className="learning-network"
            >
              <g aria-hidden="true">
                <ellipse
                  cx="300"
                  cy="210"
                  rx="245"
                  ry="150"
                  fill="none"
                  stroke="#293A81"
                  strokeDasharray="4 9"
                />
                {paths.map((d, i) => (
                  <path
                    key={d}
                    d={d}
                    fill="none"
                    stroke={field === i ? "#FF3B86" : "#4876B8"}
                    strokeWidth={field === i ? 3 : 1.5}
                    opacity={field === i ? 1 : 0.45}
                  />
                ))}
                <rect
                  x="240"
                  y="165"
                  width="120"
                  height="90"
                  rx="15"
                  fill="#0E1D5A"
                  stroke="#A99CD5"
                />
                <text
                  x="300"
                  y="208"
                  textAnchor="middle"
                  fill="#E5D6F7"
                  fontSize="29"
                  fontFamily="Space Grotesk, sans-serif"
                  fontWeight="600"
                >
                  NCC
                </text>
                <text
                  x="300"
                  y="230"
                  textAnchor="middle"
                  fill="#A99CD5"
                  fontSize="9"
                  letterSpacing="2"
                >
                  CONNECTED LAB
                </text>
                {animate && (
                  <circle r="5" fill="#FF3B86">
                    <animateMotion
                      key={field}
                      dur="2.6s"
                      repeatCount="indefinite"
                      path={paths[field]}
                    />
                  </circle>
                )}
              </g>
              {learningFields.map((item, i) => (
                <SvgButton
                  key={item.name}
                  x={i % 2 === 0 ? 40 : 420}
                  y={i < 2 ? 30 : 260}
                  label={`${item.name}: jelajahi bidang`}
                  pressed={field === i}
                  onSelect={() => setField(i)}
                >
                  <g
                    transform="translate(48 13) scale(.7)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <Glyph kind={item.glyph} />
                  </g>
                  <text
                    x="70"
                    y="87"
                    textAnchor="middle"
                    fill="currentColor"
                    fontFamily="DM Sans, sans-serif"
                    fontSize="14"
                    aria-hidden="true"
                  >
                    {item.name}
                  </text>
                </SvgButton>
              ))}
            </svg>
            <p className="small-note">
              Pilih simpul dengan sentuhan, klik, atau tombol Tab lalu Enter.
            </p>
          </div>
          <div className="learning-copy">
            <span className="mono exploration-count">
              BIDANG / 0{field + 1}
            </span>
            <h3>{selectedField.name}</h3>
            <p className="learning-tagline">{selectedField.label}</p>
            <p>{selectedField.description}</p>
            <div className="learning-example" aria-live="polite">
              <Icon name="spark" size={18} />
              <p>{selectedField.illustration}</p>
            </div>
            <div className="learning-choices" aria-label="Pilih bidang belajar">
              {learningFields.map((item, i) => (
                <button
                  key={item.name}
                  aria-pressed={field === i}
                  onClick={() => setField(i)}
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section
        className="career-section container"
        aria-labelledby={`${uid}-career-title`}
      >
        <div className="exploration-heading">
          <div>
            <p className="eyebrow">NCC CAREER PROSPECT</p>
            <h2 id={`${uid}-career-title`}>
              Keahlian hari ini.
              <br />
              <span>Peluangmu esok hari.</span>
            </h2>
          </div>
          <p>
            Pilih profesinya untuk melihat ilustrasi dan pekerjaan yang
            dilakukan.
          </p>
        </div>
        <div className="career-layout">
          <div className="career-visual">
            <div className="illustration-caption mono">
              <span>CAREER CONSOLE</span>
              <span>0{career + 1} / 05</span>
            </div>
            <svg
              viewBox="0 0 600 400"
              role="group"
              aria-label="Konsol interaktif prospek karier NCC"
              className="career-console"
            >
              <g aria-hidden="true">
                <path
                  d="m65 220 235-60 235 60-235 75Z"
                  fill="#0E1D5A"
                  stroke="#293A81"
                />
                <rect
                  x="85"
                  y="28"
                  width="430"
                  height="193"
                  rx="12"
                  fill="#080613"
                  stroke="#4876B8"
                />
                <path d="M85 57h430" stroke="#293A81" />
                <circle cx="104" cy="43" r="3" fill="#FF3B86" />
                <circle cx="116" cy="43" r="3" fill="#A99CD5" />
                <circle cx="128" cy="43" r="3" fill="#4876B8" />
                <text
                  x="490"
                  y="47"
                  textAnchor="end"
                  fill="#A99CD5"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {selectedCareer.short} / ACTIVE
                </text>
                <path
                  d="M180 128H420"
                  stroke="#4876B8"
                  strokeWidth="2"
                  strokeDasharray="4 5"
                />
                {[0, 1, 2].map((i) => (
                  <g key={`${career}-${i}`}>
                    <rect
                      x={132 + i * 120}
                      y="83"
                      width="96"
                      height="85"
                      rx="8"
                      fill="#0E1D5A"
                      stroke={i === 1 ? "#FF3B86" : "#293A81"}
                    />
                    <g
                      transform={`translate(${158 + i * 120} 94) scale(.7)`}
                      fill="none"
                      stroke={i === 1 ? "#E5D6F7" : "#A99CD5"}
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <Glyph
                        kind={
                          i === 1
                            ? selectedCareer.glyph
                            : i === 0
                              ? "network"
                              : "reliability"
                        }
                      />
                    </g>
                    <text
                      x={180 + i * 120}
                      y="191"
                      textAnchor="middle"
                      fill="#A99CD5"
                      fontSize="8"
                      fontFamily="monospace"
                    >
                      {selectedCareer.stages[i]}
                    </text>
                  </g>
                ))}
                {animate && (
                  <rect width="7" height="7" x="-3.5" y="-3.5" fill="#FF3B86">
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path="M180 128H420"
                    />
                  </rect>
                )}
              </g>
              {careerPaths.map((item, i) => (
                <SvgButton
                  key={item.name}
                  x={15 + i * 116}
                  y={282}
                  width={106}
                  height={100}
                  label={`${item.name}: lihat prospek`}
                  pressed={career === i}
                  onSelect={() => setCareer(i)}
                >
                  <g
                    transform="translate(31 12) scale(.7)"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <Glyph kind={item.glyph} />
                  </g>
                  <text
                    x="53"
                    y="83"
                    textAnchor="middle"
                    fill="currentColor"
                    fontSize="11"
                    fontFamily="monospace"
                    aria-hidden="true"
                  >
                    0{i + 1}
                  </text>
                </SvgButton>
              ))}
            </svg>
            <h3>{selectedCareer.name}</h3>
            <p>{selectedCareer.lead}</p>
            <span className="mono career-visual-note">
              PILIH IKON ATAU BUKA DAFTAR PROFESI
            </span>
          </div>
          <div className="career-list">
            {careerPaths.map((item, i) => (
              <article
                key={item.name}
                className={`career-row ${career === i ? "selected" : ""}`}
              >
                <h3>
                  <button
                    id={`${uid}-career-button-${i}`}
                    aria-expanded={career === i}
                    aria-controls={`${uid}-career-details-${i}`}
                    onClick={() => setCareer(i)}
                  >
                    <span className="mono">0{i + 1}</span>
                    <span>{item.name}</span>
                    <Icon name={career === i ? "minus" : "plus"} size={19} />
                  </button>
                </h3>
                <div
                  id={`${uid}-career-details-${i}`}
                  role="region"
                  aria-labelledby={`${uid}-career-button-${i}`}
                  hidden={career !== i}
                >
                  <ul>
                    {item.responsibilities.map((task) => (
                      <li key={task}>{task}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
        <p className="exploration-source">
          Diadaptasi dari materi Safari Lab NCC 2026. Ilustrasi membantu
          menjelaskan bidang dan profesi yang diperkenalkan.
        </p>
      </section>
    </div>
  );
}
