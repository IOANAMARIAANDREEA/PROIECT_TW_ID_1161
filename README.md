# Clasificare si numar de inregistrare pentru documente electronice

Aplicatie completa cu REST API (Node.js + Express + Sequelize + SQLite), autentificare JWT, integrare Dropbox si SPA React.

## Structura
- server: backend REST
- client: frontend React SPA

## Pornire rapida

### Backend
1. Copiaza server/.env.example in server/.env si seteaza valorile (in special JWT_SECRET). Optional: poti seta DROPBOX_ACCESS_TOKEN pentru integrare directa in backend.
2. Instaleaza dependintele:
   - npm install
3. Ruleaza:
   - npm run dev

### Frontend
1. Copiaza client/.env.example in client/.env si seteaza VITE_API_URL daca este nevoie.
2. Instaleaza dependintele:
   - npm install
3. Ruleaza:
   - npm run dev

## Functionalitati
- CRUD documente + inregistrari (relatie parinte-copil)
- Categorii pentru clasificare
- Subcategorii (categorie parinte/copil)
- Generare automata numar inregistrare
- Filtrare dupa titlu, categorie, numar inregistrare
- JWT auth cu persistenta in localStorage
- Restrictii per utilizator
- Integrare Dropbox: conectare token, upload si link de descarcare
