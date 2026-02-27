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

  // ✅ Logic UNCHANGED
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

      toast.success(response?.data?.message);
      dispatch(signInSuccess(response?.data?.data));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      className="flex items-center justify-center gap-3 w-full px-4 py-2.5 
                 text-sm font-semibold text-stone-700
                 bg-white border border-stone-200 rounded-xl
                 shadow-sm hover:shadow-md
                 hover:bg-stone-50 hover:border-stone-300
                 focus:outline-none focus:ring-2 focus:ring-amber-400/40
                 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
    >
      <FcGoogle className="w-5 h-5 shrink-0" />
      <span>Continue with Google</span>
    </button>
  );
};

export default OAuth;