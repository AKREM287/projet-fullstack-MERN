import React, { useEffect, useState } from "react";
import { groupColor } from "../../utils/blood";

const INNER = 126; // hauteur utile du tube

/** Tube à essai : le niveau (0 → 1) monte au chargement. */
const Vial = ({ group, level = 0, width = 64, low = false }) => {
  const [shown, setShown] = useState(0);
  const c = groupColor(group);
  const id = `tube-${group.replace(/[^A-Z]/gi, "")}${group.endsWith("-") ? "n" : "p"}`;

  useEffect(() => {
    const t = setTimeout(() => setShown(Math.max(0, Math.min(1, level))), 80);
    return () => clearTimeout(t);
  }, [level]);

  return (
    <svg
      className="vial"
      width={width}
      viewBox="0 0 60 172"
      role="img"
      aria-label={`Tube ${group}, remplissage ${Math.round(level * 100)} %`}
    >
      <defs>
        <clipPath id={id}>
          <path d="M14 34V144a16 16 0 0 0 32 0V34Z" />
        </clipPath>
      </defs>
      <path d="M14 34V144a16 16 0 0 0 32 0V34Z" fill="#f7fafc" />
      <g clipPath={`url(#${id})`}>
        <g
          style={{
            transform: `translateY(${(1 - shown) * INNER}px)`,
            transition: "transform 1.2s cubic-bezier(.2,.8,.2,1)",
          }}
        >
          <rect x="10" y="34" width="40" height="160" fill={low ? "#d4243f" : "#a30f2c"} />
          <rect x="10" y="34" width="40" height="3" fill="#fff" fillOpacity=".25" />
        </g>
      </g>
      {[0.25, 0.5, 0.75].map((t) => (
        <line key={t} x1="14" x2={t === 0.5 ? 26 : 22} y1={34 + INNER * (1 - t)} y2={34 + INNER * (1 - t)} stroke="#5e6b7b" strokeOpacity=".55" />
      ))}
      <path d="M14 34V144a16 16 0 0 0 32 0V34" fill="none" stroke="#5e6b7b" strokeWidth="1.6" />
      <rect x="9" y="10" width="42" height="26" rx="6" fill={c.bg} stroke={c.border || "rgba(0,0,0,.18)"} />
      <rect x="9" y="28" width="42" height="3" fill="rgba(0,0,0,.12)" />
      <text x="30" y="27" textAnchor="middle" fontSize="13" fontWeight="700" fill={c.fg} fontFamily="Bricolage Grotesque, sans-serif">
        {group}
      </text>
    </svg>
  );
};

export default Vial;
