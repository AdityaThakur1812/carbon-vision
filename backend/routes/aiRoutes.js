const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const aiCtrl = require("../controllers/aiController");

router.get("/recommend", userAuth, aiCtrl.getRecommendations);

module.exports = router;
