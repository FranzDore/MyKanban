import { app } from "../firebaseConfig.js"
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-auth.js"
import { getFirestore, doc, getDoc, updateDoc, deleteField, onSnapshot, enableIndexedDbPersistence } from "https://www.gstatic.com/firebasejs/9.18.0/firebase-firestore.js"

//Shortcut to elements
const menu = document.getElementById("menu")
const addList = document.getElementById("addList");
const submitList = document.getElementById("submitList");
const formLista = document.querySelector("#popup").firstElementChild;
const hidePopup = document.querySelector("#popup").firstElementChild.firstElementChild;
const submitItem = document.getElementById("submitItem");
const formItem = document.querySelector("#popupItem").firstElementChild;
const hidePopupItem = document.querySelector("#popupItem").firstElementChild.firstElementChild;

//Auth Firebase
const auth = getAuth(app);
const logout = document.querySelector("#logout");

//Firestore Database
const db = getFirestore();

//Enable persistance. Data is seen offline even after reload.
enableIndexedDbPersistence(db)
.catch(err => {
   console.log(err.message);
})

const docRef = doc(db, "utenti", localStorage.getItem("user"));
const docSnap = await getDoc(docRef);

//Populate the board with data from firestore.
const dati = docSnap.data();

Object.keys(dati).forEach((x) => {
   let temp = createList(x);
   const board = document.getElementById("board");
   for (let item of dati[x]) {
      const newItem = createItem(item);
      const body = temp.getElementsByClassName("list-items");
      body[0].appendChild(newItem);
   }
   board.appendChild(temp);
})

   
//Logout button listener
logout.addEventListener('click', (e) => {
   e.preventDefault();
   signOut(auth).then(() => {
     window.location.assign("/");
   });
});


