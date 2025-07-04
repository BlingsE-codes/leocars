// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDEfiEmVo5hyps1inEz_ST6SeAQdG5uXfc",
  authDomain: "leos-cars.firebaseapp.com",
  projectId: "leos-cars",
  storageBucket: "leos-cars.appspot.com",
  messagingSenderId: "539030428964",
  appId: "1:539030428964:web:5148bb13e934a64cf367b1"
};
export default firebaseConfig;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };

export const analytics = getAnalytics(app); // Optional, if you want to use Firebase Analytics