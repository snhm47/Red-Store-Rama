// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCitGXAxAYhTZYBbDJJZUV5EUagSHJQs_w",
  authDomain: "red-store-1f08e.firebaseapp.com",
  projectId: "red-store-1f08e",
};

export const OWNER_EMAIL = "salahhanna86@gmail.com";

export const fbApp = initializeApp(firebaseConfig);
export const auth = getAuth(fbApp);
export const db = getFirestore(fbApp);

// ---- Cloudinary (free image hosting) ----
export const CLOUDINARY_CLOUD_NAME = "dot841nic";
export const CLOUDINARY_UNSIGNED_PRESET = "z1pghcoi";
