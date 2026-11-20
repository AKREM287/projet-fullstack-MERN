import React from "react";

export const DropMark = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16 2.5c4.6 6.1 9 10.6 9 16a9 9 0 0 1-18 0c0-5.4 4.4-9.9 9-16Z" fill="#e8394f" />
    <path d="M11.2 19.5a4.9 4.9 0 0 0 3.6 4.7" stroke="#fff" strokeOpacity=".75" strokeWidth="2" strokeLinecap="round" fill="none" />
  </svg>
);

const Logo = ({ light }) => (
  <span className={`logo ${light ? "logo-light" : ""}`}>
    <DropMark />
    <span className="logo-word">Red Gold</span>
  </span>
);

export default Logo;
