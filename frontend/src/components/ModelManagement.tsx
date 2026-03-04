"use client";

import { useState } from "react";

interface ModelManagementProps {
    onTrain: () => Promise<void>;
}

export default function ModelManagement({ onTrain }: ModelManagementProps) {
    const [training, setTraining] = useState(false);
    const [lastMessage, setLastMessage] = useState("");

    const handleTrain = async () => {
        setTraining(true);
        try {
            await onTrain();
            setLastMessage("Model successfully retrained!");
            setTimeout(() => setLastMessage(""), 5000);
        } catch (err) {
            setLastMessage("Training failed. See console for details.");
        } finally {
            setTraining(false);
        }
    };

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold text-slate-900 italic">Model Control</h3>
                    <p className="text-xs text-slate-500 uppercase tracking-tight">Base Model: BernoulliNB</p>
                </div>
                <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]" />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-100 rounded text-xs text-slate-600 leading-relaxed italic">
                System will process historical pattern data to refine classification accuracy via cross-entropy validation.
            </div>

            <button
                onClick={handleTrain}
                disabled={training}
                className="w-full py-2.5 bg-indigo-600 hover:bg-slate-900 disabled:bg-slate-100 disabled:text-slate-400 text-white text-sm font-semibold rounded transition-all active:scale-[0.99] flex items-center justify-center space-x-2 shadow-sm"
            >
                {training ? (
                    <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="uppercase tracking-wide">Refining Weights...</span>
                    </>
                ) : (
                    <>
                        <span className="uppercase tracking-wide italic">Synchronize Neural Map</span>
                    </>
                )}
            </button>

            {lastMessage && (
                <div className={`p-2 rounded border text-[9px] font-bold uppercase transition-all duration-300 ${lastMessage.includes('failed') ? 'bg-red-50 text-red-700 border-red-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'}`}>
                    {lastMessage}
                </div>
            )}
        </div>
    );
}
