const express = require("express");
const {
  signup,
  signin,
  google,
  signout,
} = require("../controller/auth.controller");
const { verifyToken } = require("../middleware/auth");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", google);

// ✅ FIXED: Changed GET → POST for signout (security best practice)
// ✅ FIXED: Added verifyToken middleware — only authenticated users can signout
authRouter.post("/signout", verifyToken, signout);

module.exports = authRouter;