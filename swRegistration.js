if("serviceWorker" in navigator){ //check if browser supports service workers
   navigator.serviceWorker.register("./serviceWorker.js")
      .then(serviceWorker => {
         console.log("Service Worker registered: ", serviceWorker);
      })
      .catch(error => {
         console.error("Error registering Service Worker: ", error);
      })
}