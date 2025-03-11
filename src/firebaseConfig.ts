// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

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

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);