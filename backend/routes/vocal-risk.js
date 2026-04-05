import express from 'express';
import multer from 'multer';
import path from 'path';
import { spawn } from 'child_process';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// ESM fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Configuration for Python command (Windows usually uses 'python')
const PYTHON_CMD = process.platform === 'win32' ? 'python' : 'python3';

router.post('/vocal-risk', upload.single('audio'), async (req, res) => {
    // Using process.cwd() to ensure the temp path works across OS environments
    const tempAudioPath = path.join(process.cwd(), `audio_${Date.now()}.wav`);
    
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
            path.join(__dirname, '../utils/audio_to_embeddings.py'),
            [tempAudioPath]
        );
        
        // Step 2: Classify
        console.log('[VOCAL_RISK] Running inference...');
        const result = await runPythonScript(
            path.join(__dirname, '../utils/inference.py'),
            [JSON.stringify(embedding)]
        );
        
        // Step 3: Format response
        const riskScore = result.risk_score || 0;
        const confidence = result.confidence || 0;
        const xaiLabel = riskScore > 0.7 ? '🔴 HIGH RISK' : 
                         riskScore > 0.5 ? '🟡 MODERATE RISK' : 
                         '🟢 LOW RISK';
        
        res.json({
            riskScore: parseFloat(riskScore.toFixed(3)),
            confidence: parseFloat(confidence.toFixed(3)),
            xaiLabel: xaiLabel,
            features: {
                model: 'vocadiab-byol-s',
                embedding_dim: embedding?.length || 0,
                top_feature_indices: result.top_feature_indices || [],
                dataset: 'colive-voice-study',
                reference: 'https://doi.org/10.1038/s41598-023-xxxxx'
            },
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('[VOCAL_RISK_ERROR]', error.message);
        res.status(500).json({ 
            error: 'Inference failed: ' + error.message,
            fallback: { riskScore: 0.5, xaiLabel: '⚠️ System error' }
        });
    } finally {
        // Cleanup temp file
        if (fs.existsSync(tempAudioPath)) {
            try {
                fs.unlinkSync(tempAudioPath);
            } catch (cleanupErr) {
                console.error('[CLEANUP_ERROR]', cleanupErr.message);
            }
        }
    }
});

function runPythonScript(scriptPath, args) {
    return new Promise((resolve, reject) => {
        // Use the platform-specific python command
        const python = spawn(PYTHON_CMD, [scriptPath, ...args]);
        
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
                reject(new Error(`Python error (Code ${code}): ${error}`));
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

export default router;