import React from "react";
import { DropMark } from "./Logo";

export const Loader = ({ label = "Chargement" }) => (
  <div className="loader" role="status">
    <DropMark size={34} />
    <span>{label}…</span>
  </div>
);

export const EmptyState = ({ title, text, action }) => (
  <div className="empty">
    <h3>{title}</h3>
    {text && <p>{text}</p>}
    {action}
  </div>
);

export const ErrorState = ({ message, onRetry }) => (
  <div className="empty empty-error">
    <h3>Impossible de charger les données</h3>
    <p>{message}</p>
    {onRetry && <button className="btn" onClick={onRetry}>Réessayer</button>}
  </div>
);

export const PageHeader = ({ title, text, actions }) => (
  <header className="page-head">
    <div>
      <h1>{title}</h1>
      {text && <p>{text}</p>}
    </div>
    {actions && <div className="page-actions">{actions}</div>}
  </header>
);

/** Gère chargement, erreur et liste vide ; sinon affiche le contenu. */
export const Async = ({ state, empty, children }) => {
  if (state.loading && !state.data) return <Loader />;
  if (state.error) return <ErrorState message={state.error} onRetry={state.reload} />;
  if (empty) return empty;
  return children;
};
