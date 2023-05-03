import { app } from "../firebaseConfig.js"
import { getAuth, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"

const auth = getAuth(app);

const form = document.getElementById("form");

form.addEventListener("submit", (event) => {
   event.preventDefault();
   
   const email = document.getElementById("email").value;
   sendPasswordResetEmail(auth, email)
   .then(() => {
      alert("Email inviata!");
   }) 
   .catch(() => {
      alert("Errore nell'invio della mail");
   })
})
