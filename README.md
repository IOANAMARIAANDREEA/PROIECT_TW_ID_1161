Descriere: 

Acest proiect are ca obiectiv realizarea unei platforme web dedicate administrării documentelor electronice într-un mod organizat, standardizat și ușor de urmărit. Sistemul permite utilizatorilor să gestioneze întregul flux al documentelor digitale, de la încărcarea acestora în aplicație până la clasificarea lor în categorii tematice și atribuirea automată a unui număr unic de înregistrare, necesar pentru evidență și arhivare. Aplicația pune accent pe integritatea datelor și pe accesul controlat, oferind mecanisme clare de identificare și regăsire a fișierelor. Prin integrarea cu servicii de stocare cloud precum Dropbox sau Google Drive, platforma asigură persistență, redundanță și disponibilitate ridicată pentru documentele gestionate. În plus, comunicarea dintre interfața React și serviciul back-end RESTful garantează o structură modulară și scalabilă, conformă cu arhitecturile moderne de dezvoltare.

Funcționalități principale:

•	Înregistrarea și autentificarea utilizatorilor prin mecanisme securizate pe bază de token (JWT)
•	Încărcarea și gestionarea documentelor electronice în cadrul aplicației
•	Clasificarea fișierelor în categorii, subcategorii sau tipuri predefinite
•	Generarea automată a unui cod unic de înregistrare pentru fiecare document adăugat
•	Filtrare avansată și căutare după metadate precum număr de înregistrare, dată, categorie sau denumire
•	Conectarea aplicației la servicii externe (Dropbox / Google Drive) pentru stocarea și administrarea fișierelor
•	Posibilitatea vizualizării și descărcării fișierelor direct din spațiul cloud
•	Implementarea unei interfețe moderne React care comunică exclusiv prin API REST

Tehnologii propuse:

•	Backend: Node.js cu framework-ul Express pentru gestionarea logicii aplicației
•	Bază de date: PostgreSQL, împreună cu un ORM precum Prisma sau TypeORM pentru mapare object-relational
•	Frontend: React, utilizând React Router pentru navigare și Axios pentru comunicarea cu serverul
•	Autentificare: JSON Web Tokens pentru sesiuni persistente și acces securizat
•	Integrare cloud: Dropbox API sau Google Drive API pentru încărcarea și gestionarea documentelor externe
•	Procesare fișiere: Middleware dedicat manipulării upload-urilor către cloud (ex. Multer
Stadiu curent:

Etapa 1 – specificații și configurare inițială a proiectului:

•	au fost definite structura arhitecturală și responsabilitățile componentelor sistemului
•	a fost elaborat modelul conceptual și relațional de date (entități precum Document, User, Category)
•	au fost stabilite endpoint-urile REST principale pentru manipularea documentelor și autentificarea utilizatorilor
•	a fost creat repository-ul Git și a fost configurată structura inițială a directoarelor pentru front-end, back-end și documentație

