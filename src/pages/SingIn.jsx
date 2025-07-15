import React, { useState } from "react";
import { MdMarkEmailUnread } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "../../firebase.config";
import { Link, useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { userLoginInfo } from "../slices/userslice";
import { getDatabase, ref, set } from "firebase/database";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const SignIn = () => {
  const db = getDatabase();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const handleEmail = (e) => {
    setLoginInfo((prev) => ({
      ...prev,
      email: e.target.value,
    }));
  };

  const handlePassword = (e) => {
    setLoginInfo((prev) => ({
      ...prev,
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
          navigate("/");
        } else {
          toast.error("Please verify your email first.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error.message);
        toast.error("Invalid email or password.");
      });
  };

  const handleGoogleLogIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;

        set(ref(db, "userslist/" + user.uid), {
          name: user.displayName,
          email: user.email,
          img: user.photoURL,
        })
          .then(() => {
            dispatch(userLoginInfo(user));
            toast.success("Login successful!");
            navigate("/");
          })
          .catch((error) => {
            console.log(error);
            toast.error("Failed to save user data.");
          });
      })
      .catch((error) => {
        console.log("Google login error:", error);
        toast.error("Google login failed.");
      });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-400 to-blue-500 overflow-hidden">
      <Toaster />
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Welcome Back
        </h2>
        <form className="flex flex-col space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            onChange={handleEmail}
            placeholder="example@email.com"
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            onChange={handlePassword}
            placeholder="••••••••"
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        <div className="flex justify-center space-x-4">
          <button
            className="p-3 bg-gray-100 rounded-full text-gray-600 hover:bg-gray-200 transition"
            onClick={handleGoogleLogIn}
          >
            <FaGoogle />
          </button>
         
        </div>

        <p className="text-center text-gray-600 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="underline hover:text-cyan-500">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignIn;
