const express = require("express");
const {
  creerGroupe,
  listerGroupes,
  recupererGroupe,
  rejoindreGroupe,
  validerDemande,
  retirerMembre
} = require("../controllers/groupController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.get("/", listerGroupes);
router.get("/:id", proteger, recupererGroupe);
router.post("/", proteger, creerGroupe);
router.post("/:id/rejoindre", proteger, rejoindreGroupe);
router.post("/:id/valider/:userId", proteger, validerDemande);
router.post("/:id/membres/:userId/supprimer", proteger, retirerMembre);

module.exports = router;
