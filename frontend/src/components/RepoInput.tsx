"use client";

import { useState } from "react";

interface RepoInputProps {
    onAnalyze: (url: string) => Promise<void>;
    loading: boolean;
}

export default function RepoInput({ onAnalyze, loading }: RepoInputProps) {
    const [url, setUrl] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (url.trim()) {
            onAnalyze(url);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
                <h2 className="text-base font-semibold text-slate-900">Remote Repository Scan</h2>
                <p className="text-xs text-slate-500">Provide URL for automated pattern matching</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col justify-center">
                <div className="relative border border-slate-200 rounded overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 transition-all bg-slate-50 p-1">
                    <div className="flex items-center px-3">
                        <span className="text-sm mr-2 opacity-50">🔗</span>
                        <input
                            type="text"
                            className="w-full py-2 bg-transparent text-slate-900 outline-none text-xs font-medium placeholder:text-slate-400"
                            placeholder="e.g. https://github.com/org/repo"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded text-xs text-indigo-700 italic">
                    <p className="leading-relaxed">
                        Engine will automate the extraction and analysis of the latest workflow failure signals.
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold rounded transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-sm"
                >
                    {loading ? (
                        <div className="flex items-center space-x-2">
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span className="uppercase tracking-wide">Scanning...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                            <span className="uppercase tracking-wide">Search Repository</span>
                        </div>
                    )}
                </button>
            </form>
        </div>
    );
}
