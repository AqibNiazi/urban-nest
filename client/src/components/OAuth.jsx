import React from "react";
import { FcGoogle } from "react-icons/fc";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "@/firebase";
import { clientBaseURL, clientEndPoints } from "@/config";
import { useDispatch } from "react-redux";
import { signInSuccess } from "@/store/user/userSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      const response = await clientBaseURL.post(clientEndPoints.google, {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });

      toast.success(response.data.message);
      dispatch(signInSuccess(response?.data?.data));
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium 
                 text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm 
                 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-indigo-500"
    >
      {/* ✅ Render icon as a component */}
      <span className="mr-2 text-lg">
        <FcGoogle />
      </span>
      Continue with Google
    </button>
  );
};

export default OAuth;
