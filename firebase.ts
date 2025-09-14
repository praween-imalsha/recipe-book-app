import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // ✅ use firebase/storage instead of @firebase/storage

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDu5I49-HgkTJSqR7-Nn0kiTrjMNF97ZUE",
    authDomain: "task-manger-app-cb1e4.firebaseapp.com",
    projectId: "task-manger-app-cb1e4",
    storageBucket: "task-manger-app-cb1e4.appspot.com", // ✅ FIXED
    messagingSenderId: "114737276256",
    appId: "1:114737276256:web:4e9948b034e36056e22a05",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app); // ✅ works now
