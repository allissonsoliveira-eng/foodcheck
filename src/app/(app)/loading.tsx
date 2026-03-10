import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 space-y-4 animate-in fade-in duration-300">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
            <p className="text-sm font-medium animate-pulse">Carregando dados...</p>
        </div>
    );
}
