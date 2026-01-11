import axios from "axios";
//  Local
// const websiteBaseURL = "http://localhost:3000";

// Production
const websiteBaseURL = "https://mern-auth-5aqq.vercel.app";

const clientBaseURL = axios.create({
  baseURL: websiteBaseURL,
  withCredentials: true,
});

const authBasePath = "/api/auth";
const userBasePath = "/api/user";
const clientEndPoints = {
  ////////////////Authentication Routes////////////////

  register: `${authBasePath}/register`,
  login: `${authBasePath}/login`,
  logout: `${authBasePath}/logout`,
  sendVerificationOTP: `${authBasePath}/send-verify-otp`,
  verifyAccount: `${authBasePath}/verify-account`,
  isAuthenticated: `${authBasePath}/is-auth`,
  sendResetOTP: `${authBasePath}/send-reset-otp`,
  resetPassword: `${authBasePath}/reset-password`,

  ////////////////User Routes////////////
  userData: `${userBasePath}/data`,
};

export { clientBaseURL, clientEndPoints };
