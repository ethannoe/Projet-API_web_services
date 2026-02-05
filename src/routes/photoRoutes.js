const express = require("express");
const { ajouterCommentaire, listerCommentaires } = require("../controllers/photoController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.post("/:id/commentaires", proteger, ajouterCommentaire);
router.get("/:id/commentaires", proteger, listerCommentaires);

module.exports = router;
