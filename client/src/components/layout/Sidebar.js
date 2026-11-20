import React from "react";
import { NavLink } from "react-router-dom";
import {
  MdOutlineInventory2, MdOutlineBarChart, MdOutlineFavoriteBorder,
  MdOutlineLocalHospital, MdOutlineBusiness, MdOutlineHistory,
  MdOutlineDashboard, MdOutlineOutbox,
} from "react-icons/md";

const MENUS = {
  organisation: [
    { to: "/", label: "Stock", icon: MdOutlineInventory2, end: true },
    { to: "/analytics", label: "Niveaux par groupe", icon: MdOutlineBarChart },
    { to: "/donar", label: "Donneurs", icon: MdOutlineFavoriteBorder },
    { to: "/hospital", label: "Hôpitaux", icon: MdOutlineLocalHospital },
  ],
  donar: [
    { to: "/donation", label: "Mes dons", icon: MdOutlineHistory },
    { to: "/organisation", label: "Organisations", icon: MdOutlineBusiness },
  ],
  hospital: [
    { to: "/consumer", label: "Poches reçues", icon: MdOutlineOutbox },
    { to: "/organisation", label: "Organisations", icon: MdOutlineBusiness },
  ],
  admin: [
    { to: "/admin", label: "Vue d'ensemble", icon: MdOutlineDashboard, end: true },
    { to: "/donar-list", label: "Donneurs", icon: MdOutlineFavoriteBorder },
    { to: "/hospital-list", label: "Hôpitaux", icon: MdOutlineLocalHospital },
    { to: "/org-list", label: "Organisations", icon: MdOutlineBusiness },
  ],
};

const Sidebar = ({ role, onNavigate }) => (
  <nav className="nav" aria-label="Navigation principale">
    {(MENUS[role] || []).map(({ to, label, icon: Icon, end }) => (
      <NavLink key={to} to={to} end={end} onClick={onNavigate} className={({ isActive }) => (isActive ? "nav-link on" : "nav-link")}>
        <Icon size={20} />
        {label}
      </NavLink>
    ))}
  </nav>
);

export default Sidebar;
