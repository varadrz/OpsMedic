"use client";

interface HistoryItem {
    id: number;
    prediction: string;
    confidence: number;
    timestamp: string;
}

interface HistoryTableProps {
    history: HistoryItem[];
}

export default function HistoryTable({ history }: HistoryTableProps) {
    const formatDate = (ts: string) => {
        const d = new Date(ts);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatTime = (ts: string) => {
        const d = new Date(ts);
        return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="w-full">
            <div className="max-h-[500px] overflow-y-auto no-scrollbar">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#fafbfc] border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-tight">Analysis Date</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-tight">Classification</th>
                            <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-tight text-right">Confidence Score</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {history.map((item: any, idx) => {
                            const isSafe = item.prediction.toLowerCase().includes('safe') || item.prediction.toLowerCase().includes('healthy');
                            return (
                                <tr key={idx} className="group hover:bg-slate-50 transition-colors cursor-pointer">
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-semibold text-slate-900">{formatDate(item.timestamp)}</p>
                                        <p className="text-xs text-slate-400 mt-0.5">{formatTime(item.timestamp)}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight ${isSafe ? 'bg-emerald-100 text-emerald-800' : 'bg-red-50 text-red-700'}`}>
                                                {item.prediction}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-xs font-bold text-slate-600">{Math.round(item.confidence * 10)}/10</span>
                                                <div className={`w-6 h-6 rounded flex items-center justify-center text-white font-bold text-[10px] ${isSafe ? 'bg-emerald-500' : 'bg-indigo-500'}`}>
                                                    {Math.round(item.confidence * 100)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
                {history.length === 0 && (
                    <div className="p-16 text-center text-slate-300 font-bold uppercase text-[10px] bg-white italic">
                        No history records found.
                    </div>
                )}
            </div>
        </div>
    );
}
