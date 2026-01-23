const express = require("express");
const createListing = require("../controller/listing.controller");
const { verifyToken } = require("../middleware/auth");

const listingRouter = express.Router();

listingRouter.post("/create-listing", verifyToken, createListing);

module.exports = listingRouter;
