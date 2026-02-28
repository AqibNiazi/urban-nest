// auth.routes.js — full updated file
const express = require("express");
const {
  signup,
  signin,
  google,
  signout,
  forgotPassword, // ✅ NEW
  resetPassword, // ✅ NEW
} = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/auth.middleware");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", google);
authRouter.post("/signout", verifyToken, signout);

// ✅ NEW: Forgot / Reset password — no auth required (user is locked out)
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password", resetPassword);

module.exports = authRouter;
