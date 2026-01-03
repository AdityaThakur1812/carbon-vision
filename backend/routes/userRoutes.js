const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const userAuth = require("../middleware/userAuth");

// AUTH
router.post("/register", authController.register);
router.post("/login", authController.login);

// USER
router.get("/me", userAuth, userController.getMe);
router.get("/profile", userAuth, userController.getProfile);

// ✅ FIX: correctly reference controller function
router.put("/profile", userAuth, userController.updateProfile);

module.exports = router;
