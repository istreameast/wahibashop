import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyD7Z8evKbGzyTZOXII8adPRolljPwZJ1rU",
  authDomain: "wahibashop-c1b89.firebaseapp.com",
  projectId: "wahibashop-c1b89",
  storageBucket: "wahibashop-c1b89.firebasestorage.app",
  messagingSenderId: "732620862942",
  appId: "1:732620862942:web:e2b19063cd54281a6dd94f",
  measurementId: "G-9Z1Q1G50QQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { db, app, analytics };
