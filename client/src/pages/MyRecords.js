import React from "react";
import useFetch from "../hooks/useFetch";
import { Async, EmptyState, PageHeader } from "../components/ui/Feedback";
import MovementsTable from "../components/ui/MovementsTable";

const TEXT = {
  donar: {
    title: "Mes dons",
    text: "L'historique de vos dons. Vous pouvez donner de nouveau 56 jours après le dernier.",
    empty: "Vous n'avez pas encore de don enregistré. Une organisation l'ajoutera après votre don.",
  },
  hospital: {
    title: "Poches reçues",
    text: "Les livraisons de sang reçues de la part des organisations.",
    empty: "Aucune livraison reçue pour l'instant.",
  },
};

const MyRecords = ({ role }) => {
  const state = useFetch("/inventory/my-records");
  const records = state.data?.inventory || [];
  const t = TEXT[role];
  const totalMl = records.reduce((s, r) => s + r.quantity, 0);

  return (
    <>
      <PageHeader title={t.title} text={t.text} />
      <Async state={state} empty={!records.length && <EmptyState title="Rien pour l'instant" text={t.empty} />}>
        <p className="summary"><strong>{records.length}</strong> {role === "donar" ? "don(s)" : "livraison(s)"} · <strong>{totalMl.toLocaleString("fr-FR")}</strong> ml au total</p>
        <MovementsTable records={records} mode={role} />
      </Async>
    </>
  );
};

export default MyRecords;
