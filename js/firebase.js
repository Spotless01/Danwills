import { initializeApp, getApps, getApp } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";

import { getFirestore } 
from "https://www.gstatic.com/firebasejs/12.12.0/firebase-firestore.js";

// YOUR CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCVLoGB4S25-HSHx_HCtltGs1u_-U4n9lE",
  authDomain: "danwilhs-store.firebaseapp.com",
  projectId: "danwilhs-store",
};

// ✅ PREVENT DUPLICATE INITIALIZATION
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(app);
