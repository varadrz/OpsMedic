"use client";

interface PredictionResultProps {
    prediction: string;
    confidence: number;
    topKeywords: string[];
    features: Record<string, any>;
    isSafe?: boolean;
}
export default function PredictionResult({ prediction, confidence, topKeywords, features, isSafe }: PredictionResultProps) {
    const confidencePercent = Math.round(confidence * 100);

    return (
        <div className={`space-y-6 h-full animate-in fade-in transition-all duration-700`}>
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">
                        {isSafe ? "System Status: Stable" : "Diagnostic Verdict"}
                    </h2>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">AI Classification Report</p>
                </div>
                <div className={`px-3 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm ${isSafe ? 'bg-emerald-600 text-white' : 'bg-indigo-600 text-white'}`}>
                    {prediction}
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-slate-600 text-xs font-bold uppercase tracking-tight">Confidence Level</span>
                    <span className={`text-2xl font-bold ${isSafe ? 'text-emerald-600' : 'text-indigo-600'}`}>{isSafe ? '100' : confidencePercent}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <div
                        className={`h-full transition-all duration-1000 ${isSafe ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${isSafe ? 100 : confidencePercent}%` }}
                    />
                </div>
                {!isSafe && confidence < 0.6 && (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded flex items-center space-x-3 mt-2 animate-pulse">
                        <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white text-xs font-bold">!</div>
                        <div>
                            <p className="text-[10px] font-bold text-amber-800 uppercase">Ambiguous Signal</p>
                            <p className="text-[10px] text-amber-600 font-medium">Results may requires manual verification.</p>
                        </div>
                    </div>
                )}
            </div>

            {isSafe ? (
                <div className="flex-1 flex flex-col items-center justify-center p-6 bg-emerald-50 rounded border border-emerald-100 text-center">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm border border-emerald-100">
                        <span className="text-lg">✓</span>
                    </div>
                    <p className="text-emerald-800 font-medium text-xs leading-relaxed">System contrast appears nominal. No recurring failure patterns detected.</p>
                </div>
            ) : (
                <>
                    <div className="space-y-2 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-900 border-l-2 border-indigo-600 pl-2">Pattern Markers</h3>
                        <div className="flex flex-wrap gap-1.5">
                            {topKeywords.map((kw, idx) => (
                                <span key={idx} className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded border border-indigo-100">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-4">
                        {Object.entries(features).map(([key, value]) => (
                            <div key={key} className={`p-2.5 rounded border transition-shadow hover:shadow-sm ${value ? 'bg-slate-50 border-slate-200' : 'bg-white border-slate-100'}`}>
                                <p className="text-[10px] font-bold uppercase tracking-tight text-slate-500 mb-0.5">{key.replace('is_', '').replace('has_', '').replace('_', ' ')}</p>
                                <p className={`text-xs font-bold ${value ? 'text-indigo-600' : 'text-slate-300'}`}>
                                    {typeof value === 'boolean' ? (value ? 'YES' : 'NO') : value}
                                </p>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
