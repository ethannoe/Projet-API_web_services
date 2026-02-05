const express = require("express");
const { register, login, me } = require("../controllers/authController");
const { proteger } = require("../middlewares/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", proteger, me);

module.exports = router;
