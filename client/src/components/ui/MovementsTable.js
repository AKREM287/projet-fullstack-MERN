import React from "react";
import moment from "moment";
import GroupTag from "./GroupTag";

export const fmtDate = (d) => moment(d).format("D MMM YYYY, HH:mm");

/** Tableau de mouvements. mode = "org" | "donar" | "hospital" */
const MovementsTable = ({ records, mode }) => (
  <div className="table-wrap">
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          {mode === "org" && <th>Mouvement</th>}
          <th>Groupe</th>
          <th className="num">Quantité</th>
          <th>{mode === "org" ? "Donneur / hôpital" : "Organisation"}</th>
        </tr>
      </thead>
      <tbody>
        {records.map((r) => {
          const isIn = r.inventoryType === "in";
          const who = mode === "org"
            ? (isIn ? r.donar?.name : r.hospital?.hospitalName)
            : r.organisation?.organisationName;
          const mail = mode === "org" ? r.email : r.organisation?.email;
          return (
            <tr key={r._id}>
              <td className="muted">{fmtDate(r.createdAt)}</td>
              {mode === "org" && (
                <td><span className={`flow ${isIn ? "flow-in" : "flow-out"}`}>{isIn ? "Entrée" : "Sortie"}</span></td>
              )}
              <td><GroupTag group={r.bloodGroup} /></td>
              <td className="num"><strong>{r.quantity}</strong> ml</td>
              <td>
                <div>{who || <em className="muted">Compte supprimé</em>}</div>
                <div className="muted small">{mail}</div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default MovementsTable;
