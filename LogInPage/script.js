import { app } from "../firebaseConfig.js"
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"

const auth = getAuth(app);

const form = document.getElementById("form");
const emailIn = document.getElementById("emailInput");
const passwordIn = document.getElementById("pwInput");

form.addEventListener("submit", (e) => {
   e.preventDefault(); //We prevent page refresh after submitting.
   var email = emailIn.value;
   var pw = passwordIn.value;
   signInWithEmailAndPassword(auth, email, pw)
   .then(() => {
      console.log("Successo Login");
      localStorage.setItem("user", email);
      window.location.href = "../HomePage/index.html";
   })
   .catch( () => {
      console.log("Errore login");
      alert("Indirizzo o Password sbagliati, o connessione fallita. Controlla la tua connessione e ritenta!");
      emailIn.value = "";
      passwordIn.value = "";
   })
})


