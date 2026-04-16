import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCVLoGB4S25-HSHx_HCtltGs1u_-U4n9lE",
  authDomain: "danwilhs-store.firebaseapp.com",
  projectId: "danwilhs-store",
  storageBucket: "danwilhs-store.firebasestorage.app",
  messagingSenderId: "486741086200",
  appId: "1:486741086200:web:aa764d7bb19dd2af7a500d"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);