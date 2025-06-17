// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAsZtVtrdNwji0EBu1x_qDSXiL84QlYqBE",
  authDomain: "home-automation-55d2d.firebaseapp.com",
  databaseURL: "https://home-automation-55d2d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "home-automation-55d2d",
  storageBucket: "home-automation-55d2d.firebasestorage.app",
  messagingSenderId: "359082612996",
  appId: "1:359082612996:web:cb9ef747589a3ceeead851"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);