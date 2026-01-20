import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signInSuccess } from "@/store/user/userSlice";
import Button from "@/components/Button";
import InputField from "@/components/InputField";
import PasswordField from "@/components/PasswordField";
import { clientBaseURL, clientEndPoints } from "@/config";
import { toast } from "react-toastify";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [file, setFile] = useState(undefined);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0); // ✅ track percentage
  const fileInputRef = useRef(null);

  const handleUploadFile = async (file) => {
    if (!file) return;
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
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setProgress(percent);
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(signInSuccess(response.data.data));
      } else {
        toast.error(response.data.message || "Image upload failed");
      }
    } catch (err) {
      console.error("Upload failed:", err);
      toast.error(err.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000); // reset after completion
    }
  };

  useEffect(() => {
    if (file) {
      handleUploadFile(file);
    }
  }, [file]);

  return (
    <div className="flex flex-col max-w-lg justify-center items-center mx-auto py-7">
      <h1 className="font-semibold text-3xl text-center mb-4">Profile</h1>
      <form className="w-full space-y-4 md:space-y-6">
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
          <p className="text-sm text-gray-500 text-center mt-1">
            Uploading {progress}%
          </p>
        )}

        <InputField
          labeltext="Username"
          labelfor="username"
          type="text"
          name="username"
          id="username"
          value={currentUser.username}
        />
        <InputField
          labeltext="Email"
          labelfor="email"
          type="email"
          name="email"
          id="email"
          value={currentUser.email}
        />
        <PasswordField
          labelfor="password"
          labeltext="Password"
          name="password"
          id="password"
        />
        <Button>Submit</Button>
        <div className="flex justify-between">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign Out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
