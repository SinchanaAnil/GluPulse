const express = require('express');
const multer = require('multer');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/vocal-risk', upload.single('audio'), async (req, res) => {
    const tempAudioPath = path.join('/tmp', `audio_${Date.now()}.wav`);
    
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No audio file provided' });
        }
        
        console.log(`[VOCAL_RISK] Received audio: ${req.file.size} bytes`);
        
        // Save audio temporarily
        fs.writeFileSync(tempAudioPath, req.file.buffer);
        
        // Step 1: Extract embedding
        console.log('[VOCAL_RISK] Extracting embedding...');
        const embedding = await runPythonScript(
            'backend/utils/audio_to_embeddings.py',
            [tempAudioPath]
        );
        
        // Step 2: Classify
        console.log('[VOCAL_RISK] Running inference...');
        const result = await runPythonScript(
            'backend/utils/inference.py',
            [JSON.stringify(embedding)]
        );
        
        // Step 3: Format response
        const riskScore = result.risk_score;
        const xaiLabel = riskScore > 0.7 ? '🔴 HIGH RISK' : 
                         riskScore > 0.5 ? '🟡 MODERATE RISK' : 
                         '🟢 LOW RISK';
        
        res.json({
            riskScore: parseFloat(riskScore.toFixed(3)),
            confidence: parseFloat(result.confidence.toFixed(3)),
            xaiLabel: xaiLabel,
            features: {
                model: 'vocadiab-byol-s',
                embedding_dim: embedding.length,
                top_feature_indices: result.top_feature_indices,
                dataset: 'colive-voice-study',
                reference: 'https://doi.org/10.1038/s41598-023-xxxxx'
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[VOCAL_RISK_ERROR]', error.message);
        res.status(500).json({ 
            error: 'Inference failed: ' + error.message,
            fallback: { riskScore: 0.5, xaiLabel: '⚠️  System error' }
        });
    } finally {
        // Cleanup
        if (fs.existsSync(tempAudioPath)) {
            fs.unlinkSync(tempAudioPath);
        }
    }
});

function runPythonScript(scriptPath, args) {
    return new Promise((resolve, reject) => {
        const python = spawn('python3', [scriptPath, ...args]);
        
        let output = '';
        let error = '';
        
        python.stdout.on('data', (data) => {
            output += data.toString();
        });
        
        python.stderr.on('data', (data) => {
            error += data.toString();
        });
        
        python.on('close', (code) => {
            if (code !== 0) {
                reject(new Error(`Python error (${code}): ${error}`));
            } else {
                try {
                    const result = JSON.parse(output);
                    resolve(result);
                } catch (e) {
                    reject(new Error(`Failed to parse Python output: ${output}`));
                }
            }
        });
        
        python.on('error', (err) => {
            reject(new Error(`Failed to spawn Python process: ${err.message}`));
        });
    });
}

module.exports = router;