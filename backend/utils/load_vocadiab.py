import os
import sys
import types
import pandas as pd

# High-robustness unpickling shim
try:
    import pandas.core.indexes.base as _base
    if not hasattr(_base, 'NumericIndex'):
        _base.NumericIndex = pd.Index
    
    # Map the old module path to the current base module
    sys.modules['pandas.core.indexes.numeric'] = _base
    
    # Also map specifically to the class name in many possible locations
    setattr(pd, 'NumericIndex', pd.Index)
    import pandas.core.indexes as _indexes
    setattr(_indexes, 'NumericIndex', pd.Index)
    
except Exception as e:
    print(f"Warning during pandas shim: {e}")

import pickle
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

def load_and_prepare_data():
    """Load VOCADIAB pickle files and prepare for training"""
    
    print("Loading VOCADIAB datasets...")
    
    import os
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    male_path = os.path.join(base_dir, 'models', 'vocadiab_males_dataset.pkl')
    female_path = os.path.join(base_dir, 'models', 'vocadiab_females_dataset.pkl')
    
    # Load pickle files (pandas will be available)
    male_df = pd.read_pickle(male_path)
    female_df = pd.read_pickle(female_path)
    
    # These are likely pandas DataFrames with columns:
    # - embeddings (or features): 512-dimensional Byol-S vectors
    # - age: age of participant
    # - bmi: body mass index
    # - gender: male/female (redundant here since already split)
    # - ada_score or diabetes_label: target variable
    
    print(f"Male data shape: {male_df.shape}")
    print(f"Female data shape: {female_df.shape}")
    print(f"Male columns: {male_df.columns.tolist()}")
    
    # Normalize all columns to lowercase
    male_df.columns = [str(c).lower().strip() for c in male_df.columns]
    female_df.columns = [str(c).lower().strip() for c in female_df.columns]
    
    cols = list(male_df.columns)
    print(f"DEBUG: Male columns (normalized): {cols}")
    
    # Very broad search
    embedding_col = next((c for c in cols if 'embed' in c or 'feature' in c or c == 'x'), None)
    target_col = next((c for c in cols if 'ada' in c or 'diabet' in c or 'score' in c or c in ['y', 'label', 'target']), None)
    
    if not embedding_col or not target_col:
        raise ValueError(f"Could not find embedding/target. Found in cols: {male_df.columns.tolist()}.\nEmbedding Search found: {embedding_col}.\nTarget Search found: {target_col}")
    
    print(f"Using embedding column: '{embedding_col}'")
    print(f"Using target column: '{target_col}'")
    
    # Extract and combine
    X_male = np.array([np.array(x) for x in male_df[embedding_col].values])
    y_male = male_df[target_col].values
    
    X_female = np.array([np.array(x) for x in female_df[embedding_col].values])
    y_female = female_df[target_col].values
    
    # Combine datasets
    X = np.vstack([X_male, X_female])
    y = np.hstack([y_male, y_female])
    
    print(f"\n✅ Combined dataset:")
    print(f"   Samples: {X.shape[0]}")
    print(f"   Features: {X.shape[1]}")
    print(f"   Classes: {np.unique(y)}")
    print(f"   Class distribution: {np.bincount(y.astype(int))}")
    
    return X, y, male_df, female_df

def train_vocadiab_classifier(X, y, output_dir='./models'):
    """Train RandomForest on embeddings"""
    
    print("\nTraining RandomForest classifier...")
    
    os.makedirs(output_dir, exist_ok=True)
    
    # Normalize
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train
    clf = RandomForestClassifier(
        n_estimators=200,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1,
        class_weight='balanced'  # Important: handle class imbalance
    )
    
    clf.fit(X_scaled, y)
    
    # Evaluate on same data (for now)
    train_score = clf.score(X_scaled, y)
    print(f"✅ Training accuracy: {train_score:.3f}")
    
    # Save
    clf_path = os.path.join(output_dir, 'vocadiab_classifier.pkl')
    scaler_path = os.path.join(output_dir, 'vocadiab_scaler.pkl')
    
    joblib.dump(clf, clf_path)
    joblib.dump(scaler, scaler_path)
    
    print(f"✅ Classifier saved to {clf_path}")
    print(f"✅ Scaler saved to {scaler_path}")
    
    return clf, scaler

if __name__ == '__main__':
    # Load data
    X, y, male_df, female_df = load_and_prepare_data()
    
    # Train model
    clf, scaler = train_vocadiab_classifier(X, y)
    
    print("\n" + "=" * 60)
    print("✅ MODEL TRAINING COMPLETE")
    print("=" * 60)
    print("Next: Use backend/utils/inference.py for predictions")