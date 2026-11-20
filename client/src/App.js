import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import ProtectedRoute, { PublicRoute, HomeRedirect } from "./components/routes/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Inventory from "./pages/Inventory";
import Analytics from "./pages/Analytics";
import Partners from "./pages/Partners";
import MyRecords from "./pages/MyRecords";
import AdminHome from "./pages/admin/AdminHome";
import UserList from "./pages/admin/UserList";

const priv = (element, roles) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;

function App() {
  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: "IBM Plex Sans, sans-serif" } }} />
      <Routes>
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

        <Route path="/" element={priv(<HomeRedirect organisationPage={<Inventory />} />)} />

        {/* Organisation */}
        <Route path="/analytics" element={priv(<Analytics />, ["organisation"])} />
        <Route path="/donar" element={priv(<Partners kind="donars" />, ["organisation"])} />
        <Route path="/hospital" element={priv(<Partners kind="hospitals" />, ["organisation"])} />

        {/* Donneur / Hôpital */}
        <Route path="/donation" element={priv(<MyRecords role="donar" />, ["donar"])} />
        <Route path="/consumer" element={priv(<MyRecords role="hospital" />, ["hospital"])} />
        <Route path="/organisation" element={priv(<Partners kind="organisations" />, ["donar", "hospital"])} />

        {/* Admin */}
        <Route path="/admin" element={priv(<AdminHome />, ["admin"])} />
        <Route path="/donar-list" element={priv(<UserList kind="donar" />, ["admin"])} />
        <Route path="/hospital-list" element={priv(<UserList kind="hospital" />, ["admin"])} />
        <Route path="/org-list" element={priv(<UserList kind="organisation" />, ["admin"])} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
