const Listing = require("../model/listing.model");

const createListing = async (req, res) => {
  try {
    // ✅ Basic validation: ensure required fields exist
    const {
      name,
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
      !name ||
      !description ||
      !address ||
      !regularPrice ||
      !discountPrice ||
      bedrooms === undefined ||
      bathrooms === undefined ||
      furnished === undefined ||
      parking === undefined ||
      !type ||
      offer === undefined ||
      !imageUrls ||
      !userRef
    ) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "All required fields must be provided.",
      });
    }

    // ✅ Create listing
    const listing = await Listing.create(req.body);

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
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = createListing;
