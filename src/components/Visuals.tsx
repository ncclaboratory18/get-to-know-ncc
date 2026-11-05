import { useId } from "react";

export function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    arrow: "M4 12h16m-6-6 6 6-6 6",
    back: "M20 12H4m6-6-6 6 6 6",
    check: "m5 12 4 4L19 6",
    close: "m6 6 12 12M6 18 18 6",
    reset: "M4 10a8 8 0 1 1 2 8M4 4v6h6",
    info: "M12 11v6m0-10v1",
    eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Zm10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6",
    up: "m6 14 6-6 6 6",
    down: "m6 10 6 6 6-6",
    plus: "M12 5v14M5 12h14",
    minus: "M5 12h14",
    external: "M14 3h7v7m0-7L10 14M10 3H3v18h18v-7",
    spark: "m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z",
    flag: "M5 22V3h14l-3 5 3 5H5",
    pause: "M8 5v14M16 5v14",
    play: "m8 4 12 8-12 8V4Z",
    shield: "M12 2 3 6v6c0 5 9 10 9 10s9-5 9-10V6l-9-4Z",
    warning: "M12 3 22 21H2L12 3Zm0 6v5m0 3v1",
    packet: "M3 5h18v14H3V5Zm0 0 9 7 9-7",
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={paths[name] || paths.spark} />
    </svg>
  );
}

export function MissionArt({
  kind,
  compact = false,
}: {
  kind: number;
  compact?: boolean;
}) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg
      viewBox="0 0 360 240"
      className={`mission-art ${compact ? "compact" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={uid} x2="1" y2="1">
          <stop stopColor="#293A81" />
          <stop offset="1" stopColor="#0E1D5A" />
        </linearGradient>
      </defs>
      <ellipse
        cx="180"
        cy="205"
        rx="126"
        ry="23"
        fill="#080613"
        opacity=".35"
      />
      {kind === 0 ? (
        <g>
          <path
            d="m53 62 174-24 22 138-174 25Z"
            fill={`url(#${uid})`}
            stroke="#4876B8"
          />
          <path d="m67 74 147-20 15 97-147 20Z" fill="#0E1D5A" />
          <path d="m83 143 30-43 30 21 29-38 47 62Z" fill="#4876B8" />
          <circle cx="105" cy="92" r="10" fill="#FF3B86" />
          <path d="m91 182 100-14" stroke="#A99CD5" strokeWidth="4" />
          <circle
            cx="230"
            cy="123"
            r="46"
            fill="#080613"
            stroke="#A99CD5"
            strokeWidth="7"
          />
          {[0, 1, 2, 3, 4].map((y) =>
            [0, 1, 2, 3, 4].map((x) => (
              <rect
                key={`${x}${y}`}
                x={201 + x * 12}
                y={94 + y * 12}
                width="10"
                height="10"
                fill={
                  ["#293A81", "#4876B8", "#A99CD5", "#FF3B86"][(x + y * 2) % 4]
                }
              />
            )),
          )}
          <path
            d="m262 158 28 35"
            stroke="#FF3B86"
            strokeWidth="15"
            strokeLinecap="round"
          />
          <path d="M285 47v20m-10-10h20" stroke="#A99CD5" strokeWidth="2" />
        </g>
      ) : kind === 1 ? (
        <g>
          <path
            d="m65 62 79-10 15 15 95-9 16 132-187 20Z"
            fill="#293A81"
            stroke="#4876B8"
          />
          <path
            d="m85 50 161 12-10 137-161-12Z"
            fill="#0E1D5A"
            stroke="#A99CD5"
          />
          <path
            d="m107 85 72 6m-74 13 111 8m-113 13 70 5"
            stroke="#4876B8"
            strokeWidth="4"
          />
          <circle cx="193" cy="151" r="20" fill="#293A81" stroke="#FF3B86" />
          <path
            d="m184 151 6 6 13-14"
            fill="none"
            stroke="#E5D6F7"
            strokeWidth="3"
          />
          <path
            d="m136 140-25 33 153-10 26-62"
            fill="none"
            stroke="#FF3B86"
            strokeDasharray="4 7"
            strokeWidth="2"
          />
          <circle cx="111" cy="173" r="5" fill="#FF3B86" />
          <circle cx="264" cy="163" r="5" fill="#FF3B86" />
          <path d="m267 87 35 6-5 41-35-6Z" fill="#293A81" stroke="#A99CD5" />
          <path d="m273 100 19 3m-20 6 18 3" stroke="#A99CD5" strokeWidth="2" />
        </g>
      ) : (
        <g>
          <path
            d="m52 167 126-66 130 62-126 67Z"
            fill="#0E1D5A"
            stroke="#293A81"
          />
          <path
            d="m92 175 89-45 84 40m-84-40v71"
            fill="none"
            stroke="#4876B8"
            strokeWidth="2"
          />
          {[0, 1, 2].map((n) => (
            <g
              key={n}
              transform={`translate(${70 + n * 76} ${n === 1 ? 47 : 81})`}
            >
              <path d="m0 14 26-14 39 19-26 15Z" fill="#4876B8" />
              <path d="m0 14 39 20v79L0 93Z" fill="#293A81" stroke="#4876B8" />
              <path
                d="m39 34 26-15v79l-26 15Z"
                fill="#0E1D5A"
                stroke="#4876B8"
              />
              {[0, 1, 2].map((i) => (
                <g key={i}>
                  <path
                    d={`m8 ${37 + i * 22} 23 11`}
                    stroke="#A99CD5"
                    strokeWidth="3"
                  />
                  <circle cx="29" cy={46 + i * 22} r="2" fill="#FF3B86" />
                </g>
              ))}
            </g>
          ))}
          <circle cx="181" cy="201" r="5" fill="#FF3B86" />
        </g>
      )}
    </svg>
  );
}

export function Badge({
  kind,
  earned = true,
  small = false,
}: {
  kind: number;
  earned?: boolean;
  small?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 120 130"
      className={`badge-art ${small ? "small" : ""} ${earned ? "" : "unearned"}`}
      aria-hidden="true"
    >
      <path
        d="m60 4 49 27v57l-49 37L11 88V31Z"
        fill="#0E1D5A"
        stroke={earned ? "#FF3B86" : "#4876B8"}
        strokeWidth="2"
      />
      <path
        d="m60 13 41 23v47l-41 31-41-31V36Z"
        fill="#293A81"
        stroke="#4876B8"
      />
      {kind === 0 ? (
        <g fill="none" stroke="#E5D6F7" strokeWidth="4">
          <rect x="35" y="39" width="39" height="34" rx="3" />
          <circle cx="66" cy="65" r="15" fill="#293A81" />
          <path d="m77 77 12 13" />
          <path d="M43 49h8m-8 9h8" stroke="#FF3B86" />
        </g>
      ) : kind === 1 ? (
        <g fill="none" stroke="#E5D6F7" strokeWidth="3">
          <path d="M39 34h31l11 11v43H39Z" />
          <path d="M69 34v13h12M47 55h24m-24 9h13" />
          <path d="m49 77 7 7 15-16" stroke="#FF3B86" />
        </g>
      ) : (
        <g fill="none" stroke="#E5D6F7" strokeWidth="3">
          <rect x="34" y="36" width="52" height="47" rx="4" />
          <path d="M34 52h52M34 68h52M43 44h19m-19 16h19m-19 16h19" />
          <path d="M76 43v2m0 14v2m0 14v2" stroke="#FF3B86" />
        </g>
      )}
      <path
        d="m48 100 12 6 12-6"
        fill="none"
        stroke="#A99CD5"
        strokeWidth="2"
      />
    </svg>
  );
}
