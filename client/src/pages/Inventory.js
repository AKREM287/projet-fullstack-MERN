import React, { useState } from "react";
import toast from "react-hot-toast";
import { MdAdd } from "react-icons/md";
import useFetch from "../hooks/useFetch";
import API, { errorMessage } from "../services/API";
import { Async, EmptyState, PageHeader } from "../components/ui/Feedback";
import MovementsTable from "../components/ui/MovementsTable";
import Modal from "../components/ui/Modal";
import GroupTag from "../components/ui/GroupTag";
import { BLOOD_GROUPS } from "../utils/blood";

const FILTERS = [
  { value: "", label: "Tout" },
  { value: "in", label: "Entrées" },
  { value: "out", label: "Sorties" },
];

const RecordModal = ({ onClose, onSaved }) => {
  const [type, setType] = useState("in");
  const [group, setGroup] = useState("");
  const [email, setEmail] = useState("");
  const [quantity, setQuantity] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!group) return toast.error("Choisissez un groupe sanguin");
    setSaving(true);
    try {
      await API.post("/inventory/create-inventory", {
        inventoryType: type, bloodGroup: group, email, quantity: Number(quantity),
      });
      toast.success(type === "in" ? "Don enregistré" : "Sortie enregistrée");
      onSaved();
    } catch (err) {
      toast.error(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const presets = type === "in" ? [350, 450] : [250, 500];

  return (
    <Modal
      title="Enregistrer un mouvement"
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn" onClick={onClose}>Annuler</button>
          <button form="record-form" className="btn btn-primary" disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </button>
        </>
      }
    >
      <form id="record-form" onSubmit={submit} className="form">
        <div className="seg" role="radiogroup" aria-label="Type de mouvement">
          <button type="button" role="radio" aria-checked={type === "in"} className={type === "in" ? "on" : ""} onClick={() => setType("in")}>
            Entrée · don reçu
          </button>
          <button type="button" role="radio" aria-checked={type === "out"} className={type === "out" ? "on" : ""} onClick={() => setType("out")}>
            Sortie · livraison
          </button>
        </div>

        <div className="field">
          <span className="label">Groupe sanguin</span>
          <div className="gchoices">
            {BLOOD_GROUPS.map((g) => (
              <GroupTag key={g} group={g} selected={group === g} onClick={() => setGroup(g)} />
            ))}
          </div>
        </div>

        <div className="field">
          <label htmlFor="rec-email">{type === "in" ? "Email du donneur" : "Email de l'hôpital"}</label>
          <input id="rec-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
            placeholder={type === "in" ? "donneur@exemple.com" : "hopital@exemple.com"} />
          <span className="hint">Le compte doit déjà exister.</span>
        </div>

        <div className="field">
          <label htmlFor="rec-qty">Quantité (ml)</label>
          <input id="rec-qty" type="number" min="1" max={type === "in" ? 500 : 5000} step="1" value={quantity}
            onChange={(e) => setQuantity(e.target.value)} required />
          <div className="presets">
            {presets.map((p) => (
              <button type="button" key={p} className="chip" onClick={() => setQuantity(String(p))}>{p} ml</button>
            ))}
          </div>
          {type === "in" && <span className="hint">500 ml maximum par don. Un donneur doit attendre 56 jours entre deux dons.</span>}
        </div>
      </form>
    </Modal>
  );
};

const Inventory = () => {
  const [type, setType] = useState("");
  const [open, setOpen] = useState(false);
  const state = useFetch("/inventory/get-inventory", type ? { type } : {});
  const records = state.data?.inventory || [];

  return (
    <>
      <PageHeader
        title="Stock"
        text="Tous les dons reçus et les poches livrées par votre organisation."
        actions={<button className="btn btn-primary" onClick={() => setOpen(true)}><MdAdd size={20} /> Enregistrer un mouvement</button>}
      />
      <div className="seg seg-inline" role="tablist" aria-label="Filtrer les mouvements">
        {FILTERS.map((f) => (
          <button key={f.value} role="tab" aria-selected={type === f.value} className={type === f.value ? "on" : ""} onClick={() => setType(f.value)}>
            {f.label}
          </button>
        ))}
      </div>

      <Async
        state={state}
        empty={!records.length && (
          <EmptyState
            title="Aucun mouvement pour l'instant"
            text="Enregistrez le premier don reçu ou la première livraison pour démarrer le suivi."
            action={<button className="btn btn-primary" onClick={() => setOpen(true)}>Enregistrer un mouvement</button>}
          />
        )}
      >
        <MovementsTable records={records} mode="org" />
      </Async>

      {open && <RecordModal onClose={() => setOpen(false)} onSaved={() => { setOpen(false); state.reload(); }} />}
    </>
  );
};

export default Inventory;
