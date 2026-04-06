# 🪐 GluPulse: Neural Glucose Intelligence & Predictive Bio-Monitoring

GluPulse is a high-performance, medical-grade diagnostic prototype designed to provide early-warning signals for hypoglycemia using multi-modal AI intelligence. It bridges the gap between passive wearable data and active biometric analysis (Voice + Vision).

---

## 🏗 System Architecture

The project is built on a high-fidelity **"Agentic-Diagnostic"** architecture:

1.  **Frontend (React/TypeScript/Vite)**: 
    - Premium industrial dark-mode UI.
    - Real-time signal visualization using Framer Motion.
    - Hardware-accelerated components (Lucide, TailwindCSS).

2.  **Backend (Node.js/Express Orchestration)**: 
    - Centralized API gateway (Port 5000).
    - Multi-modal routing for Audio, Image, and Chat telemetry.
    - Direct bridge to Python Inference via `child_process`.

3.  **Biometric Engine (Python/Librosa/Signal Processing)**:
    - High-fidelity acoustic feature extraction.
    - Raw signal processing (Jitter & Shimmer analysis).
    - Probabilistic pitch tracking (pYIN).

---

## 💎 Core Features

### 1. 🎙 Neural Vocal Biomarker Intelligence
**Purpose**: Detects "neuro-cognitive drift" through sub-perceptual vocal micro-tremors, a known indicator of dropping blood glucose.

-   **Workflow**:
    1.  User records 5-10 seconds of speech in the browser (`VoiceBiomarker.tsx`).
    2.  Frontend streams the sample to the Backend as `audio/webm`.
    3.  Backend uses `FFmpeg` to transcode it to high-fidelity `16kHz Mono WAV`.
    4.  The sample is passed to `vocal_analysis.py`.
-   **Secret Sauce**: 
    - **Jitter (Local)**: Measures frequency instability. $Jitter > 3\%$ flags High Risk.
    - **Shimmer (Local)**: Measures amplitude micro-variation. $Shimmer > 4\%$ flags Moderate Risk.
-   **Result**: Real-time diagnostic report with Confidence, Latency, and Scientific Biomarkers.

### 2. 👁 Vision-to-Simulation Engine
**Purpose**: Instantly predicts glucose response based on meal photography.

-   **Workflow**:
    1.  User snaps a photo using the `VisionEngine.tsx`.
    2.  Base64 image is sent to the Express API.
    3.  Backend calls **OpenRouter (NVIDIA Nemotron-12B VL)** to perform Computer Vision.
    4.  AI identifies the food, estimates Carbs, and assigns a Glycemic Index.
-   **Simulation**: 
    - Frontend generates a calculated **Glucose Recovery Curve** based on the AI response, showing the user exactly when they will hit their glucose peak.

### 3. 📊 Predictive Dashboard & Timeline
**Purpose**: Real-time monitoring of the "Hypo-Horizon".

-   **Workflow**:
    - Fetches data from `/api/timeline-data`.
    - Synthesizes steps, insulin doses, and meal data into a single risk score.
    - **XAI (Explainable AI)**: Breaks down the risk into specific factors (e.g., "Critical: 5km walk + 6h fasting").

---

## 🛠 Tech Stack Details

### Backend (`/backend`)
- **Runtime**: Node.js v18+
- **Security**: CORS, Dotenv, Multer for file handling.
- **Python-Bridge**: Uses `spawn()` with a dedicated Python Virtual Environment (`venv`).
- **Dependencies**: `ffmpeg-static`, `fluent-ffmpeg`, `multer`, `anthropic-ai` (fallback), `openrouter`.

### Inference Layers (`/backend/utils`)
- **librosa**: The industry standard for audio and music processing.
- **numpy/scipy**: Mathematical modeling for tremor variance.
- **numba**: JIT compiler to ensure <2s latency for complex audio analysis.

### Frontend (`/src`)
- **Routing**: `react-router-dom`.
- **Animations**: `framer-motion` (for those sleek "scanning" effects).
- **Styling**: `tailwind-css` with custom glassmorphism components.

---

## 🚦 Getting Started for Another AI

### 1. Understanding the Data Flow
If you are adding new features, follow the **"Bridge Pattern"**:
- **UI** triggers a request in `src/pages/`.
- **Express** handles the request in `backend/routes/`.
- **Python** (if compute-heavy) processes raw data in `backend/utils/`.

### 2. Adding a New Biomarker
1. Add extraction logic in `backend/utils/vocal_analysis.py`.
2. Update the JSON return structure in the Python script.
3. Update the `res.json` mapping in `backend/routes/vocal-risk.js`.
4. Add a new UI card in `src/pages/VoiceBiomarker.tsx`.

### 3. Key Environment Variables
Ensure you have a `.env` file in the `backend/` directory with:
- `PORT=5000`
- `OPENROUTER_API_KEY=your_key_here`

---

## 🧬 Intention vs Implementation
- **Intention**: To move beyond "reactive" glucose management to "predictive" neuro-diagnostics.
- **Implementation**: We use speech analysis (historically used for Parkinson's/Alzheimer's) and repurpose it for acute metabolic shifts (Hypoglycemia). It's a non-invasive, hardware-agnostic solution.

**Developed by Antigravity AI for GluPulse.**
