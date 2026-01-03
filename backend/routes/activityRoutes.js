const express = require("express");
const router = express.Router();
const userAuth = require("../middleware/userAuth");
const ctrl = require("../controllers/activityController");

router.post("/log", userAuth, ctrl.logActivity);
router.get("/today", userAuth, ctrl.getToday);
router.get("/history", userAuth, ctrl.getHistory);

module.exports = router;
