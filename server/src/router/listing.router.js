const express = require("express");
const {
  getListing,
  createListing,
  deleteListing,
  updateListing,
  getListings,
} = require("../controller/listing.controller");
const { verifyToken } = require("../middleware/auth");

const listingRouter = express.Router();
listingRouter.get("/get-listings", getListings);
listingRouter.get("/get-listing/:id", getListing);
listingRouter.post("/create-listing", verifyToken, createListing);
listingRouter.delete("/delete-listing/:id", verifyToken, deleteListing);
listingRouter.put("/update-listing/:id", verifyToken, updateListing);

module.exports = listingRouter;
