// firebase.js
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDsP8MpTnb_C_8EQhA2IWGSvwcSKWGzbkw",
  authDomain: "exe201-6d7f0.firebaseapp.com",
  projectId: "exe201-6d7f0",
  storageBucket: "exe201-6d7f0.appspot.com",
  messagingSenderId: "143158643557",
  appId: "1:143158643557:web:14cdd5a55c6b8e7e35ef8c",
  measurementId: "G-SG8H263QYS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(app);

export { storage };
