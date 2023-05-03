import { app } from "../firebaseConfig.js"
import { getAuth, createUserWithEmailAndPassword} from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { setDoc, getFirestore, doc } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"

const auth = getAuth(app);
const db = getFirestore();

const form = document.getElementById("form");
const emailIn = document.getElementById("emailInput");
const passwordIn = document.getElementById("pwInput");

form.addEventListener("submit", (e) => {
   e.preventDefault();
   const email = emailIn.value;
   const pw = passwordIn.value;
   createUserWithEmailAndPassword(auth, email, pw)
   .then(() => {
      setDoc(doc(db, "utenti", email), { })
      .then(() => {
         localStorage.setItem("user", email);
         window.location.assign("../HomePage/index.html")
      })
      .catch((error) => alert(error.message))
      
   })
   .catch( () => {
      console.log("Errore");
      alert("Email già associata ad un account. Ritenta con un altro account oppure fai il login con questa mail.")
      emailIn.value = "";
      passwordIn.value = "";
   })
})
