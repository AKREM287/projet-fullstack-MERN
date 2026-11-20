import React from "react";
import Logo from "./Logo";
import Vial from "./Vial";
import { BLOOD_GROUPS } from "../../utils/blood";

// Niveaux décoratifs du portoir de tubes
const LEVELS = [0.82, 0.38, 0.64, 0.22, 0.5, 0.74, 0.3, 0.58];

const AuthShell = ({ title, subtitle, children }) => (
  <div className="auth">
    <section className="auth-art" aria-hidden="true">
      <Logo light />
      <div className="auth-copy">
        <h2>Chaque poche compte.</h2>
        <p>Suivez les dons, le stock par groupe sanguin et les livraisons aux hôpitaux au même endroit.</p>
      </div>
      <div className="rack">
        {BLOOD_GROUPS.map((g, i) => (
          <Vial key={g} group={g} level={LEVELS[i]} width={44} />
        ))}
      </div>
    </section>
    <section className="auth-panel">
      <div className="auth-card">
        <div className="auth-mobile-logo"><Logo /></div>
        <h1>{title}</h1>
        <p className="auth-sub">{subtitle}</p>
        {children}
      </div>
    </section>
  </div>
);

export default AuthShell;
