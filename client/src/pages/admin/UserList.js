import React, { useState } from "react";
import toast from "react-hot-toast";
import useFetch from "../../hooks/useFetch";
import API, { errorMessage } from "../../services/API";
import { Async, EmptyState, PageHeader } from "../../components/ui/Feedback";
import Modal from "../../components/ui/Modal";
import GroupTag from "../../components/ui/GroupTag";
import { fmtDate } from "../../components/ui/MovementsTable";
import { displayName } from "../../utils/blood";

const CONFIG = {
  donar: { url: "/admin/donar-list", title: "Donneurs", one: "ce donneur" },
  hospital: { url: "/admin/hospital-list", title: "Hôpitaux", one: "cet hôpital" },
  organisation: { url: "/admin/org-list", title: "Organisations", one: "cette organisation" },
};

const UserList = ({ kind }) => {
  const cfg = CONFIG[kind];
  const state = useFetch(cfg.url);
  const users = state.data?.users || [];
  const [target, setTarget] = useState(null);
  const [busy, setBusy] = useState(false);

  const confirmDelete = async () => {
    setBusy(true);
    try {
      await API.delete(`/admin/users/${target._id}`);
      toast.success("Compte supprimé");
      setTarget(null);
      state.reload();
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader title={cfg.title} text={`${users.length} compte(s) inscrit(s).`} />
      <Async state={state} empty={!users.length && <EmptyState title="Aucun compte" text="Les comptes apparaissent ici après leur inscription." />}>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>Nom</th><th>Contact</th><th>Adresse</th><th>Inscrit le</th><th></th></tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td><strong>{displayName(u)}</strong>{u.bloodGroup && <> <GroupTag group={u.bloodGroup} /></>}</td>
                  <td><div>{u.email}</div><div className="muted small">{u.phone}</div></td>
                  <td className="muted">{u.address}</td>
                  <td className="muted">{fmtDate(u.createdAt)}</td>
                  <td className="num"><button className="btn btn-danger btn-sm" onClick={() => setTarget(u)}>Supprimer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Async>

      {target && (
        <Modal
          title="Supprimer ce compte ?"
          onClose={() => setTarget(null)}
          footer={
            <>
              <button className="btn" onClick={() => setTarget(null)}>Annuler</button>
              <button className="btn btn-danger" onClick={confirmDelete} disabled={busy}>{busy ? "Suppression…" : "Supprimer"}</button>
            </>
          }
        >
          <p>Vous allez supprimer {cfg.one} : <strong>{displayName(target)}</strong>.</p>
          {kind === "organisation" && <p className="warn">Tout l'historique de stock de cette organisation sera supprimé.</p>}
          <p className="muted">Cette action est définitive.</p>
        </Modal>
      )}
    </>
  );
};

export default UserList;
