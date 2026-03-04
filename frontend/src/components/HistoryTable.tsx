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
    return (
        <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-800">
                <h2 className="text-xl font-semibold text-slate-100">Prediction History</h2>
                <p className="text-slate-400 text-sm">Past failure pattern analyses</p>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-950/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                            <th className="px-6 py-4">ID</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Confidence</th>
                            <th className="px-6 py-4">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {history.map((item) => (
                            <tr key={item.id} className="hover:bg-slate-800/30 transition-colors group">
                                <td className="px-6 py-4 text-slate-400 font-mono text-sm leading-none tabular-nums">#{item.id}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${item.prediction === 'Unknown' ? 'bg-slate-800 text-slate-500' : 'bg-blue-900/30 text-blue-400 border border-blue-900/50'}`}>
                                        {item.prediction}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{ width: `${Math.round(item.confidence * 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-slate-300 font-mono">{Math.round(item.confidence * 100)}%</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-xs whitespace-nowrap">
                                    {new Date(item.timestamp).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                        {history.length === 0 && (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-600 italic">
                                    No historical records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
