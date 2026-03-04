"use client";

import { useState, useEffect } from "react";
import LogInput from "@/components/LogInput";
import RepoInput from "@/components/RepoInput";
import PredictionResult from "@/components/PredictionResult";
import HistoryTable from "@/components/HistoryTable";
import ModelManagement from "@/components/ModelManagement";
import Toasts, { Toast, ToastType } from "@/components/Toasts";
import InfoPages from "@/components/InfoPages";

const API_BASE = "http://localhost:8000";

type AnalysisMode = "manual" | "repo";
type ViewType = "dashboard" | "docs" | "security" | "api" | "privacy" | "infrastructure" | "contact";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);
  const [history, setHistory] = useState([]);
  const [mode, setMode] = useState<AnalysisMode>("repo");
  const [view, setView] = useState<ViewType>("dashboard");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [sessionId, setSessionId] = useState<string>("");

  const addToast = (message: string, type: ToastType = "info") => {
    const id = Date.now().toString();
    setToasts((prev) => [...prev, { id, message, type }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const fetchHistory = async (sid?: string) => {
    const id = sid || sessionId;
    if (!id) return;
    try {
      const res = await fetch(`${API_BASE}/history?session_id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  useEffect(() => {
    // Generate or retrieve persistent session ID
    let sid = localStorage.getItem("opsmedic_session_id");
    if (!sid) {
      sid = crypto.randomUUID();
      localStorage.setItem("opsmedic_session_id", sid);
    }
    setSessionId(sid);
    fetchHistory(sid);
  }, []);

  const handleAnalyze = async (content: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, session_id: sessionId }),
      });

      if (res.ok) {
        const data = await res.json();
        setPrediction(data);
        fetchHistory();
        addToast("Analysis complete.", "success");
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
        body: JSON.stringify({ url, session_id: sessionId }),
      });

      const data = await res.json();
      if (res.ok && data.status !== "error") {
        setPrediction(data);
        fetchHistory();
        addToast("Repository scan complete.", "success");
      } else {
        addToast(data.message || "Failed to analyze repository", "error");
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
      const data = await res.json();
      addToast(`Training complete! Accuracy: ${data.accuracy}`, "success");
    } catch (err) {
      console.error("Training error:", err);
      throw err;
    }
  };

  return (
    <main className="min-h-screen bg-white text-slate-800 font-sans selection:bg-indigo-50">
      {/* Minimal Navigation */}
      <nav className="border-b border-slate-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-7 h-7 bg-indigo-600 rounded-md flex items-center justify-center text-white font-bold text-lg italic shadow-sm">O</div>
            <span className="text-lg font-bold tracking-tight text-slate-900">OpsMedic</span>
          </div>
        </div>
      </nav>

      {/* Hero Section - Compact */}
      <div className="py-12 px-6 border-b border-slate-50 bg-slate-50/30">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
            Predict Failure Patterns <span className="text-indigo-600">Instantly.</span>
          </h1>
          <p className="text-base text-slate-500 font-medium max-w-xl mx-auto">
            AI-driven engine that classifies CI/CD failure root causes across your entire repository stack with semantic precision.
          </p>
          <div className="flex justify-center items-center space-x-3 pt-2">
            <button
              onClick={() => setMode('repo')}
              className={`px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest border transition-all ${mode === 'repo' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'}`}
            >
              Scanner
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-6 py-2.5 rounded text-xs font-bold uppercase tracking-widest border transition-all ${mode === 'manual' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400'}`}
            >
              Direct Parser
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        {view !== "dashboard" ? (
          <InfoPages view={view as any} onBack={() => setView("dashboard")} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                {mode === "manual" ? (
                  <LogInput onAnalyze={handleAnalyze} loading={loading} />
                ) : (
                  <RepoInput onAnalyze={handleRepoAnalyze} loading={loading} />
                )}
              </div>

              <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-xs text-slate-900 uppercase tracking-widest">Analysis History</h3>
                  <span className="text-[10px] text-slate-400 font-bold">{history.length} RECORDS</span>
                </div>
                <HistoryTable history={history} />
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sticky top-16 space-y-6">
                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm min-h-[300px]">
                  {prediction ? (
                    <PredictionResult
                      prediction={prediction.prediction}
                      confidence={prediction.confidence}
                      topKeywords={prediction.top_keywords}
                      features={prediction.features || {}}
                      isSafe={prediction.is_safe}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center h-full opacity-40">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <span className="text-2xl">📡</span>
                      </div>
                      <h4 className="text-slate-900 font-bold text-sm">System Ready</h4>
                      <p className="text-slate-500 text-xs mt-2 leading-relaxed">Submit diagnostic data to initialize classification.</p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                  <ModelManagement onTrain={handleTrain} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-14 pb-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-indigo-500 rounded flex items-center justify-center text-white font-bold text-[10px] italic">O</div>
                <span className="text-sm font-bold text-white tracking-tight">OpsMedic</span>
              </div>
              <p className="text-sm leading-relaxed">Automating CI/CD failure analysis with precision-engineered AI.</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-widest">Platform</h4>
              <ul className="space-y-1.5 text-sm">
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setView('docs')}>Documentation</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setView('api')}>API Reference</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setView('privacy')}>Privacy & Security</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-widest">Support</h4>
              <ul className="space-y-1.5 text-sm">
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setView('security')}>Security Overview</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setView('infrastructure')}>Infrastructure Health</li>
                <li className="cursor-pointer hover:text-white transition-colors" onClick={() => setView('contact')}>Contact</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-white text-xs uppercase tracking-widest">Socials</h4>
              <ul className="space-y-1.5 text-sm">
                <li><a href="https://www.linkedin.com/in/varadpatil665/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="https://github.com/varadrz" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="http://varadpatil.in/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">varadpatil.in</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-800 pt-6 text-[9px] uppercase font-bold tracking-[0.2em] text-slate-600">
            <p>Developed with ❤️ by Varad Patil</p>
            <div className="flex space-x-5 mt-3 md:mt-0">
              <span>Latency: 12ms</span>
              <span>Uptime: 99.98%</span>
            </div>
          </div>
        </div>
      </footer>

      <Toasts toasts={toasts} onRemove={removeToast} />
    </main>
  );
}
