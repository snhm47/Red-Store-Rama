// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCitGXAxAYhTZYBbDJJZUV5EUagSHJQs_w",
  authDomain: "red-store-1f08e.firebaseapp.com",
  projectId: "red-store-1f08e",
  storageBucket: "red-store-1f08e.appspot.com", // ✅ use appspot.com
  messagingSenderId: "273095451572",
  appId: "1:273095451572:web:cd57e96d7d29718ad0c8e1",
  measurementId: "G-K7PWJ3CP3Y"
};

// ✅ ONLY HERE
export const OWNER_EMAIL = "salahhanna86@gmail.com";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
