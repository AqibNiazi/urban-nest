import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInSuccess,
  signoutUserFailure,
  signoutUserStart,
  signoutUserSuccess,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "@/store/user/userSlice";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import PasswordField from "@/components/PasswordField";
import { clientBaseURL, clientEndPoints } from "@/config";
import { notify } from "@/util/notify";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);

  const [userListings, setUserListings] = useState([]);
  const [showListings, setShowListings] = useState(false);
  const [showListingError, setShowListingError] = useState(false);
  const [file, setFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({});

  // ✅ FIX: Resolve id from both _id and id fields (mongoose returns _id)
  const userId = currentUser?.id || currentUser?._id;

  const handleUploadFile = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      notify.error("Only image files are allowed");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      notify.error("File size must be under 2MB");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const fd = new FormData();
      fd.append("avatar", file);

      const response = await clientBaseURL.post(
        clientEndPoints.uploadAvatar,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        },
      );

      if (response.data.success) {
        notify.success(response.data.message);
        // ✅ FIX: Normalize data to always have consistent shape
        const userData = response.data.data;
        dispatch(
          signInSuccess({
            id: userData.id || userData._id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar,
          }),
        );
      } else {
        notify.error(response.data.message || "Image upload failed");
      }
    } catch (err) {
      notify.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1500);
    }
  };

  useEffect(() => {
    if (file) handleUploadFile(file);
  }, [file]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const filteredData = Object.fromEntries(
      Object.entries(formData).filter(
        ([_, value]) => value !== "" && value !== undefined,
      ),
    );

    if (Object.keys(filteredData).length === 0) {
      notify.info("No changes to update");
      dispatch(updateUserFailure("No changes"));
      return;
    }

    try {
      dispatch(updateUserStart());

      // ✅ FIX: Use userId helper that handles both _id and id
      const response = await clientBaseURL.put(
        `${clientEndPoints.updateUser}/${userId}`,
        filteredData,
      );

      if (response.data.success) {
        const userData = response.data.data;
        dispatch(
          updateUserSuccess({
            id: userData.id || userData._id,
            username: userData.username,
            email: userData.email,
            avatar: userData.avatar,
          }),
        );
        notify.success(response.data.message);
      } else {
        dispatch(updateUserFailure(response.data.message));
        notify.error(response.data.message);
      }
    } catch (error) {
      dispatch(updateUserFailure(error.message));
      notify.error(error.response?.data?.message || "Update failed");
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      // ✅ FIX: Use userId helper
      const response = await clientBaseURL.delete(
        `${clientEndPoints.deleteUser}/${userId}`,
      );

      if (response.data.success) {
        dispatch(deleteUserSuccess());
        notify.success(response.data.message);
        navigate("/sign-in");
      } else {
        dispatch(deleteUserFailure(response.data.message));
        notify.error(response.data.message);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
      notify.error(error.response?.data?.message || "Delete failed");
    }
  };

  const handleSignOut = async () => {
    try {
      dispatch(signoutUserStart());

      // ✅ UNCHANGED — keeping GET as per your current backend route
      const response = await clientBaseURL.post(clientEndPoints.signout);

      if (response.data.success) {
        dispatch(signoutUserSuccess());
        notify.success(response.data.message);
        navigate("/sign-in");
      } else {
        dispatch(signoutUserFailure(response.data.message));
        notify.error(response.data.message);
      }
    } catch (error) {
      // ✅ FIX: optional chaining so it doesn't crash if server unreachable
      dispatch(
        signoutUserFailure(error?.response?.data?.message || error.message),
      );
      notify.error(error?.response?.data?.message || "Signout failed");
    }
  };

  const handleShowListing = async () => {
    if (showListings) {
      setShowListings(false);
      return;
    }
    try {
      setShowListingError(false);

      // ✅ FIX: Use userId helper
      const response = await clientBaseURL.get(
        `${clientEndPoints.showListing}/${userId}`,
      );
      if (response.data.success) {
        setUserListings(response.data.data);
        setShowListings(true);
      }
    } catch (error) {
      // ✅ FIX: optional chaining — won't crash if server unreachable
      setShowListingError(
        error?.response?.data?.message || "Failed to load listings",
      );
    }
  };

  const handleDeleteListing = async (listingId) => {
    try {
      const response = await clientBaseURL.delete(
        `${clientEndPoints.deleteListing}/${listingId}`,
      );
      if (response.data.success) {
        setUserListings((prev) =>
          prev.filter((listing) => listing._id !== listingId),
        );
        notify.success(response.data.message);
      }
    } catch (error) {
      notify.error(error.response?.data?.message || "Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-stone-50 to-amber-50/40 py-10 px-4">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div className="absolute -top-40 -right-32 w-80 h-80 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 rounded-full bg-orange-100/40 blur-3xl" />
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* ── Profile Card ── */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-1.5 bg-linear-to-r from-amber-400 via-orange-400 to-rose-400" />

          <div className="px-8 py-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-stone-800 tracking-tight">
                My Profile
              </h1>
              <p className="text-sm text-stone-500 mt-1">
                Manage your account details and listings
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-3 mb-2">
                <div className="relative group">
                  <img
                    src={currentUser?.avatar}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    onClick={() => fileInputRef.current.click()}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-white shadow-lg shadow-stone-200 cursor-pointer transition-all duration-200 group-hover:ring-amber-300"
                  />
                  {/* Overlay on hover */}
                  <div
                    onClick={() => fileInputRef.current.click()}
                    className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
                  >
                    <svg
                      className="w-6 h-6 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                  </div>
                </div>

                <p className="text-xs text-stone-400">
                  Click photo to change · Max 2MB
                </p>

                {/* Upload progress bar */}
                {uploading && (
                  <div className="w-48">
                    <div className="flex justify-between text-xs text-stone-500 mb-1">
                      <span>Uploading…</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-1.5">
                      <div
                        className="bg-linear-to-r from-amber-400 to-orange-400 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}

                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>

              {/* Fields */}
              <InputField
                labeltext="Username"
                labelfor="username"
                type="text"
                name="username"
                id="username"
                defaultValue={currentUser?.username}
                onChange={handleChange}
                placeholder="Your username"
              />

              <InputField
                labeltext="Email address"
                labelfor="email"
                type="email"
                name="email"
                id="email"
                defaultValue={currentUser?.email}
                onChange={handleChange}
                placeholder="your@email.com"
              />

              <PasswordField
                labelfor="password"
                labeltext="New Password"
                name="password"
                id="password"
                onChange={handleChange}
                placeholder="Leave blank to keep current"
              />

              {/* Update button */}
              <Button
                type="submit"
                disabled={loading}
                className="bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200 hover:shadow-amber-300 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Saving…
                  </span>
                ) : (
                  "Save Changes"
                )}
              </Button>

              {/* Create listing button */}
              <Button
                type="button"
                onClick={() => navigate("/create-listing")}
                className="bg-white! text-stone-700! border border-stone-200 hover:bg-stone-50! hover:border-stone-300 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-4 h-4 text-amber-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Create New Listing
                </span>
              </Button>
            </form>

            {/* Danger zone */}
            <div className="flex justify-between items-center mt-6 pt-5 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6l-1 14H6L5 6" />
                  <path d="M10 11v6M14 11v6" />
                  <path d="M9 6V4h6v2" />
                </svg>
                Delete Account
              </button>
              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 font-medium transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* ── Listings Card ── */}
        <div className="bg-white/85 backdrop-blur-md rounded-3xl shadow-xl shadow-stone-200/50 border border-white/60 overflow-hidden">
          <div className="h-1.5 bg-linear-to-r from-amber-400 via-orange-400 to-rose-400" />

          <div className="px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-stone-800">
                  My Listings
                </h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  {userListings.length > 0
                    ? `${userListings.length} listing${userListings.length > 1 ? "s" : ""}`
                    : "No listings yet"}
                </p>
              </div>
              <button
                type="button"
                onClick={handleShowListing}
                className="flex items-center gap-1.5 text-sm font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg transition-all duration-150"
              >
                {showListings ? (
                  <>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                    Hide
                  </>
                ) : (
                  <>
                    <svg
                      className="w-4 h-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                    Show
                  </>
                )}
              </button>
            </div>

            {/* Error */}
            {showListingError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">
                <svg
                  className="w-4 h-4 shrink-0"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {showListingError}
              </div>
            )}

            {/* Listings list */}
            {showListings && (
              <ul className="space-y-3">
                {userListings.length === 0 ? (
                  <li className="text-center py-10 text-stone-400">
                    <svg
                      className="w-10 h-10 mx-auto mb-3 text-stone-300"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                    >
                      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                    <p className="text-sm font-medium">No listings yet</p>
                    <p className="text-xs mt-1">
                      Create your first listing to get started
                    </p>
                  </li>
                ) : (
                  userListings.map((listing) => (
                    <li
                      key={listing._id}
                      className="flex items-center gap-4 bg-stone-50 hover:bg-stone-100/80 border border-stone-200 rounded-2xl px-4 py-3 transition-all duration-150 group"
                    >
                      {/* Thumbnail */}
                      <Link to={`/listing/${listing._id}`} className="shrink-0">
                        <img
                          src={listing.imageUrls[0]}
                          alt={listing.title}
                          className="w-16 h-14 rounded-xl object-cover shadow-sm group-hover:shadow-md transition-shadow"
                        />
                      </Link>

                      {/* Title */}
                      <Link
                        to={`/listing/${listing._id}`}
                        className="flex-1 min-w-0"
                      >
                        <p className="text-sm font-semibold text-stone-700 truncate hover:text-amber-600 transition-colors">
                          {listing.title}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5 truncate">
                          {listing.address}
                        </p>
                      </Link>

                      {/* Actions */}
                      <div className="flex items-center gap-2 shrink-0">
                        <Link to={`/update-listing/${listing._id}`}>
                          <button
                            type="button"
                            className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 px-2.5 py-1.5 rounded-lg transition-all"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                            </svg>
                            Edit
                          </button>
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteListing(listing._id)}
                          className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-lg transition-all"
                        >
                          <svg
                            className="w-3.5 h-3.5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14H6L5 6" />
                            <path d="M10 11v6M14 11v6" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full border border-stone-100 z-10">
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-7 h-7 text-red-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-stone-800 text-center mb-2">
              Delete Account?
            </h3>
            <p className="text-sm text-stone-500 text-center mb-6">
              This will permanently delete your account and all your listings.
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 text-sm font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDeleteUser();
                }}
                className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors shadow-md shadow-red-200"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;