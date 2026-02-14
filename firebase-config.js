// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-storage.js";

// ✅ Your Firebase config (keep exactly like Firebase console)
const firebaseConfig = {
  apiKey: "AIzaSyCitGXAxAYhTZYBbDJJZUV5EUagSHJQs_w",
  authDomain: "red-store-1f08e.firebaseapp.com",
  projectId: "red-store-1f08e",
  storageBucket: "red-store-1f08e.firebasestorage.app",
  messagingSenderId: "273095451572",
  appId: "1:273095451572:web:cd57e96d7d29718ad0c8e1",
  measurementId: "G-K7PWJ3CP3Y"
};

// ✅ Owner email (the ONLY email allowed to edit)
export const OWNER_EMAIL = "salahhanna86@gmail.com";

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
