#!/bin/bash

# Start the server in the background
echo "Starting the backend server..."
node server/server.js &
SERVER_PID=$!

# Start the frontend in the foreground
echo "Starting the frontend..."
npm run dev

# When the frontend process is killed, also kill the server
kill $SERVER_PID 