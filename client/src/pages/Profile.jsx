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
} from "@/store/user/userSlice";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import PasswordField from "@/components/PasswordField";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "@/store/user/userSlice";
import { clientBaseURL, clientEndPoints } from "@/config";
import { notify } from "@/util/notify";
import { useNavigate, Link } from "react-router-dom";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentUser, loading } = useSelector((state) => state.user);
  const [userListings, setUserListings] = useState([]);
  const [showListingError, setShowListingError] = useState(false);
  const [file, setFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // ✅ track percentage
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({});

  const handleUploadFile = async (file) => {
    if (!file) return;

    // ✅ Validate before upload
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
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await clientBaseURL.post(
        clientEndPoints.uploadAvatar,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded * 100) / e.total)),
        },
      );

      if (response.data.success) {
        notify.success(response.data.message);
        dispatch(signInSuccess(response.data.data));
      } else {
        notify.error(response.data.message || "Image upload failed");
      }
    } catch (err) {
      notify.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  useEffect(() => {
    if (file) {
      handleUploadFile(file);
    }
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
      // ✅ Reset loading state
      dispatch(updateUserFailure("No changes"));
      return;
    }

    try {
      dispatch(updateUserStart());

      const response = await clientBaseURL.put(
        `${clientEndPoints.updateUser}/${currentUser.id}`,
        filteredData,
      );

      if (response.data.success) {
        dispatch(updateUserSuccess(response.data.data));
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
      const response = await clientBaseURL.delete(
        `${clientEndPoints.deleteUser}/${currentUser.id}`,
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

      const response = await clientBaseURL.get(clientEndPoints.signout);
      console.log("signout response", response);

      if (response.data.success) {
        dispatch(signoutUserSuccess());
        notify.success(response.data.message);
        navigate("/sign-in");
      } else {
        dispatch(signoutUserFailure(response.data.message));
        notify.error(response.data.message);
      }
    } catch (error) {
      dispatch(signoutUserFailure(error.message));
      notify.error(error.response?.data?.message || "Signout failed");
    }
  };

  const handleShowListing = async () => {
    try {
      const response = await clientBaseURL.get(
        `${clientEndPoints.showListing}/${currentUser.id}`,
      );
      if (response.data.success) {
        setUserListings(response.data.data);
      }
      console.log("show listing response", response);
    } catch (error) {
      setShowListingError(error.response.data.message);
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
  <div className="flex flex-col max-w-lg justify-center items-center mx-auto py-7">
    <h1 className="font-semibold text-3xl text-center mb-4">Profile</h1>
    <form className="w-full space-y-4 md:space-y-6" onSubmit={handleSubmit}>
      <input
        type="file"
        ref={fileInputRef}
        hidden
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <img
        src={currentUser.avatar}
        alt="Profile"
        className="rounded-full w-24 h-24 mx-auto cursor-pointer"
        onClick={() => fileInputRef.current.click()}
      />
      {uploading && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      )}

      <InputField
        labeltext="Username"
        labelfor="username"
        type="text"
        name="username"
        id="username"
        defaultValue={currentUser.username}
        onChange={handleChange}
      />
      <InputField
        labeltext="Email"
        labelfor="email"
        type="email"
        name="email"
        id="email"
        defaultValue={currentUser.email}
        onChange={handleChange}
      />
      <PasswordField
        labelfor="password"
        labeltext="Password"
        name="password"
        id="password"
        onChange={handleChange}
      />
      <Button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700"
        loading={loading}
      >
        {loading ? "Loading..." : "Update"}
      </Button>
      <Button
        type="button"
        className="bg-green-600 hover:bg-green-700"
        onClick={() => navigate("/create-listing")}
      >
        Create Listing
      </Button>
      <div className="flex justify-between">
        <button
          className="text-red-700 cursor-pointer"
          onClick={handleDeleteUser}
        >
          Delete Account
        </button>
        <button className="text-red-700 cursor-pointer" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </form>
    <button
      onClick={handleShowListing}
      type="button"
      className="text-green-700 cursor-pointer"
    >
      Show Listing
    </button>
    <p className="text-red-600">{showListingError}</p>
    <ul className="w-full mt-4">
      {userListings &&
        userListings.length > 0 &&
        userListings.map((listing) => (
          <li
            key={listing._id}
            className="w-full border border-gray-300 hover:border-gray-500 rounded-lg px-4 py-2 flex justify-between items-center gap-2 mb-4"
          >
            <Link to={`/listing/${listing._id}`}>
              <img
                src={listing.imageUrls[0]}
                alt="listing cover"
                className="h-20 w-25 object-contain"
              />
            </Link>
            <Link
              to={`/listing/${listing._id}`}
              className="text-slate-700 font-semibold flex-1 hover:underline truncate"
            >
              <p>{listing.title}</p>
            </Link>
            <div className="flex flex-col item-center">
              <button
                type="button"
                onClick={() => handleDeleteListing(listing._id)}
                className="text-red-700 uppercase cursor-pointer"
              >
                Delete
              </button>
              <Link to={`/update-listing/${listing._id}`}>
                <button className="text-green-700 uppercase cursor-pointer">
                  Edit
                </button>
              </Link>
            </div>
          </li>
        ))}
    </ul>
  </div>
);
};

export default Profile;
