import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Camera, Upload, ScanLine, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export type ScanResult = {
  foodName: string;
  estimatedCarbs: number;
  glycemicIndex: number;
  predictedGlucosePeak: number;
  timeToPeakMinutes: number;
  recoveryMinutes: number;
}

export default function VisionEngine() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ScanResult | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setResult(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        const img = new Image();
        img.onload = () => {
           const canvas = document.createElement('canvas');
           const MAX_WIDTH = 1024;
           const MAX_HEIGHT = 1024;
           let width = img.width;
           let height = img.height;

           if (width > height) {
             if (width > MAX_WIDTH) {
               height = Math.round((height *= MAX_WIDTH / width));
               width = MAX_WIDTH;
             }
           } else {
             if (height > MAX_HEIGHT) {
               width = Math.round((width *= MAX_HEIGHT / height));
               height = MAX_HEIGHT;
             }
           }
           
           canvas.width = width;
           canvas.height = height;
           const ctx = canvas.getContext('2d');
           if (ctx) {
             ctx.fillStyle = '#FFF';
             ctx.fillRect(0, 0, width, height);
             ctx.drawImage(img, 0, 0, width, height);
             
             const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
             setImagePreview(dataUrl);
             setMimeType('image/jpeg');
           } else {
             setImagePreview(event.target!.result as string);
             setMimeType(file.type);
           }
        };
        img.src = event.target.result;
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsDataURL(file);
  };

  const handleScan = async () => {
    if (!imagePreview || !mimeType) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    // Extract base64 (strip "data:image/jpeg;base64," prefix)
    const base64Data = imagePreview.split(",")[1];

    try {
      const response = await fetch("http://localhost:5000/api/food-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageBase64: base64Data, mimeType }),
      });

      if (!response.ok) {
        throw new Error("Failed to scan food image. Server returned " + response.status);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred during the scan.");
    } finally {
      setIsLoading(false);
    }
  };

  const generateCurvePoints = () => {
    const points = [];
    const absolutePeak = result?.predictedGlucosePeak ?? 130;
    const peakDiff = absolutePeak - 90;
    const peakHeight = Math.min(Math.max(peakDiff, 20), 110);
    
    for (let i = 0; i <= 40; i++) {
        const x = (i / 40) * 400; 
        const percentage = i / 40;
        
        let yValue = 0;

        if (percentage <= 0.4) {
            const phase = (percentage / 0.4) * (Math.PI / 2);
            yValue = Math.sin(phase);
        } else {
            const phase = Math.PI / 2 + ((percentage - 0.4) / 0.6) * (Math.PI / 2);
            yValue = Math.sin(phase);
        }

        const baselineY = 130;
        const y = baselineY - (yValue * peakHeight);

        points.push(`${x},${y}`);
    }
    return points.join(" ");
  };

  const getCarbBadgeStyles = (carbs: number) => {
    if (carbs > 60) return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
    if (carbs >= 30) return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Vision-to-Simulation Engine</h1>
        <p className="text-muted-foreground">Snap your meal — GluPulse predicts your glucose response</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        <input 
          type="file" 
          accept="image/*" 
          capture="environment" 
          ref={cameraInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
        />
        
        <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="flex gap-2">
          <Upload className="w-4 h-4" /> Upload Photo
        </Button>
        <Button onClick={() => cameraInputRef.current?.click()} className="flex gap-2">
          <Camera className="w-4 h-4" /> Use Camera
        </Button>
      </div>

      {imagePreview && (
        <Card className="overflow-hidden border border-border shadow-sm">
          <div className="bg-muted p-2 h-64 flex items-center justify-center">
            <img 
              src={imagePreview} 
              alt="Meal preview" 
              className="max-h-full max-w-full object-contain rounded-md shadow-sm"
            />
          </div>
          <div className="p-4 bg-background border-t border-border flex justify-center">
            <Button 
              size="lg" 
              onClick={handleScan} 
              disabled={isLoading} 
              className="w-full sm:w-auto min-w-[200px]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  Analyzing Meal...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                   <ScanLine className="w-5 h-5" />
                   Scan Food
                </span>
              )}
            </Button>
          </div>
        </Card>
      )}

      {error && (
        <div className="bg-destructive/15 border border-destructive/30 text-destructive p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           
           <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-xl border border-border bg-card shadow-sm">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">{result.foodName}</h2>
              <div className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getCarbBadgeStyles(result.estimatedCarbs)}`}>
                 {result.estimatedCarbs}g Carbs
              </div>
           </div>

           <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{result.estimatedCarbs}g</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Glycemic Index</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{result.glycemicIndex}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Peak Glucose</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{result.predictedGlucosePeak} mg/dL</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Time to Peak</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="text-2xl font-bold">{result.timeToPeakMinutes}m</div>
                </CardContent>
              </Card>
           </div>

           <Card className="overflow-hidden">
             <CardHeader>
               <CardTitle>Glucose Recovery Curve</CardTitle>
               <CardDescription>Simulated response to this specific meal</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="w-full relative h-[250px]">
                 <svg width="100%" height="250" viewBox="0 0 400 160" preserveAspectRatio="none" className="overflow-visible">
                    <defs>
                      <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    <line x1="0" y1="130" x2="400" y2="130" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                    <line x1="160" y1="0" x2="160" y2="160" stroke="currentColor" strokeOpacity="0.2" strokeDasharray="3 3" strokeWidth="1" />
                    
                    {/* Hypo threshold */}
                    <line x1="0" y1="150" x2="400" y2="150" stroke="#ef4444" strokeDasharray="4 4" strokeWidth="2" />
                    <text x="390" y="145" textAnchor="end" fontSize="10" fill="#ef4444" className="font-medium">Hypo threshold</text>

                    {/* Peak label */}
                    <text x="160" y="20" textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.6" className="font-medium">Peak</text>
                    
                    {/* Baseline label */}
                    <text x="5" y="125" fontSize="10" fill="currentColor" opacity="0.6">Baseline (90)</text>

                    {/* Time axis labels */}
                    <text x="0" y="150" textAnchor="start" fontSize="10" fill="currentColor" opacity="0.6">0m</text>
                    <text x="400" y="150" textAnchor="end" fontSize="10" fill="currentColor" opacity="0.6">{result.recoveryMinutes}m</text>

                    {/* The Curve Fill */}
                    <polygon 
                      points={`0,160 0,130 ${generateCurvePoints()} 400,160`}
                      fill="url(#curveGradient)" 
                    />
                    
                    {/* The Curve Line */}
                    <polyline 
                      points={`0,130 ${generateCurvePoints()}`}
                      fill="none" 
                      stroke="#3b82f6" 
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                 </svg>
               </div>
             </CardContent>
           </Card>
        </div>
      )}
    </div>
  );
}
