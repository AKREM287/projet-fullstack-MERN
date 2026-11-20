import React from "react";
import useFetch from "../hooks/useFetch";
import { Async, EmptyState, PageHeader } from "../components/ui/Feedback";
import GroupTag from "../components/ui/GroupTag";
import { fmtDate } from "../components/ui/MovementsTable";

const CONFIG = {
  donars: {
    url: "/inventory/get-donars", key: "donars", title: "Donneurs",
    text: "Les personnes qui ont donné à votre organisation.",
    name: (u) => u.name, countLabel: "Dons", empty: "Aucun donneur pour l'instant. Ils apparaissent ici dès votre premier don enregistré.",
  },
  hospitals: {
    url: "/inventory/get-hospitals", key: "hospitals", title: "Hôpitaux",
    text: "Les hôpitaux que votre organisation a livrés.",
    name: (u) => u.hospitalName, countLabel: "Livraisons", empty: "Aucun hôpital livré pour l'instant.",
  },
  organisations: {
    url: "/inventory/get-organisation", key: "organisations", title: "Organisations",
    text: "Les organisations avec lesquelles vous avez des échanges.",
    name: (u) => u.organisationName, countLabel: "Échanges", empty: "Aucune organisation pour l'instant.",
  },
};

const Partners = ({ kind }) => {
  const cfg = CONFIG[kind];
  const state = useFetch(cfg.url);
  const rows = state.data?.[cfg.key] || [];

  return (
    <>
      <PageHeader title={cfg.title} text={cfg.text} />
      <Async state={state} empty={!rows.length && <EmptyState title="Rien à afficher" text={cfg.empty} />}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th><th>Contact</th><th>Adresse</th>
                <th className="num">{cfg.countLabel}</th><th className="num">Volume</th><th>Dernier</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((u) => (
                <tr key={u._id}>
                  <td>
                    <strong>{cfg.name(u)}</strong>
                    {u.bloodGroup && <> <GroupTag group={u.bloodGroup} /></>}
                  </td>
                  <td><div>{u.email}</div><div className="muted small">{u.phone}</div></td>
                  <td className="muted">{u.address}</td>
                  <td className="num">{u.count}</td>
                  <td className="num">{u.totalMl.toLocaleString("fr-FR")} ml</td>
                  <td className="muted">{fmtDate(u.lastAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Async>
    </>
  );
};

export default Partners;
