import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-3uYxLEgcDYmVTIcaYWXHYkVasKN09OQ",
  authDomain: "chart-with-me-af88f.firebaseapp.com",
  projectId: "chart-with-me-af88f",
  storageBucket: "chart-with-me-af88f.firebasestorage.app",
  messagingSenderId: "509245130466",
  appId: "1:509245130466:web:bb8635333a04175c7980bb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = async () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);
    window.location.href = "admin.html";
  } catch (error) {
    alert("Wrong Email or Password");
  }
};
