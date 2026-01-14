"use client";

import { useToast } from "./toast-context";
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";

export const Toaster = () => {
    const { toasts, removeToast } = useToast();

    return (
        <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
            {toasts.map((toast) => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

const ToastItem = ({ toast, onRemove }: { toast: any; onRemove: (id: string) => void }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Trigger slide-in
        requestAnimationFrame(() => setIsVisible(true));
    }, []);

    const handleRemove = () => {
        setIsVisible(false);
        setTimeout(() => onRemove(toast.id), 300); // Wait for exit animation
    };

    const icons = {
        success: <CheckCircle2 size={18} className="text-green-600" />,
        error: <AlertCircle size={18} className="text-red-600" />,
        warning: <AlertTriangle size={18} className="text-yellow-600" />,
        info: <Info size={18} className="text-blue-600" />,
    };

    const bgStyles = {
        success: "bg-white border-green-100 shadow-[0_4px_12px_-2px_rgba(22,163,74,0.15)]",
        error: "bg-white border-red-100 shadow-[0_4px_12px_-2px_rgba(220,38,38,0.15)]",
        warning: "bg-white border-yellow-100 shadow-[0_4px_12px_-2px_rgba(202,138,4,0.15)]",
        info: "bg-white border-blue-100 shadow-[0_4px_12px_-2px_rgba(37,99,235,0.15)]",
    };

    const type = toast.type || "info";

    return (
        <div
            className={`
        pointer-events-auto
        flex items-start gap-3 p-4 rounded-xl border
        min-w-[320px] max-w-[400px]
        transform transition-all duration-300 ease-out
        ${bgStyles[type as keyof typeof bgStyles]}
        ${isVisible ? "translate-x-0 opacity-100 scale-100" : "translate-x-full opacity-0 scale-95"}
      `}
        >
            <div className={`mt-0.5 shrink-0 ${type === 'success' ? 'animate-[bounce_1s_ease-in-out_1]' : ''}`}>
                {icons[type as keyof typeof icons]}
            </div>
            <div className="flex-1 space-y-1">
                <h3 className="text-sm font-semibold text-slate-800 leading-none">{toast.title}</h3>
                {toast.description && (
                    <p className="text-[13px] text-slate-500 leading-relaxed">{toast.description}</p>
                )}
            </div>
            <button
                onClick={handleRemove}
                className="text-slate-400 hover:text-slate-600 transition-colors"
            >
                <X size={16} />
            </button>
        </div>
    );
};
