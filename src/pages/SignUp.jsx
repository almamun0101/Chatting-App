import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";
import { app, auth } from "../../firebase.config";
import { getDatabase, ref, set } from "firebase/database";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { Link, useNavigate } from "react-router";

const SignUp = () => {
  const db = getDatabase();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setUserInfo((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const { name, email, password } = userInfo;

    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      toast.error("Please enter a valid email");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        sendEmailVerification(user)
          .then(() => {
            updateProfile(user, {
              displayName: name,
              photoURL:
                "https://img.freepik.com/premium-vector/person-with-blue-shirt-that-says-name-person_1029948-7040.jpg?semt=ais_hybrid&w=740",
            })
              .then(() => {
                set(ref(db, "userslist/" + user.uid), {
                  name,
                  email: user.email,
                  img: user.photoURL,
                })
                  .then(() => {
                    toast.success("Check your email for verification");
                    navigate("/signin");
                  })
                  .catch((error) => console.error("DB Error:", error));
              })
              .catch((error) => console.error("Profile Update Error:", error));
          })
          .catch((error) => console.error("Email Verification Error:", error));
      })
      .catch((error) => {
        toast.error(error.message);
        console.error("Signup Error:", error);
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
      <Toaster position="top-center" reverseOrder={false} />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center mb-6">
          Create Account
        </h2>

        <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            id="name"
            value={userInfo.name}
            onChange={handleChange}
            placeholder="Your Name"
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="email"
            id="email"
            value={userInfo.email}
            onChange={handleChange}
            placeholder="example@email.com"
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <input
            type="password"
            id="password"
            value={userInfo.password}
            onChange={handleChange}
            placeholder="••••••••"
            className="px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
          />
          <button
            type="submit"
            className="py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-gray-300" />
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <hr className="flex-grow border-t border-gray-300" />
        </div>

        

        <p className="text-center text-gray-600 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/signin" className="underline hover:text-cyan-500">
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default SignUp;
