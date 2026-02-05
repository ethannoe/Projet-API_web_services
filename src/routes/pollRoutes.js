const express = require("express");
const { creerSondage, recupererSondage, repondreSondage } = require("../controllers/pollController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.post("/", proteger, creerSondage);
router.get("/:id", proteger, recupererSondage);
router.post("/:id/reponses", proteger, repondreSondage);

module.exports = router;
