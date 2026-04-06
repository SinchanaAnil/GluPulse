/**
 * InferenceEngine.js - Multi-Modal Fusion Layer
 * Orchestrates cross-domain clinical reasoning by weighting disparate biological signals.
 */
export class InferenceEngine {
  constructor(context = {}) {
    this.voice = context.voiceData || { jitter: 0, shimmer: 0, status: 'STABLE' };
    this.reflex = context.reflexData || { meanLatency: 0, status: 'STABLE' };
    this.vision = context.mealData || { name: "N/A", glycemicIndex: "Medium" };
    
    // Feature Weights
    this.W_VOICE = 0.35;
    this.W_REFLEX = 0.40;
    this.W_VISION = 0.25;
  }

  calculateFusion() {
    // 1. Calculate Individual Risk Components (Normalized 0-1.0)
    const voiceRisk = (this.voice.jitter > 3.0 || this.voice.shimmer > 5.0) ? 0.9 : 0.2;
    const reflexRisk = (this.reflex.meanLatency > 1000) ? 1.0 : (this.reflex.meanLatency > 850 ? 0.6 : 0.1);
    const visionRisk = (this.vision.glycemicIndex === "High") ? 0.8 : (this.vision.glycemicIndex === "Medium" ? 0.4 : 0.1);

    // 2. Weighted Fusion (Global Propensity Score)
    const compositeScore = (voiceRisk * this.W_VOICE) + (reflexRisk * this.W_REFLEX) + (visionRisk * this.W_VISION);
    const globalPropensity = Math.round(compositeScore * 100);

    // 3. Confidence Interval Logic (Detecting Model Discrepancies)
    // High divergence between models reduces confidence
    const variance = Math.abs(voiceRisk - reflexRisk) + Math.abs(reflexRisk - visionRisk);
    const confidenceScore = Math.max(0, Math.min(100, 100 - (variance * 30)));

    let xaiStatus = "STABLE: BASELINE";
    if (confidenceScore < 40) {
      xaiStatus = "DISCREPANCY DETECTED: LOW CONFIDENCE. MONITORING FOR COGNITIVE DRIFT.";
    } else if (globalPropensity > 75) {
      xaiStatus = "HIGH RISK: METABOLIC COLLAPSE IMMINENT";
    } else if (globalPropensity > 50) {
      xaiStatus = "MODERATE: HYPOGLYCEMIC ADVISORY";
    }

    // 4. SHAP (SHapley Additive exPlanations) Contribution Mock-up
    const shap = [
      { feature: "Neural Latency", contribution: Math.round(reflexRisk * this.W_REFLEX * 100), importance: "HIGH" },
      { feature: "Vocal Tremor", contribution: Math.round(voiceRisk * this.W_VOICE * 100), importance: "MED" },
      { feature: "Glycemic Context", contribution: Math.round(visionRisk * this.W_VISION * 100), importance: "LOW" }
    ].sort((a, b) => b.contribution - a.contribution);

    // 5. Agentic Chain-of-Thought (CoT) Reasoning Path
    const reasoningPath = [
      `Vocal harmonics analysis returned ${this.voice.jitter}% jitter (Target <3.0).`,
      `Neural reflex battery detected ${this.reflex.meanLatency}ms latency (Baseline ~750ms).`,
      `Cross-referenced vision engine: ${this.vision.name} found with ${this.vision.glycemicIndex} GI profile.`,
      `Conclusion: Multi-modal fusion indicates a ${globalPropensity}% propensity for hypoglycemic onset.`
    ].join(" -> ");

    return {
      globalPropensity,
      confidenceScore,
      xaiStatus,
      shap,
      reasoningPath,
      weights: { voice: this.W_VOICE, reflex: this.W_REFLEX, vision: this.W_VISION }
    };
  }
}
