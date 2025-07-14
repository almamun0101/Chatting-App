// import React, { useState } from "react";
// import { MdMarkEmailUnread } from "react-icons/md";
// import { TbLockPassword } from "react-icons/tb";
// import toast, { Toaster } from "react-hot-toast";
// import {
//   getAuth,
//   signInWithEmailAndPassword,
//   signInWithPopup,
//   GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "../../firebase.config";
// import { Link, useNavigate } from "react-router";
// import { useDispatch } from "react-redux";
// import { userLoginInfo } from "../slices/userslice";
// import { getDatabase, ref, set } from "firebase/database";

// const SignIn = () => {
//   const db = getDatabase();
//   const dispatch = useDispatch();
//   const nevigate = useNavigate();
//   const auth = getAuth();
//   const provider = new GoogleAuthProvider();

//   const [loginInfo, setLoginInfo] = useState({
//     email: "",
//     password: "",
//   });

//   const handleEmail = (e) => {
//     setLoginInfo((pre) => ({
//       ...pre,
//       email: e.target.value,
//     }));
//   };

//   const handlePassword = (e) => {
//     setLoginInfo((pre) => ({
//       ...pre,
//       password: e.target.value,
//     }));
//   };

//   const handleLogin = (e) => {
//     e.preventDefault();
//     const { email, password } = loginInfo;

//     if (!email || !password) {
//       toast.error("Please fill in all fields.");
//       return;
//     }

//     signInWithEmailAndPassword(auth, email, password)
//       .then((userCredential) => {
//         const user = userCredential.user;
//         if (user.emailVerified) {
//           dispatch(userLoginInfo(user));
//           nevigate("/");
//         } else {
//           toast.error("Please verify Your Mail From your email");
//         }
//       })
//       .catch((error) => {
//         console.error("Login error:", error.message);
//         toast.error("Invalid email or password.");
//       });
//   };
//   const handleGoogleLogIn = () => {
//     console.log("ggole");
//     signInWithPopup(auth, provider)
//       .then((result) => {
//         // This gives you a Google Access Token. You can use it to access the Google API.
//         const credential = GoogleAuthProvider.credentialFromResult(result);
//         const token = credential.accessToken;
//         // The signed-in user info.
//         const user = result.user;
//         set(ref(db, "userslist/" + user.uid), {
//           name: user.displayName,
//           email: user.email,
//           img: user.photoURL,
//         })
//           .then(() => {
//             dispatch(userLoginInfo(user));
//             toast.success("Check Your mail for verification");
//             nevigate("/");
//           })
//           .catch((error) => {
//             console.log(error);
//           });
//       })
//       .catch((error) => {
//         console.log("error" + error);
//         // Handle Errors here.
//         const errorCode = error.code;
//         const errorMessage = error.message;
//         // The email of the user's account used.
//         const email = error.customData.email;
//         // The AuthCredential type that was used.
//         const credential = GoogleAuthProvider.credentialFromError(error);
//         // ...
//       });
//   };

//   return (
//     <div className="min-h-screen flex justify-center items-center relative overflow-hidden bg-black text-white font-sans">
//       <img
//         src="https://wallpaperaccess.com/full/5651980.jpg"
//         alt="Tech Background"
//         className="absolute inset-0 w-full h-full object-cover opacity-40"
//       />
//       <Toaster position="top-center" reverseOrder={false} />
//       <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f]/70 via-[#1a1a1a]/60 to-[#0f0f0f]/70 backdrop-blur-md"></div>
//       <div className="relative z-10 rounded-2xl shadow-2xl bg-[#111111]/80 p-10 max-w-md w-full border border-gray-700">
//         <div className="w-20 h-20 mx-auto -mt-20 mb-4">
//           <img
//             src="https://cdn-icons-png.flaticon.com/512/2922/2922510.png"
//             alt="Avatar"
//             className="w-full h-full object-cover rounded-full border-4 border-cyan-500 shadow-md"
//           />
//         </div>

//         <h2 className="text-2xl font-bold mb-4 text-center text-cyan-300 tracking-wide">
//           Login to AI Account
//         </h2>
//         <button
//           onClick={handleGoogleLogIn}
//           className="text-white bg-cyan-700 px-4 py-1 mb-4 rounded-xl"
//         >
//           Sign With Google
//         </button>
//         <form onSubmit={handleLogin}>
//           <div className="mb-5">
//             <label
//               htmlFor="email"
//               className="block text-gray-300 font-medium mb-1"
//             >
//               Email
//             </label>
//             <div className="flex items-center gap-3 px-4 py-2 border border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 bg-black/50">
//               <MdMarkEmailUnread className="text-xl text-cyan-400" />
//               <input
//                 type="email"
//                 id="email"
//                 onChange={handleEmail}
//                 placeholder="example@email.com"
//                 className="outline-none bg-transparent text-white w-full placeholder-gray-500"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div className="mb-6">
//             <label
//               htmlFor="password"
//               className="block text-gray-300 font-medium mb-1"
//             >
//               Password
//             </label>
//             <div className="flex items-center gap-3 px-4 py-2 border border-gray-600 rounded-xl focus-within:ring-2 focus-within:ring-cyan-500 bg-black/50">
//               <TbLockPassword className="text-xl text-cyan-400" />
//               <input
//                 type="password"
//                 id="password"
//                 onChange={handlePassword}
//                 placeholder="••••••••"
//                 className="outline-none bg-transparent text-white w-full placeholder-gray-500"
//               />
//             </div>
//           </div>

