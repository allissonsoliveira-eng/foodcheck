"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function TaskFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentTab = searchParams.get("tab") || "minhas";
    const currentPriority = searchParams.get("priority") || "";
    const currentStatus = searchParams.get("status") || "";
    const currentType = searchParams.get("type") || "";

    const createQueryString = useCallback(
        (name: string, value: string) => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
                params.set(name, value);
            } else {
                params.delete(name);
            }
            return params.toString();
        },
        [searchParams]
    );

    const handleTabChange = (tab: string) => {
        router.push(`?${createQueryString("tab", tab)}`);
    };

    const handleSelectChange = (name: string, value: string) => {
        router.push(`?${createQueryString(name, value)}`);
    };

    return (
        <>
            {/* Tabs */}
            <div className="flex border-b border-slate-200 mb-6">
                <button
                    onClick={() => handleTabChange("minhas")}
                    className={`px-4 py-3 text-sm font-bold transition-colors ${currentTab === "minhas" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"}`}
                >
                    Minhas Tarefas
                </button>
                <button
                    onClick={() => handleTabChange("setor")}
                    className={`px-4 py-3 text-sm font-bold transition-colors ${currentTab === "setor" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"}`}
                >
                    Meu Setor
                </button>
                <button
                    onClick={() => handleTabChange("todas")}
                    className={`px-4 py-3 text-sm font-bold transition-colors ${currentTab === "todas" ? "text-blue-600 border-b-2 border-blue-600" : "text-slate-500 hover:text-slate-800"}`}
                >
                    Todas (Gestão)
                </button>
            </div>

            {/* Filters Base */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                <select
                    value={currentPriority}
                    onChange={(e) => handleSelectChange("priority", e.target.value)}
                    className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border-none focus:ring-2 outline-none cursor-pointer"
                >
                    <option value="">Todas as Prioridades</option>
                    <option value="BAIXA">Baixa</option>
                    <option value="MEDIA">Média</option>
                    <option value="ALTA">Alta</option>
                    <option value="URGENTE">Urgente</option>
                </select>

                <select
                    value={currentStatus}
                    onChange={(e) => handleSelectChange("status", e.target.value)}
                    className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border-none focus:ring-2 outline-none cursor-pointer"
                >
                    <option value="">Todos os Status</option>
                    <option value="PENDING">Pendente</option>
                    <option value="IN_PROGRESS">Em Andamento</option>
                    <option value="COMPLETED">Concluída</option>
                </select>

                <select
                    value={currentType}
                    onChange={(e) => handleSelectChange("type", e.target.value)}
                    className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-lg border-none focus:ring-2 outline-none cursor-pointer"
                >
                    <option value="">Todos os Tipos</option>
                    <option value="GERAL">Geral</option>
                    <option value="LIMPEZA">Limpeza</option>
                    <option value="MANUTENCAO">Manutenção</option>
                </select>
            </div>
        </>
    );
}
