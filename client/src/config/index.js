// config.js — full updated file with forgotPassword + resetPassword endpoints
import axios from "axios";

//  Local
const websiteBaseURL = import.meta.env.VITE_WEBSITE_BASE_URL;

const clientBaseURL = axios.create({
  baseURL: websiteBaseURL,
  withCredentials: true,
});

const authBasePath = "/api/auth";
const userBasePath = "/api/user";
const listingBasePath = "/api/listing";

const clientEndPoints = {
  //////////////// Authentication Routes ////////////////
  signup: `${authBasePath}/signup`,
  signin: `${authBasePath}/signin`,
  google: `${authBasePath}/google`,
  signout: `${authBasePath}/signout`,

  // ✅ NEW: Password reset
  forgotPassword: `${authBasePath}/forgot-password`,
  resetPassword: `${authBasePath}/reset-password`,

  //////////////// User Routes ////////////////
  uploadAvatar: `${userBasePath}/upload-avatar`,
  updateUser: `${userBasePath}/update-user`,
  deleteUser: `${userBasePath}/delete-user`,
  getUser: `${userBasePath}/get-user`,

  //////////////// Listing Routes ////////////////
  getListing: `${listingBasePath}/get-listing`,
  getListings: `${listingBasePath}/get-listings`,
  createListing: `${listingBasePath}/create-listing`,
  updateListing: `${listingBasePath}/update-listing`,
  deleteListing: `${listingBasePath}/delete-listing`,
  showListing: `${userBasePath}/user-listings`,
};

export { clientBaseURL, clientEndPoints };
