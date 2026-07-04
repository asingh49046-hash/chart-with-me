const ADMIN_EMAIL = "admin@chartwithme.com";
const ADMIN_PASSWORD = "admin123";

window.login = () => {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    localStorage.setItem("chartWithMeAdmin", "true");
    window.location.href = "admin.html";
  } else {
    alert("Wrong Email or Password");
  }
};
