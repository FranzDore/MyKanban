// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-app.js";
// Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTvBfAqnzZviAcmue7-296j2b8zRjmK2g",
  authDomain: "kanban-c3a27.firebaseapp.com",
  projectId: "kanban-c3a27",
  storageBucket: "kanban-c3a27.appspot.com",
  messagingSenderId: "166863329722",
  appId: "1:166863329722:web:40bb23e691c9022ae92583",
  measurementId: "G-V2S8EWWKV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export { app };