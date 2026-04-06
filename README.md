# 🪐 GluPulse: Neural Glucose Intelligence & Predictive Bio-Monitoring

GluPulse is a high-performance, medical-grade diagnostic prototype designed to provide early-warning signals for hypoglycemia using multi-modal AI intelligence. It bridges the gap between passive wearable data and active biometric analysis (Voice + Vision + Cognition).

---

## 🏗 System Architecture

The project is built on a high-fidelity **"Agentic-Diagnostic"** architecture, designed for maximum modularity and AI-driven inference:

1.  **Frontend (React/TypeScript/Vite)**: 
    - **UI/UX**: Premium industrial dark-mode interface using Glassmorphism.
    - **Logic**: Real-time signal visualization and hardware-accelerated components.
    - **State Management**: LocalStorage for session persistence and cross-component sync (e.g., Sentinel logs).
    - **Primary Pages**: `VoiceBiomarker.tsx`, `ReflexTest.tsx`, `VisionEngine.tsx`, `SentinelDashboard.tsx`.

2.  **Backend (Node.js/Express Orchestration)**: 
    - **Port**: 5000 (Centralized API Gateway).
    - **Orchestration**: Direct bridge to Python Inference via `child_process.spawn()`.
    - **Endpoints**:
        - `/api/vocal-risk`: Audio processing pipeline.
        - `/api/reflex-sync`: Cognitive data telemetry.
        - `/api/chat`: Integration with Sentinel LMM (Gemini/Anthropic).
        - `/api/vision`: Multi-modal food analysis.

3.  **Biometric Engine (Python/Librosa/Signal Processing)**:
    - **Acoustic Extraction**: `vocal_analysis.py` (pYIN pitch tracking, Jitter, Shimmer).
    - **Neural Inference**: `inference.py` (Gender-stratified risk classification).
    - **Explainable AI (XAI)**: SHAP-style feature contributions for transparency.

---

## 💎 Feature Deep-Dive

### 1. 🎙 Neural Vocal Biomarker Intelligence
- **Purpose**: Detects "neuro-cognitive drift" through sub-perceptual vocal micro-tremors.
- **Metric Logic**:
    - **Jitter (Local)**: Frequency instability. Thresholds: Normal < 2.5%, Moderate 2.5-4.5%, High > 4.5%.
    - **Shimmer (Local)**: Amplitude variation. Thresholds: Normal < 15%, Moderate 15-25%, High > 25%.
- **Sync**: UI badge turns RED only if the combined weighted `riskScore` (model probability) > 0.7.

### 2. 🧠 Neural Battery (Reflex & Interference)
- **Spatial Sync**: Measures motor latency via random target tracking.
- **Neuro-Interference (Stroop)**: Tests cognitive inhibition and executive function.
- **Emergency Integration**: If mean latency > 1000ms, the system triggers the **Emergency Protocol** autonomously.

### 3. 👁 Vision-to-Simulation Engine
- **Vision**: Uses NVIDIA Nemotron-12B VL / Gemini Pro Vision to analyze meal macros.
- **Simulation**: Generates a synthetic **Glucose Recovery Curve** to predict post-prandial peaks and recovery timelines.

### 4. 🤖 Sentinel Agent & Emergency Orchestrator
- **SentinelAgent**: A background process that monitors all diagnostic inputs and triggers "Autonomous Health Sentinel" logs.
- **EmergencyOrchestrator**: A high-visibility interface that activates during critical events (Hypo-Shock), providing SOS broadcasting and location mapping.

---

## 🚦 AI Collaboration Guide (File Mapping)

| Domain | Key Files | Purpose |
| :--- | :--- | :--- |
| **Frontend Logic** | `src/pages/VoiceBiomarker.tsx` | Voice UI & Threshold Logic |
| | `src/pages/ReflexTest.tsx` | Cognitive Test Engine |
| | `src/components/SentinelAgent.tsx` | Decision logs & Monitoring |
| **Backend API** | `backend/routes/vocal-risk.js` | Audio routing & Python bridge |
| | `backend/routes/chat.js` | Model orchestration |
| **Inference** | `backend/utils/vocal_analysis.py` | Raw acoustic feature extraction |
| | `backend/utils/inference.py` | ML classification & SHAP generation |
| **Styles** | `src/index.css` | Global design system & animations |

---

## 🛠 Tech Stack Details

- **Frontend**: Vite + React + TailwindCSS + Framer Motion + Lucide React.
- **Backend**: Express + Multer + FFmpeg + Node-Fetch.
- **Compute**: Python 3.10+ (Librosa, NumPy, Scikit-Learn, Joblib).
- **AI Models**: OpenRouter SDK (Nemotron, Gemini 1.5 Flash).

---

## 🧬 Development Norms for AI Agents
1.  **Metric Integrity**: Always verify thresholds against the established medical-grade logic in `vocal_analysis.py`.
2.  **Visual Excellence**: Maintain the "Premium Dark-Mode" aesthetic. Use Glassmorphism (`blur-xl`, `bg-white/5`, `border-white/10`).
3.  **Agentic Workflow**: Every user interaction should be logged in the **Sentinel Log** (`localStorage: sentinel_logs`) for "Agentic Transparency".
4.  **Zero-Failure**: Implement fallback data (simulated results) if the backend/microservices are unavailable.

---

**Developed by Antigravity AI for the GluPulse Health Sentinel Initiative.**
