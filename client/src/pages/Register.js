import React from "react";
import AuthShell from "../components/ui/AuthShell";
import AuthForm from "../components/ui/AuthForm";

const Register = () => (
  <AuthShell title="Créer un compte" subtitle="Donneur, hôpital ou organisation : choisissez votre profil.">
    <AuthForm mode="register" />
  </AuthShell>
);
export default Register;
