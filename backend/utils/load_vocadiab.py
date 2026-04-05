import pickle
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import joblib
import os

def load_and_prepare_data():
    """Load VOCADIAB pickle files and prepare for training"""
    
    print("Loading VOCADIAB datasets...")
    
    # Load pickle files (pandas will be available)
    with open('./models/vocadiab_males_dataset.pkl', 'rb') as f:
        male_df = pickle.load(f)
    
    with open('./models/vocadiab_females_dataset.pkl', 'rb') as f:
        female_df = pickle.load(f)
    
    # These are likely pandas DataFrames with columns:
    # - embeddings (or features): 512-dimensional Byol-S vectors
    # - age: age of participant
    # - bmi: body mass index
    # - gender: male/female (redundant here since already split)
    # - ada_score or diabetes_label: target variable
    
    print(f"Male data shape: {male_df.shape}")
    print(f"Female data shape: {female_df.shape}")
    print(f"Male columns: {male_df.columns.tolist()}")
    
    # Determine embedding column name (might be 'embeddings', 'features', etc)
    embedding_col = None
    for col in ['embeddings', 'features', 'embedding', 'feature']:
        if col in male_df.columns:
            embedding_col = col
            break
    
    # Determine target column name
    target_col = None
    for col in ['ada_score', 'diabetes', 'label', 'y', 'target', 'diabetes_risk']:
        if col in male_df.columns:
            target_col = col
            break
    
    if not embedding_col or not target_col:
        raise ValueError(f"Could not find embedding or target column. Available: {male_df.columns.tolist()}")
    
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