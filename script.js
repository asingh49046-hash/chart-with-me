import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyB-3uYxLEgcDYmVTIcaYWXHYkVasKN09OQ",
  authDomain: "chart-with-me-af88f.firebaseapp.com",
  databaseURL: "https://chart-with-me-af88f-default-rtdb.firebaseio.com",
  projectId: "chart-with-me-af88f",
  storageBucket: "chart-with-me-af88f.firebasestorage.app",
  messagingSenderId: "509245130466",
  appId: "1:509245130466:web:bb8635333a04175c7980bb",
  measurementId: "G-GJ61RQH7B0"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const messages = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");

window.sendMessage = async () => {
  const text = messageInput.value.trim();

  if (text === "") {
    alert("Message likho");
    return;
  }

  await addDoc(collection(db, "messages"), {
    text: text,
    reply: "",
    adminFileURL: "",
    adminFileName: "",
    adminFileType: "",
    time: Date.now()
  });

  messageInput.value = "";
};

messageInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    window.sendMessage();
  }
});

const messagesQuery = query(collection(db, "messages"), orderBy("time", "asc"));

onSnapshot(messagesQuery, (snapshot) => {
  messages.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const box = document.createElement("div");
    box.classList.add("message");

    let adminFileHTML = "";

    if (data.adminFileURL) {
      if (data.adminFileType && data.adminFileType.startsWith("image/")) {
        adminFileHTML = `
          <p><b>Admin File:</b></p>
          <img class="admin-image" src="${data.adminFileURL}" alt="Admin uploaded image">
          <br>
          <a class="pdf-link" href="${data.adminFileURL}" target="_blank">Open Image</a>
        `;
      } else {
        adminFileHTML = `
          <p><b>Admin File:</b> ${data.adminFileName || "File"}</p>
          <a class="pdf-link" href="${data.adminFileURL}" target="_blank">Open / Download File</a>
        `;
      }
    }

    box.innerHTML = `
      <p>${data.text || ""}</p>
      ${data.reply ? `<p><b>Admin:</b> ${data.reply}</p>` : ""}
      ${adminFileHTML}
    `;

    messages.appendChild(box);
  });

  messages.scrollTop = messages.scrollHeight;
});

const canvas = document.getElementById("matrix");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const chars = "01ABCDEFGHIJKLMNOPQRSTUVWXYZ@$#%^&*";
const fontSize = 14;
let columns = canvas.width / fontSize;
let drops = [];

function resetDrops() {
  columns = canvas.width / fontSize;
  drops = [];
  for (let x = 0; x < columns; x++) {
    drops[x] = 1;
  }
}

resetDrops();
window.addEventListener("resize", resetDrops);

function draw() {
  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#00ff99";
  ctx.font = fontSize + "px monospace";

  for (let i = 0; i < drops.length; i++) {
    const text = chars.charAt(Math.floor(Math.random() * chars.length));
    ctx.fillText(text, i * fontSize, drops[i] * fontSize);

    if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

setInterval(draw, 35);
