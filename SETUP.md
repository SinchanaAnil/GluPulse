# Project Setup Guide

Welcome to the GluPulse Team! Please follow these steps exactly to get the environment running.

### Step 1: Root (Frontend)
Initialize the frontend dependencies:
```bash
npm install
```

### Step 2: Backend (Python Environment)
Go to the `backend/` folder, set up your Python virtual environment, and install machine learning dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Step 3: Backend (Node Server)
While in the `backend/` folder, set up the Express dependencies:
```bash
npm install
```

### Step 4: Environment Variables
Create a `.env` file in the `backend/` folder with the following keys:
```env
PORT=5000
ANTHROPIC_API_KEY=your_openrouter_api_key_here
```

### Running the App
From the **root** folder, run:
```bash
npm run dev:full
```
This will start both the Vite development server and the Express backend simultaneously.
