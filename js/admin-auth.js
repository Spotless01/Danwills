import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// ✅ SAME config
const firebaseConfig = {
  apiKey: "AIzaSyCVLoGB4S25-HSHx_HCtltGs1u_-U4n9lE",
  authDomain: "danwilhs-store.firebaseapp.com",
  projectId: "danwilhs-store",
  appId: "1:486741086200:web:aa764d7bb19dd2af7a500d"
};

// ✅ FIX: Prevent duplicate app error
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);

// 🔒 Protect admin page
onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "admin-login.html";
  }
});

// 🚪 Logout
function logout() {
  signOut(auth)
    .then(() => {
      window.location.href = "admin-login.html";
    })
    .catch(err => {
      console.error("Logout error:", err);
    });
}

// ✅ VERY IMPORTANT (fixes "logout is not defined")
window.logout = logout;