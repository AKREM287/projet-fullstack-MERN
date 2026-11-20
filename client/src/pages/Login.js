import React from "react";
import AuthShell from "../components/ui/AuthShell";
import AuthForm from "../components/ui/AuthForm";

const Login = () => (
  <AuthShell title="Connexion" subtitle="Choisissez votre profil, puis entrez vos identifiants.">
    <AuthForm mode="login" />
  </AuthShell>
);
export default Login;
