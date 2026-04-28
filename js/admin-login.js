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
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // 🔒 ONLY ALLOW YOUR ADMIN EMAIL
    const ADMIN_EMAIL = "danwilhsfragrancehub@gmail.com"; // 👈 change to your email

    if (user.email !== ADMIN_EMAIL) {
      alert("Access denied: Not an admin");

      await auth.signOut(); // 🔥 kick them out
      return;
    }

    window.location.href = "admin.html";

  } catch (err) {
    console.error(err);
    alert("Invalid login credentials");
  }
};