//MUTATION OBSERVER ---> Necessary to remove items from front end when page is offline. We add event listener to all items after we've noticed a change in the dom. <OPTIMISTIC UI>
// Options for the observer (which mutations to observe)
const config = { attributes: true, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = (mutationList) => {
  for (const mutation of mutationList) {
    if (mutation.type === "childList") {
      let allItemDelButtons = document.querySelectorAll(".item-del");

      for(let x of allItemDelButtons){
         x.addEventListener("click", (event) => {
            if(event.target.parentNode.parentNode !== null){
               event.preventDefault();
               const p = event.target.parentNode.parentNode.previousElementSibling.querySelector("p");
               const nomeLista = p.innerHTML;
               const text = event.target.parentNode.firstElementChild.innerHTML;
               const itemList = event.target.parentNode.parentNode.querySelectorAll(".item");
               const itemListAsArray = [...itemList]; //itemList is not iterable
               const result = itemListAsArray.filter((item) => {
                     if(item.firstElementChild.innerHTML !== text) return true
                     else  return false;
               }).map((item) => {
                  return item.firstElementChild.innerHTML;
               })
               event.target.parentNode.remove();
               const obj = {  };
               obj[nomeLista] = result;
               updateDoc(docRef, obj)
               .catch((e) => alert(e.message))
            }
         })
      }
    }
  }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
const board = document.getElementById("board");
observer.observe(board, config);


//Whenever there's an update in firestore, we add an event listener to all deletion buttons. This is required because we can't target the list (or the board) when we're creating an item (or a list), since it is not yet appended. We add an event listener after we've created and appendend the item (or the list).
onSnapshot(doc(db, "utenti", localStorage.getItem("user")), (doc) => {
   let allListDelButtons = document.querySelectorAll(".list-del");
   let allItemDelButtons = document.querySelectorAll(".item-del");

   for(let x of allItemDelButtons){
      x.addEventListener("click", (event) => {
         if(event.target.parentNode.parentNode !== null){
            event.preventDefault();
            const p = event.target.parentNode.parentNode.previousElementSibling.querySelector("p");
            const nomeLista = p.innerHTML;
            const text = event.target.parentNode.firstElementChild.innerHTML;
            const itemList = event.target.parentNode.parentNode.querySelectorAll(".item");
            const itemListAsArray = [...itemList]; //itemList is not iterable
            const result = itemListAsArray.filter((item) => {
                  if(item.firstElementChild.innerHTML !== text) return true
                  else  return false;
            }).map((item) => {
               return item.firstElementChild.innerHTML;
            })
            event.target.parentNode.remove();
            const obj = {  };
            obj[nomeLista] = result;
            updateDoc(docRef, obj)
            .catch((e) => alert(e.message))
         }
      })
   }
   
   for(let y of allListDelButtons){
      y.addEventListener("click", (event) => {
         event.preventDefault();
         const p = event.target.parentNode.querySelector("p");
         const text = p.innerHTML;
         event.target.parentNode.parentNode.remove();
         //const userRef = doc(db, "utenti", localStorage.getItem("user"));
         const obj = { };
         obj[text] = deleteField();
         updateDoc(docRef, obj);
      })
   }
})

//Functions to dynamically create items and lists. They're used in the event listeners.
//Fucntion declaration is hoisted to the top of the script.
function createItem(testo){
   const item = document.createElement("div");
   const p = document.createElement("p");
   if(testo.trim() === "")
      return undefined;
   p.innerHTML = testo;
   const del = document.createElement("button");
   del.innerHTML = "X";
   del.classList.add("item-del");
   item.appendChild(p);
   item.appendChild(del);
   item.classList.add("item");
   item.addEventListener("dblclick", (event) => {
      event.preventDefault();
      let popup = document.getElementById("containerEdit");
      if(popup.style.display === "none")
         popup.style.display = "block";
      else
         popup.style.display = "none";
      clickedEditItem = event.target;
      clickedItemList = event.target.parentNode.parentNode;
   })
   return item;
}

function createList(testo) {
   //Check if there's a list named the same
   const allListHeads = document.querySelectorAll(".list-head");
   if(!(testo).trim())  return undefined;
   for(let lista of allListHeads) {
      const p = lista.querySelector("p");
      if(p.innerHTML === testo){
         return undefined; //listener will not create list if there's another one named the same.
      }
   }
   const list = document.createElement("div");
   list.classList.add("list");
   const listHead = document.createElement("div");
   listHead.classList.add("list-head");
   const addButton = document.createElement("button");
   addButton.innerHTML = "+";
   addButton.classList.add("item-add");
   addButton.addEventListener("click", (event) => {
      event.preventDefault();
      const invisDiv = document.querySelector("#containerItem");
      if(invisDiv.style.display === "none")
         invisDiv.style.display = "block";
      else
         invisDiv.style.display = "none";
      clickedListButton = event.target.parentNode.parentNode;
   })
   listHead.appendChild(addButton)
   const p = document.createElement("p");
   p.innerHTML = testo;
   const button = document.createElement("button");
   button.innerHTML = "X";
   button.classList.add("list-del");
   listHead.appendChild(p);
   listHead.appendChild(button);
   list.appendChild(listHead);
   const listItems = document.createElement("div");
   listItems.classList.add("list-items");
   list.appendChild(listItems);
   return list;
}

//EVENT RELATED

//Variable used to recognize what list "+" button has shown the popup.
let clickedListButton;

//We add the event listeners for the functionalities of the page

//Show hamburger menu
menu.addEventListener("click", () => {
  var x = document.getElementById("myLinks");
  if (x.style.display === "block") {
    x.style.display = "none";
  } else {
    x.style.display = "block";
  }
})

//LIST RELATED

//Show popup to add a list
addList.addEventListener("click", (event) => {
  event.preventDefault();
  const temp = document.getElementById("containerList");
  if(temp.style.display === "none")
     temp.style.display = "block";
  else
     temp.style.display = "none";
})

//Hide the popup by clicking the x button
hidePopup.addEventListener("click", (e) => {
  e.preventDefault();
  const temp = document.getElementById("containerList");
  temp.style.display = "none";
});

//we prevent default reload of page
formLista.addEventListener("submit", (e) =>{
   e.preventDefault();
});

//Submitting form creates a new list. Event listener for it.
submitList.addEventListener("click", (event) => {
   event.preventDefault();
   const nomeLista = document.getElementById("listName").value;
   document.getElementById("listName").value = "";
   const newList = createList(nomeLista);
   if(newList === undefined){
         alert("Can't give an empty name or use the same name for different lists. Try again.");
         return;
      }
   const board = document.getElementById("board");
   board.appendChild(newList);
   const temp = document.getElementById("containerList");
   temp.style.display = "none";
   //Update Firestore
   const userRef = doc(db, "utenti", localStorage.getItem("user"));
   const obj = { };
   obj[nomeLista] = [];
   updateDoc(userRef, obj)
});

//ITEM RELATED
//same as before
hidePopupItem.addEventListener("click", (e) => {
  e.preventDefault();
  const temp = document.getElementById("containerItem");
  temp.style.display = "none";
});

formItem.addEventListener("submit", (e) => e.preventDefault());

submitItem.addEventListener("click", (event) => {
   event.preventDefault();
   const text = document.querySelector("#itemText").value;
   document.querySelector("#itemText").value = "";
   //check if text exists already in a different item
   for(let item of clickedListButton.querySelector(".list-items").childNodes){
   if(item.firstElementChild.innerHTML === text){
         alert("Cannot create two equal items. Retry.");
         return;
      }
   }
   const newItem = createItem(text); //could be undefined
   if(newItem === undefined){
      alert("Cannot create an empty item. Please, give a valid item text.");
      return;
   }
   const body = clickedListButton.querySelectorAll(".list-items");
   body[0].appendChild(newItem);
   const temp = document.getElementById("containerItem");
   temp.style.display = "none";
   //Update firestore
   const userRef = doc(db, "utenti", localStorage.getItem("user"));
   const listaDegliItem = [...clickedListButton.querySelector(".list-items").childNodes];
   const validArray = listaDegliItem.map((x) => x.firstElementChild.innerHTML)
   const obj = { };
   const temp2 = clickedListButton.firstElementChild.querySelector("p");
   const temp2Name = temp2.innerHTML;
   obj[temp2Name] = validArray;
   updateDoc(userRef, obj);
});

//TEXT EDIT RELATED

const hideEditPopup = document.querySelector("#editPopup").firstElementChild.firstElementChild;
const formEdit = document.querySelector("#editPopup").firstElementChild;

hideEditPopup.addEventListener("click", (event) =>{
   event.preventDefault();
   const temp = document.querySelector("#containerEdit");
   temp.style.display = "none";
});

//variable used for knowing what item was selected (edit) and its text content.
let clickedEditItem;
//variable used to check if list of double-clicked item has an equal item inside of it (No doubled items are allowed).
let clickedItemList;

formEdit.addEventListener("submit", (event) => {
   event.preventDefault();
   const text = document.getElementById("editName").value;
   if(text.trim() == ""){
      alert("Can't create an empty item. Please Retry.");
      return;
   }
   document.getElementById("editName").value = "";
   //Check if ither items in list have the same text value
   for(let item of clickedItemList.querySelector(".list-items").childNodes){
      if(item.firstElementChild.innerHTML === text){
            alert("Can't make two equal items. Please Retry.");
            return;
         }
      }
   //No clones. We can assign text
   clickedEditItem.firstElementChild.innerHTML = text;
   
   const editPopup = document.querySelector("#containerEdit");
   editPopup.style.display = "none";
   //Update firestore
   const userRef = doc(db, "utenti", localStorage.getItem("user"));
   const listaDegliItem = [...clickedItemList.querySelector(".list-items").childNodes];
   const validArray = listaDegliItem.map((x) => x.firstElementChild.innerHTML)
   const obj = { };
   const temp2 = clickedItemList.firstElementChild.querySelector("p");
   const temp2Name = temp2.innerHTML;
   obj[temp2Name] = validArray;
   updateDoc(userRef, obj);
})


const tips = [
   "You can use Shift to scroll the KanBan horizontally!",
   "Don't forget to update the KanBan whenever you end or start a new task!",
   "Don't work on too many things at once! Context switch is bad!",
   "You can double click on an item to modify its content!"
]

//TODO: Notifiche Firefox, Safari

const isGranted = localStorage.getItem("notificationPermission")
if(isGranted === "true"){
   navigator.serviceWorker.ready.then((registration) => {
      const obj = {
         icon: "../common/Logo512.png",
         body: tips[Math.floor(Math.random() * tips.length)]
      };
      registration.showNotification("KanBan.", obj);
   });
}
