#!/bin/sh
# Start Flask backend in the background
cd /app/backend
/app/backend/venv/bin/python app.py &

# Start Next.js frontend (this stays in foreground)
cd /app
node server.js
