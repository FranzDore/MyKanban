# "KANBAN." di Francesco Dore, AA.22-23

"KANBAN." è una PWA che ha come scopo quello di simulare una KanBan, un sistema di organizzazione del lavoro, in maniera digitale.

L'app presenta le feature base necessarie per un corretto utilizzo della stessa:
* Registrazione e Login mediante email e password;
* Possibilità di recupero delle credenziali;
* Aggiunta di colonne (chiamate liste dentro l'app);
* Aggiunta di item;
* Cancellazione delle colonne;
* Cancellazione degli item;
* Modifica degli item.

## Scelte implementative

Il ***frontend*** del programma è stato interamente scritto in HTML, CSS e Vanilla JavaScript, senza l'utilizzo di alcun framework di sviluppo. La scelta è dettata da una pura preferenza personale, in quanto si è ritenuto opportuno impratichirsi in JavaScript per poter successivamente studiare un framework avendo ben note le basi.

Per ciò che riguarda il ***back-end***, si è scelto di utilizzare Firebase (BaaS) per gestire la permanenza dei dati e l'accesso all'applicazione. Il login e la registrazione al sito vengono effettuati mediante email e password, con la possibilità di recuperare le credenziali.

Firebase è stato anche utilizzato per "deployare" online: è risultato utile per testare alcune funzioni dell'applicazione, come notifiche e service worker.

L'app risulta infatti accessibile al [seguente link](https://kanban-c3a27.web.app/):

https://kanban-c3a27.web.app/

L'utilizzo di Firebase ha permesso la permanenza dei dati anche nel caso in cui l'utente vada offline mentre usa l'app, e l'utilizzo di un Service Worker ha permesso l'utilizzo dell'app anche in modalità offline.
