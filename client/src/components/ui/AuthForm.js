import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { userLogin, userRegister } from "../../redux/features/auth/authActions";
import { BLOOD_GROUPS, roleLabel } from "../../utils/blood";

const ROLES = ["donar", "hospital", "organisation", "admin"];

const Field = ({ label, id, ...props }) => (
  <div className="field">
    <label htmlFor={id}>{label}</label>
    <input id={id} {...props} />
  </div>
);

const AuthForm = ({ mode }) => {
  const isLogin = mode === "login";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [f, setF] = useState({
    role: "donar", email: "", password: "", name: "", organisationName: "",
    hospitalName: "", website: "", address: "", phone: "", bloodGroup: "", adminCode: "",
  });
  const set = (k) => (e) => setF((p) => ({ ...p, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        await dispatch(userLogin({ email: f.email, password: f.password, role: f.role })).unwrap();
        toast.success("Connexion réussie");
        navigate("/");
      } else {
        await dispatch(userRegister(f)).unwrap();
        toast.success("Compte créé. Vous pouvez vous connecter.");
        navigate("/login");
      }
    } catch (message) {
      toast.error(message);
    }
  };

  return (
    <form onSubmit={submit} className="form">
      <fieldset className="roles">
        <legend>Je suis</legend>
        <div className="roles-grid">
          {ROLES.map((r) => (
            <label key={r} className={f.role === r ? "role on" : "role"}>
              <input type="radio" name="role" value={r} checked={f.role === r} onChange={set("role")} />
              {roleLabel[r]}
            </label>
          ))}
        </div>
      </fieldset>

      {!isLogin && (f.role === "donar" || f.role === "admin") && (
        <Field id="name" label="Nom complet" value={f.name} onChange={set("name")} required autoComplete="name" />
      )}
      {!isLogin && f.role === "hospital" && (
        <Field id="hospitalName" label="Nom de l'hôpital" value={f.hospitalName} onChange={set("hospitalName")} required />
      )}
      {!isLogin && f.role === "organisation" && (
        <Field id="organisationName" label="Nom de l'organisation" value={f.organisationName} onChange={set("organisationName")} required />
      )}

      <Field id="email" label="Adresse email" type="email" value={f.email} onChange={set("email")} required autoComplete="email" />
      <Field
        id="password" label="Mot de passe" type="password" value={f.password} onChange={set("password")}
        required minLength={isLogin ? undefined : 6} autoComplete={isLogin ? "current-password" : "new-password"}
        placeholder={isLogin ? "" : "6 caractères minimum"}
      />

      {!isLogin && (
        <>
          {f.role === "donar" && (
            <div className="field">
              <label htmlFor="bg">Groupe sanguin (si vous le connaissez)</label>
              <select id="bg" value={f.bloodGroup} onChange={set("bloodGroup")}>
                <option value="">Je ne sais pas</option>
                {BLOOD_GROUPS.map((g) => <option key={g}>{g}</option>)}
              </select>
            </div>
          )}
          {f.role === "admin" && (
            <Field id="adminCode" label="Code administrateur" type="password" value={f.adminCode} onChange={set("adminCode")} required />
          )}
          <div className="grid2">
            <Field id="phone" label="Téléphone" value={f.phone} onChange={set("phone")} required autoComplete="tel" />
            <Field id="address" label="Adresse" value={f.address} onChange={set("address")} required autoComplete="street-address" />
          </div>
          {(f.role === "organisation" || f.role === "hospital") && (
            <Field id="website" label="Site web (facultatif)" value={f.website} onChange={set("website")} />
          )}
        </>
      )}

      <button className="btn btn-primary btn-block" disabled={loading}>
        {loading ? "Patientez…" : isLogin ? "Se connecter" : "Créer mon compte"}
      </button>
      <p className="switch">
        {isLogin ? <>Pas encore de compte ? <Link to="/register">Créer un compte</Link></> : <>Déjà inscrit ? <Link to="/login">Se connecter</Link></>}
      </p>
    </form>
  );
};

export default AuthForm;
