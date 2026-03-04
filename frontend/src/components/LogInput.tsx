"use client";

import { useState } from "react";

interface LogInputProps {
    onAnalyze: (content: string) => void;
    loading: boolean;
}

const SAMPLES = {
    timeout: "Error: Task timed out after 300.03 seconds\nProcess finished with exit code 143 (interrupted by signal 15: SIGTERM)",
    dependency: "Could not resolve dependencies for project com.opsmedic:engine:jar:1.0.0\n[ERROR] Failed to execute goal on project engine: Could not resolve dependencies for project com.opsmedic:engine:jar:1.0.0: The following artifacts could not be resolved: org.springframework:spring-core:jar:6.0.0: Could not find artifact org.springframework:spring-core:jar:6.0.0",
    assertion: "AssertionError: expected 'success' but got 'failure'\n    at Context.<anonymous> (test/auth.test.js:45:12)\n    at processImmediate (node:internal/timers:466:21)",
};

export default function LogInput({ onAnalyze, loading }: LogInputProps) {
    const [content, setContent] = useState("");

    const useSample = (type: keyof typeof SAMPLES) => {
        setContent(SAMPLES[type]);
    };

    return (
        <div className="flex flex-col space-y-4 p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-semibold text-slate-100">CI/CD Log Input</h2>
                <div className="flex space-x-2">
                    {Object.keys(SAMPLES).map((key) => (
                        <button
                            key={key}
                            onClick={() => useSample(key as keyof typeof SAMPLES)}
                            className="px-2 py-1 text-[10px] uppercase font-bold tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-400 rounded border border-slate-700 transition-colors"
                        >
                            {key}
                        </button>
                    ))}
                </div>
            </div>
            <textarea
                className="w-full h-80 p-4 bg-slate-950 text-slate-300 font-mono text-sm rounded-lg border border-slate-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none"
                placeholder="Paste your GitHub Actions or Jenkins logs here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                onClick={() => onAnalyze(content)}
                disabled={loading || !content.trim()}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
            >
                {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Analyzing Patterns...</span>
                    </>
                ) : (
                    <span>Analyze Failure Pattern</span>
                )}
            </button>
        </div>
    );
}
