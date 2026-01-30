const cloudinary = require("../config/cloudinary");
const User = require("../model/user.model");
const bcrypt = require("bcryptjs");
const Listing = require("../model/listing.model");
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    // Wrap Cloudinary stream in a Promise
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "user_profiles",
          public_id: `avatar_${req.user.id}`,
          overwrite: true,
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );

      stream.end(req.file.buffer); // ✅ send buffer directly
    });

    // Update user avatar in MongoDB
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: result.secure_url },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Profile image uploaded successfully",
      data: user,
    });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    return res.status(500).json({
      success: false,
      message: "Image upload failed",
      error: error.message,
    });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    // ✅ Ensure user can only update their own account
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        message: "You can only update your own account",
      });
    }

    const { username, email, password, avatar } = req.body;

    // ✅ Build update object dynamically
    const updateData = {};

    if (username) {
      updateData.username = username;
    }

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          success: false,
          error: "INVALID_EMAIL",
          message: "Please provide a valid email address.",
        });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== req.user.id) {
        return res.status(400).json({
          success: false,
          error: "EMAIL_IN_USE",
          message: "This email is already in use by another account.",
        });
      }

      updateData.email = email;
    }

    if (password) {
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: "WEAK_PASSWORD",
          message: "Password must be at least 6 characters long.",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }

    if (avatar) {
      updateData.avatar = avatar;
    }

    // ✅ If no fields provided, just return current user
    if (Object.keys(updateData).length === 0) {
      const user = await User.findById(req.params.id);
      return res.status(200).json({
        success: true,
        message: "No changes made",
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
    }

    // ✅ Update user in MongoDB
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
      },
    });
  } catch (error) {
    console.error("Update User Error:", error);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong while updating the user.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const deleteUserAccount = async (req, res) => {
  if (req.user.id !== req.params.id) {
    return res.status(401).json({
      success: false,
      message: "You can only delete your own account",
    });
  }
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("token");
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Something went wrong while deleting the user.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const getUserListing = async (req, res) => {
  try {
    // ✅ Ensure user can only view their own listings
    if (req.user.id !== req.params.id) {
      return res.status(401).json({
        success: false,
        error: "UNAUTHORIZED",
        message: "You can only view your own listings!",
      });
    }

    // ✅ Fetch listings
    const listings = await Listing.find({ userRef: req.params.id });

    return res.status(200).json({
      success: true,
      message: "User listings fetched successfully",
      data: listings,
    });
  } catch (error) {
    console.error("Get User Listings Error:", error);
    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong while fetching listings.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
module.exports = {
  uploadProfileImage,
  updateUserInfo,
  deleteUserAccount,
  getUserListing,
};
