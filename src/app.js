const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const groupRoutes = require("./routes/groupRoutes");
const eventRoutes = require("./routes/eventRoutes");
const threadRoutes = require("./routes/threadRoutes");
const albumRoutes = require("./routes/albumRoutes");
const photoRoutes = require("./routes/photoRoutes");
const pollRoutes = require("./routes/pollRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
const bonusRoutes = require("./routes/bonusRoutes");
const { gestionErreurGlobale, routeInconnue } = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

const limiteur = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { succes: false, message: "Trop de requêtes, veuillez réessayer plus tard." }
});

app.use(limiteur);

app.get("/", (_req, res) => {
  res.json({ succes: true, message: "API My Social Networks opérationnelle" });
});

app.use("/api/auth", authRoutes);
app.use("/api/groupes", groupRoutes);
app.use("/api/evenements", eventRoutes);
app.use("/api/fils", threadRoutes);
app.use("/api/albums", albumRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/sondages", pollRoutes);
app.use("/api/billetterie", ticketRoutes);
app.use("/api/bonus", bonusRoutes);

app.use(routeInconnue);
app.use(gestionErreurGlobale);

module.exports = app;
