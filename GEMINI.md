# Project Overview

This is a minimalist real-time chat application built using Node.js, Express, and Socket.io, structured following the Model-View-Controller (MVC) pattern with TypeScript. It provides real-time messaging, a typing indicator, and displays the count of online users. Messages are stored temporarily in memory (RAM).

**Key Technologies:**
*   **Node.js & TypeScript:** Core environment and language.
*   **Express:** Minimalist web framework for handling static files and a REST API.
*   **Socket.io:** Library for real-time, bidirectional, event-based communication.
*   **ngrok:** Used for tunneling the local server to the public internet (optional for external access).
*   **nodemon & ts-node:** Development utilities for live-reloading TypeScript.

**Architecture:**
*   **`src/server.ts`**: The main entry point, setting up the Express application, serving static files from `public`, and initializing Socket.io and `SocketService`.
*   **`src/routes/chatRoutes.ts`**: Defines REST API routes. Currently, it exposes a GET endpoint `/api/messages` to retrieve chat history.
*   **`src/controllers/chatController.ts`**: Handles the logic for REST API requests, interacting with the `chatModel` to fetch messages.
*   **`src/models/chatMessage.ts`**: Manages chat messages in memory. It includes logic for adding new messages, generating unique IDs, and limiting the message history.
*   **`src/services/socketService.ts`**: Encapsulates Socket.io server-side logic, handling client connections, broadcasting user counts, processing incoming messages, and managing typing indicators.
*   **`public/index.html`**: The main client-side HTML page, loading necessary scripts and defining the chat UI.
*   **`public/client.js`**: The client-side JavaScript that establishes a Socket.io connection, fetches initial message history, sends/receives messages, updates UI based on events (like typing and user count), and stores the author's name locally.
*   **`public/styles.css`**: Provides the styling for the chat application, including Mario-themed visual elements.

# Building and Running

## Prerequisites
*   Node.js (LTS recommended)
*   npm (or yarn)
*   An ngrok account and authentication token (for external tunneling, if needed)

## Installation
1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install dependencies:
    ```bash
    npm install
    ```

## Configuration (ngrok Tunneling)
If you wish to expose your local server to the public internet:
1.  Get your ngrok auth token from the [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken).
2.  Add your token to the local ngrok configuration:
    ```bash
    npx ngrok config add-authtoken YOUR_NGROK_TOKEN
    ```

## Running the Project

| Command            | Usage                                  | Description                                                                                                                                                                                                                                 |
| :----------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run dev`      | **Development Mode**                   | Runs the server using `ts-node` and `nodemon` for file watch and auto-restart. This is the recommended mode for development as it provides live-reloading.                                                                                      |
| `npm run build`    | **Compilation**                        | Compiles TypeScript files (`src/`) into JavaScript (`dist/`). This command prepares the project for production deployment.                                                                                                                   |
| `npm start`        | **Production Mode**                    | Runs the compiled JavaScript from the `dist` folder. This command should be used after running `npm run build` for a production environment.                                                                                                |
| `npm run tunnel`   | **External Tunnel (using ngrok)**      | Runs the ngrok tunnel command to expose the local server (Port 3000) to the public internet. This allows external access to your local chat application. This command is typically run in a separate terminal while `npm run dev` or `npm start` is active. |

# Development Conventions

*   **Code Structure:** The project follows an MVC-like pattern with dedicated directories for `controllers`, `models`, `routes`, and `services` within the `src` folder.
*   **TypeScript:** All server-side logic is written in TypeScript, ensuring type safety and better code organization.
*   **In-Memory Storage:** Messages are stored in RAM, suitable for temporary chat sessions but not for persistent data.
*   **Real-time Communication:** Socket.io is used extensively for real-time features, with events like `chat:send`, `chat:new`, `chat:typing`, and `users:count`.
*   **Client-side Logic:** Client-side JavaScript (`public/client.js`) handles UI interactions, Socket.io event listeners, and REST API calls for initial data.
*   **Styling:** Uses plain CSS (`public/styles.css`) with a focus on a themed, visually engaging interface.