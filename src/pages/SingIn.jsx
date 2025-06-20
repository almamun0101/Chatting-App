import React, { useState } from "react";
import { MdMarkEmailUnread } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../slices/userslice";

const SignIn = () => {
  const dispatch = useDispatch();
  const nevigate = useNavigate();
  const auth = getAuth();
  const provider = new GoogleAuthProvider();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleEmail = (e) => {
    setLoginInfo((pre) => ({
      ...pre,
      email: e.target.value,
    }));
  };

  const handlePassword = (e) => {
    setLoginInfo((pre) => ({
      ...pre,
      password: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;

    if (!email || !password) {
      toast.error("Please fill in all fields.");
      return;
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user.emailVerified) {
          dispatch(userLoginInfo(user));
          localStorage.setItem("login", JSON.stringify(user));
          nevigate("/");
        } else {
          toast.error("Please verify Your Mail From your email");
        }
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        toast.error("Invalid email or password.");
      });
  };
  const handleGoogleLogIn = () => {
    console.log("ggole");
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        dispatch(userLoginInfo(user));
        nevigate("/");
      })
      .catch((error) => {
        console.log("error" + error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-black text-white font-sans">
      <img
        src="https://wallpaperaccess.com/full/5651980.jpg"
        alt="Tech Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <Toaster position="top-center" reverseOrder={false} />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/70 via-[#1a1a1a]/60 to-[#0f0f0f]/70 backdrop-blur-md"></div>
      <div className="relative z-10 rounded-2xl shadow-2xl bg-[#111111]/80 p-10 max-w-md w-full border border-gray-700">
        <div className="w-20 h-20 mx-auto -mt-20 mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-cyan-500 shadow-md"
          />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-center text-cyan-300 tracking-wide">
          Login to AI Account
        </h2>
        <button
          onClick={handleGoogleLogIn}
          className="text-white bg-cyan-700 px-4 py-1 mb-4 rounded-xl"
        >
          Sign With Google
        </button>
        <form onSubmit={handleLogin}>
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-gray-300 font-medium mb-1"
            >
              Email
            </label>
            <div className="flex items-center gap-3 px-4 py-2 border border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 bg-black/50">
              <MdMarkEmailUnread className="text-xl text-cyan-400" />
              <input
                type="email"
                id="email"
                onChange={handleEmail}
                placeholder="example@email.com"
                className="outline-none bg-transparent text-white w-full placeholder-gray-500"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 font-medium mb-1"
            >
              Password
            </label>
            <div className="flex items-center gap-3 px-4 py-2 border border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 bg-black/50">
              <TbLockPassword className="text-xl text-cyan-400" />
              <input
                type="password"
                id="password"
                onChange={handlePassword}
                placeholder="••••••••"
                className="outline-none bg-transparent text-white w-full placeholder-gray-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-full py-3 rounded-xl font-semibold hover:shadow-cyan-400/50 hover:shadow-md transition-all duration-200"
          >
            Log In
          </button>

          <p className="text-center mt-5 text-sm text-gray-400">
            Don't have an account?{" "}
            <Link
              className="text-cyan-400 hover:underline font-medium"
              to="/signup"
            >
              Register Here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
