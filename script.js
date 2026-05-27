import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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

const storage = getStorage(app);

const messages = document.getElementById("messages");

window.sendMessage = async () => {

  const text = document.getElementById("messageInput").value;

  const pdf = document.getElementById("pdfInput").files[0];

  if(text === "" && !pdf){

    alert("Message ya PDF bhejo");

    return;

  }

  let pdfURL = "";

  if(pdf){

    if(pdf.type !== "application/pdf"){

      alert("Sirf PDF upload kar sakte ho");

      return;

    }

    const storageRef = ref(
      storage,
      "pdfs/" + Date.now() + "-" + pdf.name
    );

    await uploadBytes(storageRef, pdf);

    pdfURL = await getDownloadURL(storageRef);

  }

  await addDoc(collection(db, "messages"), {

    text: text,

    pdfURL: pdfURL,

    reply: "",

    time: Date.now()

  });

  document.getElementById("messageInput").value = "";

  document.getElementById("pdfInput").value = "";

};

onSnapshot(collection(db, "messages"), (snapshot) => {

  messages.innerHTML = "";

  snapshot.forEach((doc) => {

    const data = doc.data();

    const box = document.createElement("div");

    box.classList.add("message");

    box.innerHTML = `

      <p>${data.text || ""}</p>

      ${
        data.pdfURL
        ?
        `<a
          href="${data.pdfURL}"
          target="_blank"
          class="pdf-link"
        >
          📄 Open PDF
        </a>`
        :
        ""
      }

      ${
        data.reply 
        ?
        `<p style="margin-top:10px;color:#22c55e;">
          <b>Admin:</b> ${data.reply}
        </p>`
        :
        ""
      }

    `;
    

    messages.appendChild(box);

  });

  messages.scrollTop = messages.scrollHeight;

});
const canvas = document.getElementById("matrix");

const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

const chars =
"01ABCDEFGHIJKLMNOPQRSTUVWXYZ@$#%^&*";

const fontSize = 14;

const columns =
canvas.width / fontSize;

const drops = [];

for(let x = 0; x < columns; x++){

  drops[x] = 1;

}

function draw(){

  ctx.fillStyle =
  "rgba(0,0,0,0.05)";

  ctx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  ctx.fillStyle = "#00ff99";

  ctx.font =
  fontSize + "px monospace";

  for(let i = 0; i < drops.length; i++){

    const text =
    chars.charAt(
      Math.floor(
        Math.random() * chars.length
      )
    );

    ctx.fillText(
      text,
      i * fontSize,
      drops[i] * fontSize
    );

    if(
      drops[i] * fontSize >
      canvas.height &&
      Math.random() > 0.975
    ){

      drops[i] = 0;

    }

    drops[i]++;

  }

}

setInterval(draw, 35);