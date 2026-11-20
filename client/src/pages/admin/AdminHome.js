import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import useFetch from "../../hooks/useFetch";
import { Async, PageHeader } from "../../components/ui/Feedback";

const AdminHome = () => {
  const { user } = useSelector((s) => s.auth);
  const state = useFetch("/admin/stats");
  const s = state.data?.stats;
  const nf = (n) => n.toLocaleString("fr-FR");

  return (
    <>
      <PageHeader title={`Bonjour ${user?.name || ""}`} text="L'activité de toute la plateforme." />
      <Async state={state}>
        {s && (
          <div className="tiles">
            <Link to="/donar-list" className="tile"><strong>{nf(s.donars)}</strong><span>Donneurs inscrits</span></Link>
            <Link to="/hospital-list" className="tile"><strong>{nf(s.hospitals)}</strong><span>Hôpitaux</span></Link>
            <Link to="/org-list" className="tile"><strong>{nf(s.organisations)}</strong><span>Organisations</span></Link>
            <div className="tile tile-static"><strong>{nf(s.movements)}</strong><span>Mouvements de stock</span></div>
            <div className="tile tile-static tile-main"><strong>{nf(s.collectedMl)} <small>ml</small></strong><span>Sang collecté depuis le début</span></div>
          </div>
        )}
      </Async>
    </>
  );
};

export default AdminHome;
