import axios from "axios";

const API = axios.create({ baseURL: process.env.REACT_APP_BASEURL || "/api/v1" });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Session expirée : on nettoie et on renvoie vers la connexion
API.interceptors.response.use(
  (res) => res,
  (error) => {
    const onAuthPage = ["/login", "/register"].includes(window.location.pathname);
    if (error.response?.status === 401 && !onAuthPage) {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

export const errorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Une erreur est survenue";

export default API;
