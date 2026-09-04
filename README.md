# Pulse Chat

A real-time chat application built with the MERN stack (MongoDB, Express, React, Node.js) and Socket.io.

## Live Demo

- App: https://chat-app-mern-jet.vercel.app
- API: https://chat-app-mern-server-txt9.onrender.com/api/health

The API runs on Render's free tier, which spins down after ~15 minutes of inactivity — the first request after a period of idle time may take 30-60 seconds to wake up.

## Features

- User registration and login secured with JWT and bcrypt password hashing
- Avatar selection after signup
- Contacts list of all registered users
- Real-time one-to-one messaging via Socket.io
- Emoji picker in the message composer
- Message history persisted in MongoDB
- Docker support for one-command local setup

## Tech Stack

**Client:** React, React Router, styled-components, socket.io-client, axios, react-toastify, emoji-picker-react

**Server:** Node.js, Express, MongoDB with Mongoose, Socket.io, JWT, bcrypt

## Getting Started

### Requirements

- Node.js
- MongoDB running locally (or a connection string to a hosted instance)

### Setup

```shell
git clone https://github.com/Hi-manshu2301/chat-app-mern
cd chat-app-mern
```

Copy the example env files:

```shell
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Install dependencies and run each app:

```shell
cd server
npm install
npm run dev
```

```shell
cd client
npm install
npm start
```

Open `http://localhost:3000` in your browser.

### With Docker

```shell
docker compose up --build
```

This starts MongoDB, the server on port 5000, and the client on port 3000.
