import React from "react";
import useFetch from "../hooks/useFetch";
import { Async, PageHeader } from "../components/ui/Feedback";
import Vial from "../components/ui/Vial";
import MovementsTable from "../components/ui/MovementsTable";

const nf = (n) => n.toLocaleString("fr-FR");

const Analytics = () => {
  const stock = useFetch("/analytics/bloodGroups-data");
  const recent = useFetch("/inventory/get-recent-inventory");
  const groups = stock.data?.bloodGroupData || [];
  const totals = stock.data?.totals;
  const full = Math.max(2000, ...groups.map((g) => g.available));

  return (
    <>
      <PageHeader title="Niveaux par groupe" text="Stock disponible en millilitres. Un tube rouge vif signale un stock bas." />
      <Async state={stock}>
        {totals && (
          <dl className="ledger">
            <div><dt>Reçu</dt><dd>{nf(totals.totalIn)} <small>ml</small></dd></div>
            <div><dt>Livré</dt><dd>{nf(totals.totalOut)} <small>ml</small></dd></div>
            <div><dt>Disponible</dt><dd>{nf(totals.available)} <small>ml</small></dd></div>
          </dl>
        )}
        <div className="rack-board">
          {groups.map((g) => (
            <article key={g.bloodGroup} className={`slot ${g.low ? "slot-low" : ""}`}>
              <Vial group={g.bloodGroup} level={Math.max(0, g.available) / full} low={g.low} width={64} />
              <strong className="slot-val">{nf(g.available)} <small>ml</small></strong>
              <span className="slot-meta">+{nf(g.totalIn)} · −{nf(g.totalOut)}</span>
              {g.low && <span className="slot-alert">Stock bas</span>}
            </article>
          ))}
        </div>
      </Async>

      <h2 className="section-title">Derniers mouvements</h2>
      <Async state={recent} empty={!(recent.data?.inventory || []).length && <p className="muted">Aucun mouvement enregistré.</p>}>
        <MovementsTable records={recent.data?.inventory || []} mode="org" />
      </Async>
    </>
  );
};

export default Analytics;
