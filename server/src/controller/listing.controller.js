const Listing = require("../model/listing.model");

const getListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.status(200).json({
      success: true,
      message: "Listing fetched successfully!",
      data: listing,
    });
  } catch (error) {
    console.error("Fetch Listing Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createListing = async (req, res) => {
  try {
    const {
      title,
      description,
      address,
      regularPrice,
      discountPrice,
      bedrooms,
      bathrooms,
      furnished,
      parking,
      type,
      offer,
      imageUrls,
      userRef,
    } = req.body;

    if (
      !title ||
      !description ||
      !address ||
      regularPrice === undefined ||
      (offer && discountPrice === undefined) ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      furnished === undefined ||
      parking === undefined ||
      !type ||
      offer === undefined ||
      !Array.isArray(imageUrls) ||
      imageUrls.length === 0
    ) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "All required fields must be provided.",
      });
    }

    const listing = await Listing.create({
      ...req.body,
      regularPrice: Number(regularPrice),
      discountPrice: offer ? Number(discountPrice) : 0,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      userRef,
    });

    return res.status(201).json({
      success: true,
      message: "Listing created successfully!",
      data: listing,
    });
  } catch (error) {
    console.error("Create Listing Error:", error);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong while creating the listing.",
    });
  }
};

const deleteListing = async (req, res) => {
  try {
    // ✅ Check if listing exists
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Listing not found!",
      });
    }

    // ✅ Ensure user owns the listing
    if (req.user.id !== listing.userRef) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "You can only delete your own listings!",
      });
    }

    // ✅ Delete listing
    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Listing has been deleted successfully!",
    });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong while deleting the listing.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const updateListing = async (req, res) => {
  try {
    // ✅ Check if listing exists
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        error: "NOT_FOUND",
        message: "Listing not found!",
      });
    }

    // ✅ Ensure user owns the listing
    if (req.user.id !== listing.userRef) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "You can only update your own listings!",
      });
    }

    // ✅ Update listing
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Listing has been updated successfully!",
      data: updatedListing,
    });
  } catch (error) {
    console.error("Update Listing Error:", error);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong while updating the listing.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = { getListing, createListing, deleteListing, updateListing };
