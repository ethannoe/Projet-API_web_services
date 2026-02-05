const express = require("express");
const {
  creerFil,
  recupererFil,
  ajouterMessage,
  listerMessages
} = require("../controllers/threadController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.post("/", proteger, creerFil);
router.get("/:id", proteger, recupererFil);
router.post("/:id/messages", proteger, ajouterMessage);
router.get("/:id/messages", proteger, listerMessages);

module.exports = router;
