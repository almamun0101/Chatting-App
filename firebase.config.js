// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDC4_FYqAotFDGGj4ZKuWTZbMYLsekiJPw",
  authDomain: "chatingapp-c4476.firebaseapp.com",
  projectId: "chatingapp-c4476",
  storageBucket: "chatingapp-c4476.firebasestorage.app",
  messagingSenderId: "207149608358",
  appId: "1:207149608358:web:168d8e9a778288da337367",
  measurementId: "G-2Q0MCSPSN8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);