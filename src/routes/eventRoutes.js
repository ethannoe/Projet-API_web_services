const express = require("express");
const {
  creerEvenement,
  listerEvenements,
  recupererEvenement,
  rejoindreEvenement,
  ajouterOrganisateur
} = require("../controllers/eventController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.get("/", listerEvenements);
router.get("/:id", proteger, recupererEvenement);
router.post("/", proteger, creerEvenement);
router.post("/:id/participants", proteger, rejoindreEvenement);
router.post("/:id/organisateurs/:userId", proteger, ajouterOrganisateur);

module.exports = router;
