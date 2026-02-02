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
const listingBasePath = "/api/listing";
const clientEndPoints = {
  ////////////////Authentication Routes////////////////
  signup: `${authBasePath}/signup`,
  signin: `${authBasePath}/signin`,
  google: `${authBasePath}/google`,
  signout: `${authBasePath}/signout`,

  ////////////////User Routes////////////
  uploadAvatar: `${userBasePath}/upload-avatar`,
  updateUser: `${userBasePath}/update-user`,
  deleteUser: `${userBasePath}/delete-user`,

  /// User Listing///////////////////
  createListing: `${listingBasePath}/create-listing`,
  showListing: `${userBasePath}/user-listings`,
};

export { clientBaseURL, clientEndPoints };
