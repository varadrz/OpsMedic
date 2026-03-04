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

    const loadSample = (type: keyof typeof SAMPLES) => {
        setContent(SAMPLES[type]);
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col">
                <h2 className="text-base font-semibold text-slate-900">Direct Data Input</h2>
                <p className="text-xs text-slate-500">Paste your logs for root-cause classification</p>
            </div>

            <div className="flex flex-wrap gap-1.5">
                {Object.keys(SAMPLES).map((key) => (
                    <button
                        key={key}
                        onClick={() => loadSample(key as keyof typeof SAMPLES)}
                        className="px-3 py-1 text-xs font-medium border border-slate-200 text-slate-600 rounded hover:bg-slate-50 transition-colors"
                    >
                        {key}
                    </button>
                ))}
            </div>

            <div className="relative border border-slate-200 rounded overflow-hidden focus-within:ring-1 focus-within:ring-indigo-500 transition-all">
                <textarea
                    className="w-full h-80 p-4 bg-slate-50 text-slate-800 font-mono text-xs outline-none resize-none placeholder:text-slate-400 font-medium"
                    placeholder="Log stream goes here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </div>

            <button
                onClick={() => onAnalyze(content)}
                disabled={loading || !content.trim()}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold rounded transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-sm"
            >
                {loading ? (
                    <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="uppercase tracking-wide">Processing...</span>
                    </>
                ) : (
                    <>
                        <span className="uppercase tracking-wide">Analyze Logs</span>
                    </>
                )}
            </button>
        </div>
    );
}
