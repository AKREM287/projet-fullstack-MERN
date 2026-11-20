const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors"); // eslint-disable-line no-unused-vars
const morgan = require("morgan");
const cors = require("cors");

dotenv.config();

const connectDB = require("./config/db");
const { notFound, errorHandler } = require("./middleware/errorMiddleware");

// Vérifications au démarrage : on échoue tout de suite avec un message clair
for (const key of ["MONGO_URL", "JWT_SECRET"]) {
  if (!process.env[key]) {
    console.error(`✖ Variable ${key} manquante. Copiez .env.example vers .env et complétez-le.`.red);
    process.exit(1);
  }
}

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || true }));
app.use(express.json({ limit: "100kb" }));
if (process.env.DEV_MODE !== "production") app.use(morgan("dev"));

app.get("/api/v1/test", (_req, res) => res.json({ success: true, message: "API Blood Bank OK" }));
app.use("/api/v1/auth", require("./routes/authRoute"));
app.use("/api/v1/inventory", require("./routes/inventoryRoutes"));
app.use("/api/v1/analytics", require("./routes/analyticsRoutes"));
app.use("/api/v1/admin", require("./routes/adminRoutes"));

// En production : le serveur sert aussi le front compilé (npm run build)
if (process.env.DEV_MODE === "production") {
  const build = path.join(__dirname, "client", "build");
  app.use(express.static(build));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(build, "index.html")));
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8080;

connectDB()
  .then(() =>
    app.listen(PORT, () =>
      console.log(`✔ API prête sur http://localhost:${PORT}  (${process.env.DEV_MODE || "development"})`.green)
    )
  )
  .catch((err) => {
    console.error(`✖ Connexion MongoDB impossible : ${err.message}`.red);
    console.error("  → MongoDB est-il lancé ? L'URL dans .env est-elle correcte ?".yellow);
    process.exit(1);
  });
