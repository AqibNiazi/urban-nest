const express = require("express");
const { signup } = require("../controller/auth.controller");

const authRouter = express.Router();

authRouter.post("/signup", signup);

module.exports = authRouter;
