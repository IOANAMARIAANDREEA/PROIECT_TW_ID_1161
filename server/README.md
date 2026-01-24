# Server

## Setup

1. Create a .env file based on .env.example
2. Install dependencies and run:

- Development: npm run dev
- Production: npm start

## API

- POST /api/auth/register
- POST /api/auth/login
- GET /api/documents
- POST /api/documents
- GET /api/documents/:id
- PUT /api/documents/:id
- DELETE /api/documents/:id
- POST /api/documents/:id/upload
- GET /api/documents/:id/download
- GET /api/documents/:id/registrations
- POST /api/documents/:id/registrations
- GET /api/registrations/:id
- PUT /api/registrations/:id
- DELETE /api/registrations/:id
- GET /api/categories
- POST /api/categories
- PUT /api/categories/:id
- DELETE /api/categories/:id
- GET /api/dropbox/auth-url
- POST /api/dropbox/connect
- GET /api/dropbox/list
