"use client";

interface PredictionResultProps {
    prediction: string;
    confidence: number;
    topKeywords: string[];
    features: Record<string, any>;
}

export default function PredictionResult({ prediction, confidence, topKeywords, features }: PredictionResultProps) {
    const confidencePercent = Math.round(confidence * 100);

    const getSeverityColor = (conf: number) => {
        if (conf >= 0.8) return "bg-green-500 shadow-green-500/20";
        if (conf >= 0.6) return "bg-yellow-500 shadow-yellow-500/20";
        return "bg-red-500 shadow-red-500/20";
    };

    return (
        <div className="flex flex-col space-y-6 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100 mb-1">Prediction Analysis</h2>
                    <p className="text-slate-400 text-sm">ML Model Classification Result</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${prediction === 'Unknown' ? 'bg-slate-700 text-slate-300' : 'bg-blue-900/50 text-blue-300'}`}>
                    {prediction}
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Confidence Score</span>
                    <span className="font-mono text-slate-200">{confidencePercent}%</span>
                </div>
                <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ${getSeverityColor(confidence)}`}
                        style={{ width: `${confidencePercent}%` }}
                    />
                </div>
                {confidence < 0.6 && (
                    <p className="text-xs text-red-400 mt-2 flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>Low confidence. Needs human review.</span>
                    </p>
                )}
            </div>

            <div>
                <h3 className="text-sm font-medium text-slate-300 mb-3">Top Contributing Keywords</h3>
                <div className="flex flex-wrap gap-2">
                    {topKeywords.map((kw, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-700">
                            {kw}
                        </span>
                    ))}
                    {topKeywords.length === 0 && <span className="text-slate-500 text-xs italic">No specific keywords identified</span>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
                {Object.entries(features).map(([key, value]) => (
                    <div key={key} className="p-3 bg-slate-950/50 rounded-lg border border-slate-800/50">
                        <p className="text-[10px] uppercase tracking-tighter text-slate-500 mb-1">{key.replace('is_', '').replace('has_', '').replace('_', ' ')}</p>
                        <p className={`text-sm font-semibold ${value ? 'text-blue-400' : 'text-slate-600'}`}>
                            {typeof value === 'boolean' ? (value ? 'DETECTED' : 'NONE') : value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
