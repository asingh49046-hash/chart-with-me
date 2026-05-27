import { initializeApp }
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

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

const chatList = document.getElementById("chatList");

onSnapshot(collection(db, "messages"), (snapshot) => {

  chatList.innerHTML = "";

  snapshot.forEach((docSnap) => {

    const data = docSnap.data();

    const box = document.createElement("div");

    box.classList.add("chat-box");

    box.innerHTML = `

      <div class="user-msg">

        <p>
          <b>User:</b>
          ${data.text || ""}
        </p>

        ${
          data.pdfURL
          ?
          `
          <a
            href="${data.pdfURL}"
            target="_blank"
          >
            📄 Open PDF
          </a>
          `
          :
          ""
        }

      </div>

      <p style="margin-top:10px;">
        <b>Admin Reply:</b>
        ${data.reply || "No Reply"}
      </p>

      <input
        type="text"
        placeholder="Type reply..."
        class="admin-reply"
        id="reply-${docSnap.id}"
      >

      <div class="btns">

        <button
          class="reply-btn"
          onclick="replyMessage('${docSnap.id}')"
        >
          Reply
        </button>

        <button
          class="delete-btn"
          onclick="deleteMessage('${docSnap.id}')"
        >
          Delete
        </button>

      </div>

    `;

    chatList.appendChild(box);

  });

});

window.replyMessage = async (id) => {

  const input =
    document.getElementById(`reply-${id}`);

  const replyText = input.value;

  if(replyText === ""){

    alert("Reply likho");

    return;

  }

  await updateDoc(doc(db, "messages", id), {

    reply: replyText

  });

  input.value = "";

};

window.deleteMessage = async (id) => {

  const confirmDelete =
    confirm("Delete this chat?");

  if(confirmDelete){

    await deleteDoc(doc(db, "messages", id));

  }

};