import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.12.0/firebase-auth.js";

// ✅ PASTE YOUR REAL CONFIG HERE
const firebaseConfig = {
  apiKey: "AIzaSyCVLoGB4S25-HSHx_HCtltGs1u_-U4n9lE",
  authDomain: "danwilhs-store.firebaseapp.com",
  projectId: "danwilhs-store",
  appId: "1:486741086200:web:aa764d7bb19dd2af7a500d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// ✅ LOGIN
window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("Login successful");

    window.location.href = "admin.html";

  } catch (err) {
    console.error(err);
    alert(err.message); // 👈 show real error
  }
};