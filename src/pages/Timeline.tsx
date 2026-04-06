import React, { useState } from 'react';
import { 
  ComposedChart, Area, Bar, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ReferenceArea, ReferenceLine, ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

// --- TYPES ---
type TimelineEvent = {
  time: string;
  glucose: number;
  iob: number;
  steps: number;
  event: string | null;
}

type Annotation = {
  time: string;
  label: string;
  color: string;
}

type SleepData = {
  hours: number;
  quality: number;
}

type ScenarioData = {
  label: string;
  description: string;
  xaiVerdict: string;
  riskScore: number;
  data: TimelineEvent[];
  sleep: SleepData;
  annotations: Annotation[];
}

// --- SCENARIO DATA ---
const scenarios: Record<string, ScenarioData> = {
  scenario_a: {
    label: "Morning Crash",
    description: "Predictive alert: pre-breakfast hypoglycemia",
    xaiVerdict: "CRITICAL: High basal insulin + 0g carb buffer + poor sleep (5h)",
    riskScore: 82,
    data: [
      { time: "05:00", glucose: 102, iob: 4.2, steps: 0,    event: null },
      { time: "06:00", glucose: 98,  iob: 4.0, steps: 50,   event: "Woke up" },
      { time: "06:30", glucose: 90,  iob: 3.8, steps: 80,   event: null },
      { time: "07:00", glucose: 85,  iob: 3.6, steps: 100,  event: "Skipped breakfast" },
      { time: "07:30", glucose: 74,  iob: 3.4, steps: 120,  event: "⚠ GluPulse Alert" },
      { time: "08:00", glucose: 65,  iob: 3.1, steps: 140,  event: null },
      { time: "08:15", glucose: 58,  iob: 2.9, steps: 150,  event: "🚨 Predicted Crash" },
      { time: "08:45", glucose: 72,  iob: 2.6, steps: 200,  event: "Ate glucose tablet" },
      { time: "09:30", glucose: 95,  iob: 2.2, steps: 400,  event: "Stabilised" },
    ],
    sleep: { hours: 5, quality: 62 },
    annotations: [
      { time: "07:00", label: "Meal skipped", color: "#f59e0b" },
      { time: "07:30", label: "Alert fired", color: "#ef4444" },
      { time: "08:15", label: "Crash predicted", color: "#dc2626" },
      { time: "08:45", label: "Recovery", color: "#10b981" },
    ]
  },
  scenario_b: {
    label: "Post-Meal Spike",
    description: "Vision engine response to high-GI meal",
    xaiVerdict: "HIGH: Pepperoni pizza (85g carbs, GI: High) + no bolus taken",
    riskScore: 67,
    data: [
      { time: "12:00", glucose: 105, iob: 1.2, steps: 1200, event: "Lunch: Pizza" },
      { time: "12:30", glucose: 128, iob: 1.0, steps: 1300, event: null },
      { time: "13:00", glucose: 165, iob: 0.8, steps: 1400, event: "⚠ Spike detected" },
      { time: "13:30", glucose: 198, iob: 0.5, steps: 1500, event: null },
      { time: "14:00", glucose: 210, iob: 0.3, steps: 1600, event: "🚨 Peak glucose" },
      { time: "14:30", glucose: 188, iob: 0.2, steps: 2000, event: "Walk started" },
      { time: "15:00", glucose: 155, iob: 0.1, steps: 4000, event: null },
      { time: "15:30", glucose: 128, iob: 0.1, steps: 6000, event: "Normalising" },
      { time: "16:00", glucose: 108, iob: 0.0, steps: 7200, event: "Stable" },
    ],
    sleep: { hours: 7, quality: 80 },
    annotations: [
      { time: "12:00", label: "High-GI meal", color: "#f59e0b" },
      { time: "14:00", label: "Peak 210 mg/dL", color: "#dc2626" },
      { time: "14:30", label: "Walk intervention", color: "#3b82f6" },
      { time: "16:00", label: "Stable", color: "#10b981" },
    ]
  },
  scenario_c: {
    label: "SOS Trigger",
    description: "Dead-Man's Switch activation",
    xaiVerdict: "CRITICAL: Reflex test FAILED (1250ms > 600ms threshold) + 0 steps + horizontal posture",
    riskScore: 95,
    data: [
      { time: "14:00", glucose: 115, iob: 3.8, steps: 1200, event: "Lunch skipped" },
      { time: "15:00", glucose: 95,  iob: 3.2, steps: 5400, event: "3km walk" },
      { time: "15:30", glucose: 72,  iob: 2.8, steps: 9200, event: "⚠ Rapid depletion" },
      { time: "15:45", glucose: 65,  iob: 2.6, steps: 9800, event: "Reflex test: FAIL" },
      { time: "16:00", glucose: 58,  iob: 2.4, steps: 10500, event: "🚨 CRITICAL" },
      { time: "16:00", glucose: 52,  iob: 2.2, steps: 10500, event: "SOS dispatched" },
      { time: "16:05", glucose: 50,  iob: 2.1, steps: 10500, event: "Guardian alerted" },
    ],
    sleep: { hours: 5.5, quality: 62 },
    annotations: [
      { time: "15:00", label: "High activity", color: "#f59e0b" },
      { time: "15:30", label: "Rapid drop", color: "#ef4444" },
      { time: "15:45", label: "Reflex FAIL", color: "#dc2626" },
      { time: "16:00", label: "SOS fired", color: "#7c3aed" },
    ]
  }
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload as TimelineEvent;
    return (
      <div className="bg-white/95 backdrop-blur-sm p-4 border border-gray-200 rounded-xl shadow-xl flex flex-col gap-1.5 text-sm w-48">
        <p className="font-bold text-gray-900 border-b pb-1 mb-1">{label}</p>
        <p className="text-blue-600 font-medium flex justify-between"><span>Glucose:</span> <span>{dataPoint.glucose} mg/dL</span></p>
        <p className="text-purple-600 font-medium flex justify-between"><span>Steps:</span> <span>{dataPoint.steps}</span></p>
        <p className="text-amber-600 font-medium flex justify-between"><span>IOB:</span> <span>{dataPoint.iob} U</span></p>
        {dataPoint.event && (
          <div className="mt-2 text-center font-bold text-red-600 text-xs tracking-wider uppercase bg-red-50/80 px-2 py-1.5 rounded-md">
             {dataPoint.event}
          </div>
        )}
      </div>
    );
  }
  return null;
};

