
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBx93x1pmatSkf-OS75XZa2iyJD8LmirOs",
  authDomain: "react-recipe-app-joe-arteaga.firebaseapp.com",
  projectId: "react-recipe-app-joe-arteaga",
  storageBucket: "react-recipe-app-joe-arteaga.appspot.com",
  messagingSenderId: "92480329263",
  appId: "1:92480329263:web:0316ae87ac3bca213198da"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}