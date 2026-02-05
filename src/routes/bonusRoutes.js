const express = require("express");
const {
  creerShoppingItem,
  listerShoppingItems,
  creerCovoiturage,
  listerCovoiturages
} = require("../controllers/bonusController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.post("/evenements/:id/shopping", proteger, creerShoppingItem);
router.get("/evenements/:id/shopping", proteger, listerShoppingItems);
router.post("/evenements/:id/covoiturage", proteger, creerCovoiturage);
router.get("/evenements/:id/covoiturage", proteger, listerCovoiturages);

module.exports = router;
