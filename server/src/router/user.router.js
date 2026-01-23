const express = require("express");


const userRouter = express.Router();
const {
  uploadProfileImage,
  updateUserInfo,
  deleteUserAccount,
} = require("../controller/user.controller");
const upload = require("../middleware/upload");
const { verifyToken } = require("../middleware/auth"); // your JWT middleware

userRouter.post(
  "/upload-avatar",
  verifyToken,
  upload.single("avatar"), // frontend must send field name "avatar"
  uploadProfileImage,
);

userRouter.put("/update-user/:id", verifyToken, updateUserInfo);
userRouter.delete("/delete-user/:id", verifyToken, deleteUserAccount);

module.exports = userRouter;
