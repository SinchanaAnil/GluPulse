import sys
import json
import numpy as np
import joblib

def load_model():
    """Load pre-trained classifier and scaler"""
    
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    clf_path = os.path.join(base_dir, 'models', 'vocadiab_classifier.pkl')
    scaler_path = os.path.join(base_dir, 'models', 'vocadiab_scaler.pkl')
    
    try:
        clf = joblib.load(clf_path)
        scaler = joblib.load(scaler_path)
        return clf, scaler
    except FileNotFoundError as e:
        print(f"ERROR: Model files not found at {clf_path}. Train first: python utils/load_vocadiab.py", file=sys.stderr)
        sys.exit(1)

def predict_risk(embedding, clf, scaler):
    """Classify embedding → risk score"""
    
    # Convert to numpy if needed
    embedding = np.array(embedding).reshape(1, -1)
    
    # Scale
    embedding_scaled = scaler.transform(embedding)
    
    # Predict probability
    probabilities = clf.predict_proba(embedding_scaled)[0]
    
    # Assuming class 1 = diabetic
    # probabilities[1] = P(diabetic)
    risk_score = float(probabilities[1]) if len(probabilities) > 1 else 0.5
    
    # Get feature importance (which acoustic features matter most)
    importances = clf.feature_importances_
    top_features = np.argsort(importances)[-5:][::-1]  # Top 5
    
    return {
        'risk_score': risk_score,
        'confidence': max(probabilities),
        'predicted_class': int(np.argmax(probabilities)),
        'all_probabilities': probabilities.tolist(),
        'top_feature_indices': top_features.tolist()
    }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python inference.py '<embedding_json>'")
        sys.exit(1)
    
    embedding_json = sys.argv[1]
    embedding = json.loads(embedding_json)
    
    clf, scaler = load_model()
    result = predict_risk(embedding, clf, scaler)
    
    print(json.dumps(result))