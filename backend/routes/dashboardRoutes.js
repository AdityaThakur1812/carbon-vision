const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const userAuth = require("../middleware/userAuth");

// SUMMARY
router.get("/summary", userAuth, dashboardController.summary);

// TRENDS
router.get("/trends", userAuth, dashboardController.trends);

// COMPARE
router.get("/compare", userAuth, dashboardController.compare);

module.exports = router;
