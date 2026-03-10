"use client";

import { useState } from "react";
import { Users, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { assignTask, completeTask } from "./actions";
import { toast } from "react-hot-toast";

interface TaskProps {
    task: any; // Using any for prototyping, should use Prisma generated types
    isManagerOrAdmin: boolean;
    currentUserId: string;
}

export default function TaskCard({ task, isManagerOrAdmin, currentUserId }: TaskProps) {
    const [loading, setLoading] = useState(false);

    const isPending = task.status === "PENDING";
    const isInProgress = task.status === "IN_PROGRESS";
    const isCompleted = task.status === "COMPLETED";

    const isMyTask = task.assigneeId === currentUserId;

    const handleAssign = async () => {
        try {
            setLoading(true);
            await assignTask(task.id);
            toast.success("Tarefa assumida com sucesso!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleComplete = async () => {
        try {
            setLoading(true);
            await completeTask(task.id);
            toast.success("Tarefa concluída!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Styling based on priority/status (Mock logic)
    const isHighPriority = task.priority === "ALTA" || task.priority === "URGENTE";
    const borderColor = isCompleted ? "border-l-emerald-500" : isHighPriority ? "border-l-amber-500" : "border-l-blue-600";

    if (isCompleted) {
        return (
            <div className="card-panel opacity-60 p-4 bg-slate-50 border-l-4 border-l-emerald-500">
                <div className="flex items-center justify-between mb-2">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <Users className="w-3.5 h-3.5" /> SETOR: {task.sector?.name || "GERAL"}
                    </span>
                    <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded">CONCLUÍDO</span>
                </div>
                <h4 className="text-base font-bold text-slate-500 mb-1 line-through decoration-2">{task.title}</h4>
                {task.description && (
                    <p className="text-sm text-slate-400 font-medium italic">{task.description}</p>
                )}
                <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-[10px] font-bold text-slate-400">
                        FINALIZADA POR: <span className="text-slate-500">{task.assignee?.name || "Usuário Removido"}</span>
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className={`card-panel border-l-4 ${borderColor} p-4`}>
            <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {task.assigneeId && !task.sectorId ? (
                        <>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /></svg>
                            NOMINAL: PRIVADO
                        </>
                    ) : (
                        <>
                            <Users className="w-3.5 h-3.5" /> SETOR: {task.sector?.name || "GERAL"}
                        </>
                    )}
                </span>
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${isInProgress ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-800'}`}>
                    {isInProgress ? 'EM ANDAMENTO' : 'PENDENTE'}
                </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 mb-2">{task.title}</h4>

            {task.description && (
                <p className="text-sm text-slate-500 font-medium mb-4 leading-relaxed whitespace-pre-line">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-2 pt-3 border-t border-slate-100">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    {isHighPriority ? (
                        <><AlertTriangle className="w-4 h-4 text-amber-500" /> Alta Prioridade</>
                    ) : (
                        <><Clock className="w-4 h-4 text-blue-600" /> Vence Hoje</>
                    )}
                </span>

                <div className="flex items-center gap-2">
                    {isPending && !task.assigneeId && (
                        <button
                            onClick={handleAssign}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-blue-600/30 flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                            Assumir
                        </button>
                    )}

                    {isInProgress && isMyTask && (
                        <button
                            onClick={handleComplete}
                            disabled={loading}
                            className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 disabled:opacity-70 text-xs font-bold px-4 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                        >
                            {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                            Concluir
                        </button>
                    )}

                    {task.assigneeId && !isMyTask && !isCompleted && (
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                            Com {task.assignee?.name?.split(' ')[0]}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
