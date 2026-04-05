import sys
import json
import numpy as np
import torch
import torchaudio

# Try to import Byol-S (if available)
try:
    from byol_s import BYOLS
    BYOLS_AVAILABLE = True
except ImportError:
    BYOLS_AVAILABLE = False
    print("⚠️  byol-s not installed. Using fallback.", file=sys.stderr)

class AudioEmbedder:
    def __init__(self):
        if BYOLS_AVAILABLE:
            print("Loading Byol-S model...", file=sys.stderr)
            self.model = BYOLS.from_pretrained('byol-s-16x96d')
            self.model.eval()
            self.use_byols = True
        else:
            print("Using librosa fallback...", file=sys.stderr)
            self.use_byols = False
    
    def embed_from_file(self, audio_path, sample_rate=16000):
        """Convert audio file to embedding"""
        
        if self.use_byols:
            return self._embed_byols(audio_path, sample_rate)
        else:
            return self._embed_fallback(audio_path, sample_rate)
    
    def _embed_byols(self, audio_path, sample_rate):
        """Byol-S embedding"""
        
        # Load audio
        waveform, sr = torchaudio.load(audio_path)
        
        # Resample
        if sr != sample_rate:
            resampler = torchaudio.transforms.Resample(sr, sample_rate)
            waveform = resampler(waveform)
        
        # Mono
        if waveform.shape[0] > 1:
            waveform = waveform.mean(dim=0, keepdim=True)
        
        # Embed
        with torch.no_grad():
            embedding = self.model(waveform)  # (1, 512 or other)
        
        # Ensure it matches 2048 for the diabetes classifier
        emb_np = embedding.squeeze().numpy()
        if len(emb_np) < 2048:
            emb_np = np.concatenate([emb_np, np.zeros(2048 - len(emb_np))])
        else:
            emb_np = emb_np[:2048]
            
        return emb_np
    
    def _embed_fallback(self, audio_path, sample_rate):
        """Librosa-based fallback (simpler but less accurate)"""
        
        import librosa
        
        y, sr = librosa.load(audio_path, sr=sample_rate)
        
        # Extract multiple feature types
        features = []
        
        # MFCC (13 features)
        mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=13)
        features.append(mfcc.mean(axis=1))  # Mean across time
        features.append(mfcc.std(axis=1))   # Std across time
        
        # Chroma (12 features)
        chroma = librosa.feature.chroma_stft(y=y, sr=sr, n_chroma=12)
        features.append(chroma.mean(axis=1))
        features.append(chroma.std(axis=1))
        
        # Spectral features
        spec_cent = librosa.feature.spectral_centroid(y=y, sr=sr)[0]
        spec_roll = librosa.feature.spectral_rolloff(y=y, sr=sr)[0]
        zero_cross = librosa.feature.zero_crossing_rate(y)[0]
        rms = librosa.feature.rms(y=y)[0]
        
        features.append([spec_cent.mean(), spec_cent.std()])
        features.append([spec_roll.mean(), spec_roll.std()])
        features.append([zero_cross.mean(), zero_cross.std()])
        features.append([rms.mean(), rms.std()])
        
        # Concatenate: 13*2 + 12*2 + 2*4 = 26 + 24 + 8 = 58 features
        embedding = np.concatenate(features)
        
        # Pad to 2048 dimensions (to match training expectation)
        if len(embedding) < 2048:
            embedding = np.concatenate([embedding, np.zeros(2048 - len(embedding))])
        else:
            embedding = embedding[:2048]
        
        return embedding

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Usage: python audio_to_embeddings.py <audio_path>")
        sys.exit(1)
    
    audio_path = sys.argv[1]
    
    embedder = AudioEmbedder()
    embedding = embedder.embed_from_file(audio_path)
    
    # Output as JSON for Node.js to parse
    print(json.dumps(embedding.tolist()))