//           <button
//             type="submit"
//             className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white w-full py-3 rounded-xl font-semibold hover:shadow-cyan-400/50 hover:shadow-md transition-all duration-200"
//           >
//             Log In
//           </button>

//           <p className="text-center mt-5 text-sm text-gray-400">
//             Don't have an account?{" "}
//             <Link
//               className="text-cyan-400 hover:underline font-medium"
//               to="/signup"
//             >
//               Register Here
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignIn;






import React from "react";
import { motion } from "framer-motion";
import { FaGoogle, FaFacebookF } from "react-icons/fa";

const LoginPage = () => {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-500 via-cyan-400 to-blue-500 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="backdrop-blur-xl  p-8 rounded-2xl shadow-2xl w-full max-w-md border border-white/20 bg-white"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Welcome Back
        </h2>
        <form className="flex flex-col space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="px-4 py-3 rounded-xl bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <input
            type="password"
            placeholder="Password"
            className="px-4 py-3 rounded-xl bg-white/20 placeholder-white text-white focus:outline-none focus:ring-2 focus:ring-cyan-300"
          />
          <button
            type="submit"
            className="py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold hover:scale-105 transition-transform"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-4">
          <hr className="flex-grow border-t border-white/30" />
          <span className="mx-2 text-white text-sm">or</span>
          <hr className="flex-grow border-t border-white/30" />
        </div>

        <div className="flex justify-center space-x-4">
          <button className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
            <FaGoogle />
          </button>
          <button className="p-3 bg-white/20 rounded-full text-white hover:bg-white/30 transition">
            <FaFacebookF />
          </button>
        </div>

        <p className="text-center text-white text-sm mt-6">
          Don't have an account?{" "}
          <a href="#" className="underline hover:text-cyan-200">
            Sign up
          </a>
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;











// import React from "react";
// import { motion } from "framer-motion";
// import { FaGoogle, FaFacebookF } from "react-icons/fa";

// const LoginPage = () => {
//   return (
//     <div className="relative min-h-screen flex flex-col md:flex-row items-center justify-center bg-white overflow-hidden font-sans text-blue-600 px-4">
//       <motion.div
//         initial={{ x: -200, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ duration: 1 }}
//         className="hidden md:block w-1/2 max-w-md"
//       >
//         <img
//           src="https://lottie.host/26d9f2b0-9dd2-4f2a-8fa3-5da112d34b56/yT6P4Uu4lb.json"
//           alt="Animated Illustration"
//           className="w-full h-auto object-contain"
//         />
//       </motion.div>

//       <motion.div
//         initial={{ opacity: 0, y: 50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.8 }}
//         className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-blue-100"
//       >
//         <h2 className="text-3xl font-extrabold text-center mb-6">Welcome Back</h2>

//         <motion.p
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ delay: 0.6 }}
//           className="text-center text-sm text-blue-500 mb-4"
//         >
//           Start your journey with us. Please login to continue!
//         </motion.p>

//         <form className="flex flex-col space-y-4">
//           <motion.input
//             initial={{ x: -100, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2 }}
//             type="email"
//             placeholder="Email"
//             className="px-4 py-3 rounded-xl bg-blue-50 placeholder-blue-400 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />
//           <motion.input
//             initial={{ x: 100, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.4 }}
//             type="password"
//             placeholder="Password"
//             className="px-4 py-3 rounded-xl bg-blue-50 placeholder-blue-400 text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
//           />

//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             transition={{ delay: 0.6 }}
//             className="flex items-center space-x-2"
//           >
//             <input type="checkbox" id="remember" className="accent-blue-500" />
//             <label htmlFor="remember" className="text-sm text-blue-600">Remember me</label>
//           </motion.div>

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             className="py-3 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 text-white font-bold transition-transform"
//           >
//             Login
//           </motion.button>
//         </form>

//         <div className="flex items-center my-4">
//           <hr className="flex-grow border-t border-blue-200" />
//           <span className="mx-2 text-sm text-blue-500">or</span>
//           <hr className="flex-grow border-t border-blue-200" />
//         </div>

//         <div className="flex justify-center space-x-4">
//           <motion.button whileHover={{ scale: 1.1 }} className="p-3 bg-blue-50 rounded-full hover:bg-blue-100 transition text-blue-600">
//             <FaGoogle />
//           </motion.button>
//           <motion.button whileHover={{ scale: 1.1 }} className="p-3 bg-blue-50 rounded-full hover:bg-blue-100 transition text-blue-600">
//             <FaFacebookF />
//           </motion.button>
//         </div>

//         <p className="text-center text-sm mt-6 text-blue-600">
//           Don't have an account?{' '}
//           <a href="#" className="underline hover:text-blue-400">
//             Sign up
//           </a>
//         </p>
//       </motion.div>
//     </div>
//   );
// };

// export default LoginPage;