export default function StorylineTimeline() {
  const [activeKey, setActiveKey] = useState<keyof typeof scenarios>('scenario_a');
  
  const currentScenario = scenarios[activeKey];
  const { data, annotations, riskScore, xaiVerdict, sleep } = currentScenario;

  // Banner styles based on riskScore
  let bannerBg = 'bg-green-900';
  let bannerText = 'text-green-200';
  let scoreColor = 'text-green-500';
  
  if (riskScore >= 80) {
    bannerBg = 'bg-red-950 text-red-100 border border-red-900';
    bannerText = 'text-red-200 opacity-90';
    scoreColor = 'text-red-600';
  } else if (riskScore >= 60) {
    bannerBg = 'bg-amber-900 text-amber-50 border border-amber-800';
    bannerText = 'text-amber-200 opacity-90';
    scoreColor = 'text-amber-500';
  }

  // Calculate Stats
  const maxGlucose = Math.max(...data.map(d => d.glucose));
  const minGlucose = Math.min(...data.map(d => d.glucose));
  const sleepQualityText = sleep.quality < 65 ? 'Poor — metabolic sensitivity ↑' : sleep.quality < 80 ? 'Fair' : 'Good';
  const sleepBarColor = sleep.hours < 6 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' 
                      : sleep.hours < 7 ? 'bg-amber-500' : 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]';
  const sleepPercentage = Math.min(100, (sleep.hours / 8) * 100);

  return (
    <div className="max-w-6xl mx-auto p-4 lg:p-8 space-y-8 animate-in fade-in duration-700">
      
      {/* 1. HEADER & SCENARIO SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Storyline Intelligence Timeline</h1>
          <p className="text-gray-500 mt-1.5 font-medium">Every risk score explained — transparently.</p>
        </div>
        
        <div className="flex flex-col items-start md:items-end gap-2">
          <div className="flex flex-wrap gap-2 bg-gray-50/80 p-1.5 rounded-full border border-gray-100 shadow-sm">
            {(Object.entries(scenarios) as [keyof typeof scenarios, ScenarioData][]).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeKey === key 
                    ? 'bg-blue-600 text-white shadow-md scale-105' 
                    : 'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {scenario.label}
              </button>
            ))}
          </div>
          <p className="text-sm text-gray-500 italic mr-2">
            Viewing: {currentScenario.description}
          </p>
        </div>
      </div>

      {/* 2. XAI VERDICT BANNER */}
      <div className={`${bannerBg} rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg transition-colors duration-500`}>
        <div className="flex-1">
          <span className="font-bold uppercase tracking-widest text-[10px] sm:text-xs block mb-1 opacity-80">GluPulse Verdict</span>
          <p className="font-medium text-lg leading-snug sm:text-xl text-balance">{xaiVerdict}</p>
        </div>
        <div className="bg-black/20 px-6 py-3 rounded-xl flex items-baseline gap-1.5 shrink-0 border border-white/5">
          <span className="text-5xl font-black tracking-tighter">{riskScore}</span>
          <span className="font-bold uppercase tracking-widest text-xs opacity-60">/ 100</span>
        </div>
      </div>

      {/* 5. STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-gray-100/60 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">Peak Glucose</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-black text-gray-800 tracking-tight">{maxGlucose} <span className="text-sm font-medium text-gray-400">mg/dL</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100/60 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">Min Glucose</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-black text-gray-800 tracking-tight">{minGlucose} <span className="text-sm font-medium text-gray-400">mg/dL</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100/60 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">Sleep Quality</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-black text-gray-800 tracking-tight">{sleep.hours}h <span className="text-sm font-medium text-gray-400">/ Score: {sleep.quality}</span></div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-gray-100/60 bg-gradient-to-br from-white to-gray-50/50">
          <CardHeader className="p-5 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-gray-500">Risk Score</CardTitle>
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className={`text-3xl font-black tracking-tight ${scoreColor}`}>{riskScore} <span className="text-sm font-medium text-gray-400">/ 100</span></div>
          </CardContent>
        </Card>
      </div>

      {/* 3. MAIN RECHARTS CHART */}
      <div className="h-[400px] w-full bg-white border border-gray-100/80 rounded-2xl p-2 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#E5E7EB" strokeOpacity={0.6} />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 13, fill: '#6B7280', fontWeight: 500 }} dy={10} />
            <YAxis yAxisId="left" domain={[40, 230]} orientation="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dx={-10} />
            <YAxis yAxisId="right" domain={[0, 12000]} orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dx={10} />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6B7280', strokeWidth: 1, strokeDasharray: '4 4' }} />
            <Legend wrapperStyle={{ paddingTop: '20px', fontWeight: 600, fontSize: '13px' }} iconType="circle" />

            {/* Background Reference Areas */}
            <ReferenceArea yAxisId="left" y1={40} y2={70} fill="#fecaca" fillOpacity={0.2} label={{ position: 'insideTopLeft', value: 'Hypo Zone', fill: '#ef4444', fontSize: 12, fontWeight: 'bold' }} />
            <ReferenceArea yAxisId="left" y1={70} y2={140} fill="#d1fae5" fillOpacity={0.15} label={{ position: 'insideTopLeft', value: 'Target Zone', fill: '#10b981', fontSize: 12, fontWeight: 'bold' }} />
            <ReferenceArea yAxisId="left" y1={180} y2={230} fill="#fef3c7" fillOpacity={0.3} label={{ position: 'insideTopLeft', value: 'High Zone', fill: '#f59e0b', fontSize: 12, fontWeight: 'bold' }} />

            {/* Data Series */}
            <Bar yAxisId="right" dataKey="steps" fill="url(#stepGradient)" opacity={0.6} barSize={12} name="Steps" radius={[4, 4, 0, 0]} />
            <Area yAxisId="left" type="monotone" dataKey="glucose" stroke="#3b82f6" fill="url(#glucoseGradient)" strokeWidth={3} name="Glucose (mg/dL)" activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff', fill: '#3b82f6' }} />
            <Line yAxisId="left" type="monotone" dataKey="iob" stroke="#f59e0b" strokeDasharray="5 5" strokeWidth={2.5} dot={false} name="Insulin (IOB)" activeDot={false} />

            {/* Gradients */}
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="stepGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1}/>
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.4}/>
              </linearGradient>
            </defs>

            {/* Annotations Lines */}
            {annotations.map((ann, idx) => (
              <ReferenceLine 
                key={idx} 
                yAxisId="left" 
                x={ann.time} 
                stroke={ann.color} 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{ 
                  position: 'insideTopRight', 
                  value: ann.label, 
                  fill: ann.color, 
                  fontSize: 11,
                  fontWeight: 700,
                  offset: 8
                }} 
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* 4. STORYLINE NARRATIVE STEPPER */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-8 shadow-sm overflow-x-auto relative mt-2">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-10 text-center">Narrative Sequence</h3>
        <div className="relative min-w-[700px] flex justify-between items-center px-8 max-w-4xl mx-auto">
          {/* Horizontal connecting line */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 -z-10" />
          
          {annotations.map((ann, idx) => (
            <div key={idx} className="relative flex flex-col items-center justify-center w-28 group">
              <div className="absolute -top-7 text-xs font-black text-gray-400 bg-white px-2">
                {ann.time}
              </div>
              <div 
                className="w-5 h-5 rounded-full border-[3px] border-white z-10 transition-transform group-hover:scale-125"
                style={{ backgroundColor: ann.color, boxShadow: `0 0 0 1px ${ann.color}` }}
              />
              <div 
                className="absolute -bottom-8 text-xs font-bold text-center w-36 leading-tight transition-all"
                style={{ color: ann.color }}
              >
                {ann.label}
              </div>
            </div>
          ))}
        </div>
        <div className="h-4" /> {/* spacing buffer */}
      </div>

      {/* 6. SLEEP MINI-BAR */}
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm space-y-3 relative overflow-hidden">
        <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end text-sm gap-2">
          <span className="font-bold text-gray-800 tracking-tight">Metabolic Context: Sleep Baseline</span>
          <span className="font-medium text-gray-500">Sleep last night: <span className="font-bold text-gray-700">{sleep.hours}h</span> — {sleepQualityText}</span>
        </div>
        <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex relative shadow-inner">
          <div 
            className={`h-full ${sleepBarColor} transition-all duration-1000 ease-out`}
            style={{ width: `${sleepPercentage}%` }}
          />
          {/* Target marker line passing through the bar */}
          <div className="absolute left-[100%] h-full border-l-2 border-white/60 drop-shadow-md z-10 hidden" />
        </div>
        <div className="flex justify-between text-[11px] uppercase tracking-wider text-gray-400 font-bold px-1">
          <span>0h</span>
          <span>4h</span>
          <span>8h Target</span>
        </div>
      </div>

    </div>
  );
}
