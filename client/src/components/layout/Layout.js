import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { MdLogout, MdMenu, MdClose } from "react-icons/md";
import toast from "react-hot-toast";
import Logo from "../ui/Logo";
import Sidebar from "./Sidebar";
import { logout } from "../../redux/features/auth/authSlice";
import { displayName, roleLabel } from "../../utils/blood";

const Layout = ({ children }) => {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Vous êtes déconnecté");
    navigate("/login");
  };

  return (
    <div className="shell">
      <aside className={`side ${open ? "side-open" : ""}`}>
        <div className="side-top">
          <Logo light />
          <button className="icon-btn side-close" onClick={() => setOpen(false)} aria-label="Fermer le menu">
            <MdClose size={22} />
          </button>
        </div>
        <Sidebar role={user?.role} onNavigate={() => setOpen(false)} />
        <div className="side-user">
          <div>
            <strong>{displayName(user)}</strong>
            <span>{roleLabel[user?.role]}</span>
          </div>
          <button className="icon-btn" onClick={handleLogout} aria-label="Se déconnecter" title="Se déconnecter">
            <MdLogout size={20} />
          </button>
        </div>
      </aside>

      <div className="main">
        <div className="mobilebar">
          <button className="icon-btn dark" onClick={() => setOpen(true)} aria-label="Ouvrir le menu"><MdMenu size={24} /></button>
          <Logo />
        </div>
        <main className="content">{children}</main>
      </div>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
    </div>
  );
};

export default Layout;
