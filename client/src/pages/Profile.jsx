import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signInSuccess,
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

const Profile = () => {
  const { currentUser, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // ✅ track percentage
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({});
  console.log(currentUser?.avatar);

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
    try {
      dispatch(updateUserStart());

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(
          ([_, value]) => value !== "" && value !== undefined,
        ),
      );

      if (Object.keys(filteredData).length === 0) {
        notify.info("No changes to update");
        return;
      }

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
      } else {
        dispatch(deleteUserFailure(response.data.message));
        notify.error(response.data.message);
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
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
          src={currentUser?.avatar}
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
        <Button>{loading ? "Loading..." : "Update"}</Button>
        <div className="flex justify-between">
          <span
            className="text-red-700 cursor-pointer"
            onClick={handleDeleteUser}
          >
            Delete Account
          </span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
