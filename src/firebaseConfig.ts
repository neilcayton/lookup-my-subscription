// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHDND0_omqqeVmVHgn6ff3ZJ96KY1SDoI",
  authDomain: "lookup-88a6f.firebaseapp.com",
  projectId: "lookup-88a6f",
  storageBucket: "lookup-88a6f.appspot.com", 
  messagingSenderId: "1040585476012",
  appId: "1:1040585476012:web:55b01d09332706f75a1c09",
  measurementId: "G-MVRVBX0DQF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

// Set persistence to local to maintain session
// This helps with the auth/configuration-not-found error in some cases
// auth.setPersistence(browserLocalPersistence);

// Export initialized services
export { app, auth, storage, db, analytics };
export default firebaseConfig;