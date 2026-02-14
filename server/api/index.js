require("dotenv").config();
const express = require("express");
const database = require("../src/config/mongodb");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const userRouter = require("../src/router/user.router");
const authRouter = require("../src/router/auth.router");
const listingRouter = require("../src/router/listing.router");

const app = express();

// ✅ Connect DB once
database();

// ✅ CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app",
    ],
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// ✅ Export app (IMPORTANT FOR VERCEL)
module.exports = app;
