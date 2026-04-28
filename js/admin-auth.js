import { getApp, getApps, initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyCVLoGB4S25-HSHx_HCtltGs1u_-U4n9lE",
  authDomain: "danwilhs-store.firebaseapp.com",
  projectId: "danwilhs-store",
  appId: "1:486741086200:web:aa764d7bb19dd2af7a500d"
};

// INIT
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// 🔒 ONLY YOUR EMAIL
const ADMIN_EMAIL = "danwilhsfragrancehub@gmail.com";

// 🔥 LOCK PAGE IMMEDIATELY
document.body.style.display = "none";

onAuthStateChanged(auth, (user) => {

  if (!user || user.email !== ADMIN_EMAIL) {
    window.location.href = "admin-login.html";
    return;
  }

  // ✅ ONLY SHOW PAGE IF AUTHORIZED
  document.body.style.display = "block";
});

// LOGOUT
function logout() {
  signOut(auth).then(() => {
    window.location.href = "admin-login.html";
  });
}

// 🔒 AUTO LOGOUT when tab is closed or refreshed
window.addEventListener("beforeunload", () => {
  signOut(auth);
});

let timeout;

function resetTimer() {
  clearTimeout(timeout);

  timeout = setTimeout(() => {
    alert("Session expired. Logging out...");
    signOut(auth).then(() => {
      window.location.href = "admin-login.html";
    });
  }, 5 * 60 * 1000); // 5 minutes inactivity
}

// Track activity
["click", "mousemove", "keypress", "scroll"].forEach(event => {
  document.addEventListener(event, resetTimer);
});

// Start timer
resetTimer();

window.logout = logout;
