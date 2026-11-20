import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../redux/features/auth/authActions";
import Layout from "../layout/Layout";
import { Loader } from "../ui/Feedback";

/** Page privée. `roles` limite l'accès à certains rôles. */
const ProtectedRoute = ({ roles, children }) => {
  const dispatch = useDispatch();
  const { token, user } = useSelector((s) => s.auth);

  // Profil rechargé UNE fois si on a un token mais pas encore d'utilisateur
  useEffect(() => {
    if (token && !user) dispatch(getCurrentUser());
  }, [token, user, dispatch]);

  if (!token) return <Navigate to="/login" replace />;
  if (!user) return <Loader label="Connexion" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Layout>{children}</Layout>;
};

export const PublicRoute = ({ children }) => {
  const { token } = useSelector((s) => s.auth);
  return token ? <Navigate to="/" replace /> : children;
};

/** "/" : chaque rôle arrive sur sa page d'accueil. */
export const HomeRedirect = ({ organisationPage }) => {
  const { user } = useSelector((s) => s.auth);
  const target = { admin: "/admin", donar: "/donation", hospital: "/consumer" }[user.role];
  return target ? <Navigate to={target} replace /> : organisationPage;
};

export default ProtectedRoute;
