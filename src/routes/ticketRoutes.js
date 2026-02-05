const express = require("express");
const {
  creerTypeBillet,
  listerTypesBillets,
  acheterBillet
} = require("../controllers/ticketController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.post("/types", proteger, creerTypeBillet);
router.get("/evenements/:eventId/types", listerTypesBillets);
router.post("/acheter", acheterBillet);

module.exports = router;
