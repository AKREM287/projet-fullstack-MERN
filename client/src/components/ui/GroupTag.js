import React from "react";
import { groupColor } from "../../utils/blood";

const GroupTag = ({ group, onClick, selected }) => {
  const c = groupColor(group);
  const inner = (
    <>
      <i style={{ background: c.bg, borderColor: c.border || "rgba(0,0,0,.2)" }} />
      {group}
    </>
  );
  if (!onClick) return <span className="gtag">{inner}</span>;
  return (
    <button type="button" className={`gtag gtag-btn ${selected ? "gtag-on" : ""}`} onClick={onClick} aria-pressed={!!selected}>
      {inner}
    </button>
  );
};

export default GroupTag;
