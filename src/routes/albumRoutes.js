const express = require("express");
const {
  creerAlbum,
  recupererAlbum,
  ajouterPhoto,
  listerPhotos
} = require("../controllers/albumController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.post("/", proteger, creerAlbum);
router.get("/:id", proteger, recupererAlbum);
router.post("/:id/photos", proteger, ajouterPhoto);
router.get("/:id/photos", proteger, listerPhotos);

module.exports = router;
