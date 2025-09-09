# DEMO - Reality Defender 

Quick DEMO to show the capabilities of https://app.realitydefender.ai


# Project structure

The project is composed of a expressjs server that serves a static React application.

The basic flow is the following:

- Client sends a file to be analyzed
- Server receives the file uploaded by the client and forwards the request to the RealityDefender server
- Server sends a jobId to the client to track the status of the analysis
- Client subscribes to the events api with the jobId and keeps the connection open to receive SSE
- Server sends updates to the client while the job is being processed
- Client/Server close the connection
- Client displays the result on the UI


# Getting started
1. Build the React frontend
    ```bash
    cd frontend
    npm run build
    ```
2. Create an API key and paste inside the file [.env.template](/backend/.env.template)
3. Rename the file _.env.template_ to _.env_
2. Run the backend server
    ```bash
    cd backend
    npm run dev
    ```
3. Connect to the api
    http://localhost:3000

# Screenshots
![](/assets/ui_example.png)
