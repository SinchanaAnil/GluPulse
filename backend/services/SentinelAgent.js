import { InferenceEngine } from './InferenceEngine.js';

/**
 * SentinelAgent.js - The Agentic Brain of GluPulse
 * Implements a ReAct (Reasoning + Acting) loop for multi-modal clinical safety.
 */
export class SentinelAgent {
  constructor(context = {}) {
    this.context = context; 
    this.logs = [];
    this.inference = new InferenceEngine(context);
    
    // Feature Weights
    this.W_REFLEX = 0.40;
    this.W_VOICE = 0.35;
    this.W_VISION = 0.25;
  }

  addLog(thought, level = "INFO") {
    const entry = {
      timestamp: new Date().toISOString(),
      thought,
      level
    };
    this.logs.push(entry);
    console.log(`[SENTINEL_AGENT][${level}] ${thought}`);
    return entry;
  }

  // --- AUTOMATED AGENTIC TOOLS ---
  
  get_voice_metrics() {
    const data = this.context.voiceData || { jitter: 0, propensity_score: 0 };
    return { 
      jitter: data.jitter, 
      stability: 100 - (data.propensity_score || 0),
      isPathological: data.jitter > 3.0 
    };
  }

  get_reflex_stats() {
    const data = this.context.reflexData || { meanLatency: 0 };
    return {
      latency: data.meanLatency,
      isCritical: data.meanLatency > 1150
    };
  }

  get_nutritional_context() {
    const data = this.context.mealData || { name: "Unknown", glycemicIndex: "Medium" };
    return {
      meal: data.name,
      gi: data.glycemicIndex,
      isHighRisk: data.glycemicIndex === "High"
    };
  }

  /**
   * Performs a full "System Review" using a ReAct reasoning path.
   */
  async runSystemReview() {
    this.addLog("SYSTEM_REVIEW_INITIATED: Starting cross-modal synchronization...");

    // 1. Tool Execution (Gathering Evidence)
    const voice = this.get_voice_metrics();
    const reflex = this.get_reflex_stats();
    const nutrition = this.get_nutritional_context();

    this.addLog(`Gathered Evidence: Reflex (${reflex.latency}ms), Voice Stability (${voice.stability}%), Nutrition (${nutrition.meal}).`);

    // 2. Reasoning Loop (The "Thought" Phase)
    let thought = "";
    if (reflex.latency > 1000 && nutrition.gi === "High") {
      thought = `Detected metabolic lag (${reflex.latency}ms) post-prandial to ${nutrition.meal} (High GI). Suggests reactive glycemic drift.`;
    } else if (voice.isPathological) {
      thought = `Acoustic jitter (${voice.jitter}%) indicates sub-perceptual vocal tremor. Possible neuro-metabolic instability.`;
    } else {
      thought = "All systems reporting within safe baseline. Maintaining monitoring protocols.";
    }
    
    this.addLog(`REASONING: ${thought}`, "REASON");

    // 3. Multi-Modal Fusion (The "Acting" Phase)
    const fusion = this.inference.calculateFusion();
    const globalRisk = fusion.globalPropensity / 100;

    this.addLog(`GLOBAL_RISK_CALCULATED: ${(globalRisk * 100).toFixed(1)}% propensity for hypoglycemic onset.`);

    let action = "MONITOR";
    if (globalRisk > 0.80) {
      action = "AUTO_ESCALATION";
      this.addLog("CRITICAL THRESHOLD EXCEEDED (>80%). Autonomous SOS Dispatching triggered.", "CRITICAL");
    } else if (globalRisk > 0.50) {
      action = "ADVISORY_WARNING";
      this.addLog("MODERATE RISK DETECTED. Issuing spectral advisory.", "WARN");
    }

    return {
      globalRisk,
      thought,
      action,
      logs: this.logs,
      shap: fusion.shap,
      reasoningPath: fusion.reasoningPath
    };
  }
}
