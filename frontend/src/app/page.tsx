"use client";

import { useState, useEffect } from "react";
import LogInput from "@/components/LogInput";
import RepoInput from "@/components/RepoInput";
import PredictionResult from "@/components/PredictionResult";
import HistoryTable from "@/components/HistoryTable";
import ModelManagement from "@/components/ModelManagement";

const API_BASE = "http://localhost:8000";

type AnalysisMode = "manual" | "repo";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState<AnalysisMode>("manual");

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/history`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleAnalyze = async (content: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
        fetchHistory(); // Refresh history after new prediction
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepoAnalyze = async (url: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/analyze-repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      if (res.ok && data.status !== "error") {
        setPrediction(data);
        fetchHistory();
      } else {
        alert(data.message || "Failed to analyze repository");
      }
    } catch (err) {
      console.error("Repo analysis failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTrain = async () => {
    try {
      const res = await fetch(`${API_BASE}/train`, { method: "POST" });
      if (!res.ok) throw new Error("Training failed");
    } catch (err) {
      console.error("Training error:", err);
      throw err;
    }
  };
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-start">
            <div className="flex flex-col space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 w-fit">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-widest text-blue-400">System Online</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                OpsMedic
              </h1>
            </div>

            {/* Mode Switcher */}
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-xl">
              <button
                onClick={() => setMode("manual")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === "manual" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
              >
                LOG ANALYSIS
              </button>
              <button
                onClick={() => setMode("repo")}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${mode === "repo" ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:text-slate-300"}`}
              >
                REPO SCANNER
              </button>
            </div>
          </div>
          <p className="text-slate-400 max-w-2xl">
            AI-powered CI/CD failure pattern learning engine. Analyze logs or scan repositories to classify failure types and predict root causes.
          </p>
        </div>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="animate-in fade-in slide-in-from-left-4 duration-500">
            {mode === "manual" ? (
              <LogInput onAnalyze={handleAnalyze} loading={loading} />
            ) : (
              <RepoInput onAnalyze={handleRepoAnalyze} loading={loading} />
            )}
          </div>

          <div className="h-full">
            {prediction ? (
              <PredictionResult
                prediction={prediction.prediction}
                confidence={prediction.confidence}
                topKeywords={prediction.top_keywords}
                features={prediction.features}
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-12 bg-slate-900/50 rounded-xl border border-dashed border-slate-800 h-full text-center">
                <div className="w-16 h-16 bg-slate-950 rounded-2xl flex items-center justify-center mb-4 border border-slate-800 font-mono text-3xl">
                  {mode === "manual" ? "📄" : "🔍"}
                </div>
                <h3 className="text-lg font-medium text-slate-300">
                  {mode === "manual" ? "Awaiting Log Data" : "Ready for Repo Scan"}
                </h3>
                <p className="text-slate-500 text-sm max-w-[240px] mt-2">
                  {mode === "manual"
                    ? "Paste CI/CD logs in the input section to begin pattern analysis."
                    : "Enter a public GitHub repository URL to scan for failed workflow runs."}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <HistoryTable history={history} />

        {/* Model Management Section */}
        <ModelManagement onTrain={handleTrain} />

        {/* Footer */}
        <footer className="pt-12 border-t border-slate-900 flex justify-between items-center text-slate-500 text-xs">
          <p>© 2026 OpsMedic AI Learning Engine</p>
          <div className="flex space-x-4">
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">Security</span>
            <span className="hover:text-slate-300 cursor-pointer transition-colors">API Reference</span>
          </div>
        </footer>
      </div>
    </main>
  );
}
