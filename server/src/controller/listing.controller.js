const Listing = require("../model/listing.model");

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

module.exports = createListing;
