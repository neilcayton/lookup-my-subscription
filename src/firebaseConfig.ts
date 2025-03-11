// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHDND0_omqqeVmVHgn6ff3ZJ96KY1SDoI",
  authDomain: "lookup-88a6f.firebaseapp.com",
  projectId: "lookup-88a6f",
  storageBucket: "lookup-88a6f.firebasestorage.app",
  messagingSenderId: "1040585476012",
  appId: "1:1040585476012:web:55b01d09332706f75a1c09",
  measurementId: "G-MVRVBX0DQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);