require("dotenv").config();
const express = require("express");
// const bodyParser = require("body-parser");
const database = require("./src/config/mongodb");
const cors = require("cors");
const HOST = process.env.HOST;
const app = express();
const PORT = process.env.PORT || 3000;

const cookieParser = require("cookie-parser");
const userRouter = require("./src/router/user.router");
const authRouter = require("./src/router/auth.router");
const listingRouter = require("./src/router/listing.router");
const allowedOrigins = [
  "http://localhost:5173",
  "https://urban-nest-rho.vercel.app/",
];
// Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);
const NodeJsServer = async () => {
  try {
    await database();
    app.listen(PORT, HOST, () => {
      console.log(`Backend server is running at http://${HOST}:${PORT}`);
      console.log("Server running");
    });
  } catch (error) {
    console.log("error", error);
  }
};
NodeJsServer();
