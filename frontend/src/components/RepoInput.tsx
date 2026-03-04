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
        <div className="flex flex-col space-y-4 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-slate-100">Deep Repo Analysis</h2>
                <div className="px-2 py-0.5 bg-blue-900/40 text-blue-400 text-[10px] font-bold uppercase rounded border border-blue-800/50">
                    GitHub Actions
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-slate-500 text-sm">🔗</span>
                    </div>
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-3 bg-slate-950 text-slate-300 rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                        placeholder="https://github.com/owner/repository"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || !url.trim()}
                    className="w-full px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 text-white font-medium rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                >
                    {loading ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>Scanning Repository...</span>
                        </>
                    ) : (
                        <span>Analyze Latest Failure</span>
                    )}
                </button>
            </form>

            <p className="text-[10px] text-slate-500 mt-2 text-center italic">
                Analyzes the latest failed CI/CD workflow run logs from public repositories.
            </p>
        </div>
    );
}
