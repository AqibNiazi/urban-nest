import axios from "axios";
//  Local
const websiteBaseURL = import.meta.env.VITE_WEBSITE_BASE_URL;
// const serverBaseURL = import.meta.env.VITE_SERVER_BASE_URL;

// Production
// const websiteBaseURL = "https://mern-auth-5aqq.vercel.app";

const clientBaseURL = axios.create({
  baseURL: websiteBaseURL,
  withCredentials: true,
});

const authBasePath = "/api/auth";
const userBasePath = "/api/user";
const clientEndPoints = {
  ////////////////Authentication Routes////////////////

  signup: `${authBasePath}/signup`,
  signin: `${authBasePath}/signin`,
  google: `${authBasePath}/google`,
  // logout: `${authBasePath}/logout`,
  // sendVerificationOTP: `${authBasePath}/send-verify-otp`,
  // verifyAccount: `${authBasePath}/verify-account`,
  // isAuthenticated: `${authBasePath}/is-auth`,
  // sendResetOTP: `${authBasePath}/send-reset-otp`,
  // resetPassword: `${authBasePath}/reset-password`,

  ////////////////User Routes////////////
  uploadAvatar: `${userBasePath}/upload-avatar`,
  updateUser: `${userBasePath}/update-user`,
};

export { clientBaseURL, clientEndPoints };
