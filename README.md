# sound-app-docker

## Execution of Docker scripts
The workflow for executing the Docker scripts is listed in this section. The scripts are written using MacOS and requires Git Bash or WSL to run on windows natively.

Using the terminal, navigate to the project root folder.
1.	Use command “./build.sh” to build both frontend & backend images
2.	Use command “./up.sh” to start the containers after building.
3.	Use command “./logs.sh” for the logs of the containers.
4.	Use command “./down.sh” to remove and stop the containers.
5.	Use command “./export.sh” to export the images as tar files in the exports folder.
6.	Use command “./import.sh” to import the deployable tar files.

## Starting frontend development server
Navigate into the frontend folder.
```bash
cd frontend
npm i
npm run build
npm run preview
```

## Starting backend development server
Navigate into the backend folder.
```bash
cd backend
npm i
npm run start
```

### Setting up environment for backend
Require to place a .env file in the folder to supplement desired environment variables. index.js includes default dev variables, which can be used if there is no environment file for development. The required variables are 
```bash
PORT=4000
CORS_ORIGIN=http://localhost:5173
SESSION_SECRET=your_secret
```
