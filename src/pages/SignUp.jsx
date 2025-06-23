import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { MdMarkEmailUnread } from "react-icons/md";
import { TbLockPassword } from "react-icons/tb";
import toast, { Toaster } from "react-hot-toast";
import { app, auth  } from "../../firebase.config";
import { getDatabase, ref, set } from "firebase/database";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { Link, useNavigate } from "react-router";

const SignUp = () => {
  const db = getDatabase();
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const handleName = (e) => {
    setUserInfo((pre) => {
      return { ...pre, name: e.target.value };
    });
  };
  const handleEmail = (e) => {
    setUserInfo((pre) => {
      return { ...pre, email: e.target.value };
    });
  };
  const handlePasword = (e) => {
    setUserInfo((pre) => {
      return { ...pre, password: e.target.value };
    });
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInfo.name || !userInfo.email || !userInfo.password) {
      toast.error("Fill All Information");
    } else if (
      !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userInfo.email)
    ) {
      toast.error("Vaild Email");
    } else {
      createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password)
        .then((userCredential) => {
           const user = userCredential.user;
          sendEmailVerification(auth.currentUser)
            .then(() => {
              updateProfile(auth.currentUser, {
                displayName: userInfo.name,
                photoURL: "https://example.com/jane-q-user/profile.jpg",
              })
                .then(() => {
               
                  set(ref(db, "userslist/" + user.uid), {
                    name: user.displayName,
                    email: user.email,
                  })
                    .then(() => {
                      navigate("/signin");
                      toast.success("Check Your mail for verification");
                      console.log("done sending data to rdb")
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                })
                .catch((error) => {
                  console.log(error);
                });

            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
          console.log(errorMessage);
        });
     
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-black text-white font-sans">
      {/* Background Image with Dark Tech Feel */}
      <img
        src="https://wallpaperaccess.com/full/5651980.jpg"
        alt="Tech Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      <Toaster position="top-center" reverseOrder={false} />
      {/* Dark Glass Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/70 via-[#1a1a1a]/60 to-[#0f0f0f]/70 backdrop-blur-md"></div>

      {/* Card */}
      <div className="relative z-10 rounded-2xl shadow-2xl bg-[#111111]/80 p-10 max-w-md w-full border border-gray-700">
        {/* Avatar Image */}
        <div className="w-20 h-20 mx-auto -mt-20 mb-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
            alt="Avatar"
            className="w-full h-full object-cover rounded-full border-4 border-cyan-500 shadow-md"
          />
        </div>

        {/* Heading */}
        <h2 className="text-2xl font-bold mb-8 text-center text-cyan-300 tracking-wide">
          Create Your Account
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-gray-300 font-medium mb-1"
            >
              Full Name
            </label>
            <div className="flex items-center gap-3 px-4 py-2 border border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 bg-black/50">
              <CiUser className="text-xl text-cyan-400" />
              <input
                type="text"
                id="name"
                onChange={handleName}
                placeholder="Your Name"
                className="outline-none bg-transparent text-white w-full placeholder-gray-500"
              />
            </div>
          </div>

          {/* Email */}
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
                onChange={handlePasword}
                placeholder="••••••••"
                className="outline-none bg-transparent text-white w-full placeholder-gray-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-full py-3 rounded-xl font-semibold hover:shadow-cyan-400/50 hover:shadow-md transition-all duration-200"
          >
            Sign Up
          </button>

          {/* Log In Link */}
          <p className="text-center mt-5 text-sm text-gray-400">
            Already have an account?{" "}
            <Link
              to="/signin"
              className="text-cyan-400 hover:underline font-medium"
            >
              Log In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
