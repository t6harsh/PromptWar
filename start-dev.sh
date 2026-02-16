#!/bin/bash

# Kill any existing processes on ports 3000 and 5000 (if any)
lsof -ti:3000,5000 | xargs kill -9 2>/dev/null

# Install python dependencies if needed (fast check)
if [ ! -d "backend/venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv backend/venv
    source backend/venv/bin/activate
    pip install -r backend/requirements.txt
else
    source backend/venv/bin/activate
fi

# Ensure frontend deps (fast)
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "Starting Backend on PORT 5000..."
export FLASK_APP=backend/app.py
export FLASK_ENV=development
python3 backend/app.py &
BACKEND_PID=$!

echo "Starting Frontend on PORT 3000..."
npm run dev &
FRONTEND_PID=$!

echo "========================================"
echo "Application accessible at: http://localhost:3000"
echo "========================================"

trap "kill $BACKEND_PID $FRONTEND_PID; exit" SIGINT SIGTERM

wait
