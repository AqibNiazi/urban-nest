const express = require("express");
const {
  signup,
  signin,
  google,
  signout,
} = require("../controller/auth.controller");

const authRouter = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/google", google);
authRouter.get("/signout", signout);

module.exports = authRouter;
