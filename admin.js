import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";

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
const chatList = document.getElementById("chatList");

const messagesQuery = query(collection(db, "messages"), orderBy("time", "asc"));

onSnapshot(messagesQuery, (snapshot) => {
  chatList.innerHTML = "";

  snapshot.forEach((docSnap) => {
    const data = docSnap.data();
    const box = document.createElement("div");
    box.classList.add("chat-box");

    let adminFileHTML = "";

    if (data.adminFileURL) {
      if (data.adminFileType && data.adminFileType.startsWith("image/")) {
        adminFileHTML = `
          <p><b>Admin Sent File:</b></p>
          <img src="${data.adminFileURL}" class="admin-preview" alt="Admin uploaded image">
          <br>
          <a href="${data.adminFileURL}" target="_blank">Open Image</a>
        `;
      } else {
        adminFileHTML = `
          <p><b>Admin Sent File:</b> ${data.adminFileName || "File"}</p>
          <a href="${data.adminFileURL}" target="_blank">Open / Download File</a>
        `;
      }
    }

    box.innerHTML = `
      <div class="user-msg">
        <p><b>User:</b> ${data.text || ""}</p>
      </div>

      <p><b>Admin Reply:</b> ${data.reply || "No Reply"}</p>
      ${adminFileHTML}

      <input
        type="text"
        class="admin-reply"
        id="reply-${docSnap.id}"
        placeholder="Type reply..."
      >

      <input
        type="file"
        class="admin-reply"
        id="file-${docSnap.id}"
        accept="image/*,.pdf,.doc,.docx,.txt,.zip,.ppt,.pptx,.xls,.xlsx"
      >

      <div class="btns">
        <button class="reply-btn" onclick="replyMessage('${docSnap.id}')">Reply</button>
        <button class="file-btn" onclick="sendAdminFile('${docSnap.id}')">Send File</button>
        <button class="delete-btn" onclick="deleteMessage('${docSnap.id}')">Delete</button>
      </div>
    `;

    chatList.appendChild(box);
  });
});

window.replyMessage = async (id) => {
  const input = document.getElementById(`reply-${id}`);
  const replyText = input.value.trim();

  if (replyText === "") {
    alert("Reply likho");
    return;
  }

  await updateDoc(doc(db, "messages", id), {
    reply: replyText
  });

  input.value = "";
};

window.sendAdminFile = async (id) => {
  const fileInput = document.getElementById(`file-${id}`);
  const file = fileInput.files[0];

  if (!file) {
    alert("File select karo");
    return;
  }

  const fileRef = ref(storage, "admin-files/" + Date.now() + "-" + file.name);
  await uploadBytes(fileRef, file);
  const fileURL = await getDownloadURL(fileRef);

  await updateDoc(doc(db, "messages", id), {
    adminFileURL: fileURL,
    adminFileName: file.name,
    adminFileType: file.type
  });

  fileInput.value = "";
};

window.deleteMessage = async (id) => {
  const confirmDelete = confirm("Delete this chat?");
  if (confirmDelete) {
    await deleteDoc(doc(db, "messages", id));
  }
};
