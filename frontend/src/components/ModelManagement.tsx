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
        <div className="p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-2xl mt-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-slate-100 mb-1">Model Management</h2>
                    <p className="text-slate-400 text-sm">Update the ML classifier with latest historical data</p>
                </div>
                <button
                    onClick={handleTrain}
                    disabled={training}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-900 text-slate-200 text-sm font-medium rounded-lg border border-slate-700 transition-all active:scale-95 flex items-center space-x-2"
                >
                    {training && <div className="w-4 h-4 border-2 border-slate-400 border-t-white rounded-full animate-spin" />}
                    <span>{training ? "Retraining Engine..." : "Retrain Model"}</span>
                </button>
            </div>
            {lastMessage && (
                <div className={`mt-4 p-3 rounded-lg text-xs font-medium ${lastMessage.includes('failed') ? 'bg-red-900/20 text-red-400 border border-red-900/50' : 'bg-green-900/20 text-green-400 border border-green-900/50'}`}>
                    {lastMessage}
                </div>
            )}
        </div>
    );
}
