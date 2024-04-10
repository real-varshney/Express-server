import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyCUOnREeXk1IdqgUx8f3zhQwHf0hLWqlsc",
  authDomain: "dribbble-b624e.firebaseapp.com",
  projectId: "dribbble-b624e",
  storageBucket: "dribbble-b624e.appspot.com",
  messagingSenderId: "912176857389",
  appId: "1:912176857389:web:2da58889dec407e13893a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);