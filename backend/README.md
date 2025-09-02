# sound-app-backend
This app is created using nodeJS express, with SQLite database.

## Quick Start
For quick start, follow the commands below
```bash
cd sound-app-backend
npm i
npm run start
```

## Setting up environment
Require to place a .env file in the folder to supplement desired environment variables. index.js includes default dev variables, which can be used if there is no environment file for development. The required variables are 

```bash
PORT=4000
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=your_secret
```
