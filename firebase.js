// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbK_ZSVW61HhLCF75tjQ4Eb5Pa6MQbTyA",
  authDomain: "nightenglenursinghome-5eb0a.firebaseapp.com",
  projectId: "nightenglenursinghome-5eb0a",
  storageBucket: "nightenglenursinghome-5eb0a.appspot.com",
  messagingSenderId: "206810350890",
  appId: "1:206810350890:web:3df9ab8992992f9940ca53"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);