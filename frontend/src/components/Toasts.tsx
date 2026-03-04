"use client";

import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastsProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

export default function Toasts({ toasts, onRemove }: ToastsProps) {
    return (
        <div className="fixed top-8 right-8 z-[100] flex flex-col space-y-3 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onRemove(toast.id);
        }, 5000);
        return () => clearTimeout(timer);
    }, [toast.id, onRemove]);

    const typeStyles = {
        success: "bg-emerald-50 border-emerald-100 text-emerald-700 shadow-emerald-500/5",
        error: "bg-rose-50 border-rose-100 text-rose-700 shadow-rose-500/5",
        info: "bg-blue-50 border-blue-100 text-blue-700 shadow-blue-500/5",
    };

    const icons = {
        success: "✓",
        error: "✕",
        info: "ℹ",
    };

    return (
        <div
            className={`pointer-events-auto flex items-center space-x-3 px-5 py-4 rounded-2xl border shadow-xl backdrop-blur-sm animate-in slide-in-from-top-4 fade-in duration-300 min-w-[320px] ${typeStyles[toast.type]}`}
        >
            <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border text-[10px] font-bold ${toast.type === 'success' ? 'border-emerald-200 bg-emerald-100' : toast.type === 'error' ? 'border-rose-200 bg-rose-100' : 'border-blue-200 bg-blue-100'}`}>
                {icons[toast.type]}
            </div>
            <p className="text-sm font-semibold flex-1 tracking-tight">{toast.message}</p>
            <button
                onClick={() => onRemove(toast.id)}
                className="opacity-40 hover:opacity-100 transition-opacity text-xl font-light"
            >
                ×
            </button>
        </div>
    );
}
