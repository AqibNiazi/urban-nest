const bcrypt = require("bcryptjs");
const User = require("../model/user.model");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const transporter = require("../config/nodemailer");
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // ✅ Validate required fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Username, email, and password are required.",
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_EMAIL",
        message: "Please provide a valid email address.",
      });
    }

    // ✅ Validate password strength
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: "WEAK_PASSWORD",
        message: "Password must be at least 6 characters long.",
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "USER_EXISTS",
        message: "A user with this email already exists.",
      });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);

    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong while creating the user.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Email and password are required.",
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_EMAIL",
        message: "Please provide a valid email address.",
      });
    }

    // ✅ Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        error: "USER_NOT_FOUND",
        message: "No user found with this email.",
      });
    }

    // ✅ Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: "INVALID_CREDENTIALS",
        message: "Incorrect password.",
      });
    }

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // ✅ Store token in secure cookie
    res.cookie("token", token, {
      httpOnly: true, // prevents JS access
      secure: process.env.NODE_ENV === "production", // only HTTPS in prod
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // ✅ Respond with user info (no need to send token again)
    return res.status(200).json({
      success: true,
      message: "Signin successful!",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Signin Error:", error);

    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong while signing in.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const google = async (req, res) => {
  try {
    const { email, name, photo } = req.body;

    // ✅ Validate required fields
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        error: "VALIDATION_ERROR",
        message: "Email and name are required for Google Signin.",
      });
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: "INVALID_EMAIL",
        message: "Please provide a valid email address.",
      });
    }

    let user = await User.findOne({ email });

    if (user) {
      // Update avatar if Google provides a new one
      if (photo && user.avatar !== photo) {
        user.avatar = photo;
        await user.save();
      }

      // ✅ Existing user → generate token
      const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(200).json({
        success: true,
        message: "Signin successful!",
        data: {
          id: user._id,
          username: user.username,
          email: user.email,
          avatar: user.avatar,
        },
      });
    } else {
      // ✅ New user → create account
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);

      const newUser = new User({
        username:
          name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: photo,
      });

      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, email: newUser.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      return res.status(201).json({
        success: true,
        message: "Account created and signed in successfully!",
        data: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          avatar: newUser.avatar,
        },
      });
    }
  } catch (error) {
    console.error("Google Signin Error:", error);

    return res.status(500).json({
      success: false,
      error: "SERVER_ERROR",
      message: "Something went wrong during Google Signin.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

const signout = async (req, res) => {
  try {
    res.clearCookie("token");
    res
      .status(200)
      .json({ message: "User has been logged out!", success: true });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// auth.controller.js
// Add these two functions to your existing auth.controller.js
// ─────────────────────────────────────────────────────────────────────────────
// Required at top of file (add to your existing requires):
//
//   const crypto    = require("crypto");
//   const nodemailer = require("nodemailer");
//   const bcrypt    = require("bcryptjs"); // already used for signup/signin
//   const User      = require("../models/user.model"); // already used
//
// ─────────────────────────────────────────────────────────────────────────────
// Required .env variables:
//
//   SMTP_HOST=smtp.gmail.com            # or your SMTP host
//   SMTP_PORT=587
//   SMTP_USER=your@gmail.com
//   SMTP_PASS=your-app-password          # Gmail App Password (not your real password)
//   CLIENT_URL=http://localhost:5173      # frontend origin, for reset link
//
// ─────────────────────────────────────────────────────────────────────────────

// ─── Nodemailer transporter ───────────────────────────────────────────────────
// const createTransporter = () =>
//   nodemailer.createTransport({
//     host: process.env.SMTP_HOST || "smtp.gmail.com",
//     port: Number(process.env.SMTP_PORT) || 587,
//     secure: process.env.SMTP_SECURE === "true",
//     auth: {
//       user: process.env.SMTP_USER,
//       pass: process.env.SMTP_PASS,
//     },
//   });

// ─── POST /api/auth/forgot-password ──────────────────────────────────────────
// Body: { email }
// - Generates a secure random token (32 bytes hex)
// - Stores hashed token + 1-hour expiry on the User document
// - Emails a link containing the raw token to the user
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email?.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Email is required." });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    // ✅ Security: don't reveal whether the account exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message:
          "If an account with that email exists, a reset link has been sent.",
      });
    }

    // Generate raw token → send to user
    // Store HASHED token → prevents DB theft from giving reset access
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    // Build reset URL — frontend route handles the token via ?token= query param
    const resetURL = `${process.env.CLIENT_URL}/forgot-password?token=${rawToken}`;

    // Send email
    // const transporter = createTransporter();
    await transporter.sendMail({
      from: `"UrbanNest" <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: "Reset your UrbanNest password",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f7f7f5; margin: 0; padding: 40px 20px; }
              .container { max-width: 480px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e5e7eb; }
              .header { background: linear-gradient(135deg, #f59e0b, #ea580c); padding: 32px; text-align: center; }
              .header-logo { display: inline-flex; align-items: center; gap: 8px; }
              .logo-icon { width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 10px; display: inline-flex; align-items: center; justify-content: center; }
              .logo-text { color: #fff; font-size: 20px; font-weight: 800; }
              .body { padding: 36px 32px; }
              h2 { color: #1c1917; font-size: 22px; font-weight: 700; margin: 0 0 12px; }
              p { color: #57534e; font-size: 15px; line-height: 1.6; margin: 0 0 20px; }
              .btn { display: block; width: fit-content; margin: 0 auto 20px; background: linear-gradient(135deg, #f59e0b, #ea580c); color: #fff; text-decoration: none; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 10px; }
              .divider { height: 1px; background: #e5e7eb; margin: 24px 0; }
              .link-fallback { font-size: 12px; color: #a8a29e; word-break: break-all; }
              .footer { padding: 20px 32px; background: #fafaf9; border-top: 1px solid #e5e7eb; text-align: center; }
              .footer p { font-size: 12px; color: #a8a29e; margin: 0; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <div class="header-logo">
                  <span class="logo-text">🏠 UrbanNest</span>
                </div>
              </div>
              <div class="body">
                <h2>Reset your password</h2>
                <p>Hi ${user.username || "there"},</p>
                <p>We received a request to reset the password for your UrbanNest account. Click the button below to set a new password. This link expires in <strong>1 hour</strong>.</p>
                <a href="${resetURL}" class="btn">Reset My Password</a>
                <div class="divider"></div>
                <p>If you didn't request this, you can safely ignore this email — your password won't change.</p>
                <p class="link-fallback">If the button doesn't work, paste this link into your browser:<br/>${resetURL}</p>
              </div>
              <div class="footer">
                <p>© ${new Date().getFullYear()} UrbanNest · You're receiving this because you requested a password reset</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "If an account with that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("forgotPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to process request. Try again.",
    });
  }
};

// ─── POST /api/auth/reset-password ───────────────────────────────────────────
// Body: { token, password }
// - Hashes the incoming raw token and looks it up in DB
// - Checks it hasn't expired
// - Hashes the new password and saves it
// - Clears the reset token fields
const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({
      success: false,
      message: "Token and new password are required.",
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters.",
    });
  }

  try {
    // Hash the incoming raw token to compare with stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }, // not expired
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message:
          "Reset link is invalid or has expired. Please request a new one.",
      });
    }

    // Hash and save new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message:
        "Password reset successfully. You can now sign in with your new password.",
    });
  } catch (error) {
    console.error("resetPassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password. Try again.",
    });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// HOW TO INTEGRATE INTO YOUR EXISTING auth.controller.js:
//
// 1. Add to the top requires:
//      const crypto     = require("crypto");
//      const nodemailer = require("nodemailer");
//
// 2. Copy the createTransporter(), forgotPassword(), and resetPassword()
//    functions above into your existing auth.controller.js
//
// 3. Add to the module.exports at the bottom:
//      module.exports = { signup, signin, google, signout, forgotPassword, resetPassword };
//
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  signup,
  signin,
  google,
  signout,
  forgotPassword,
  resetPassword,
};
